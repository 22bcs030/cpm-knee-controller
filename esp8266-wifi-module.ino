#include <ESP8266WiFi.h>
#include <WebSocketsServer.h>
#include <ArduinoJson.h>

// WiFi credentials - replace with your actual WiFi details
const char* ssid = "AY2328";   // Your WiFi network name
const char* password = "22222222";  // Your WiFi password

// WebSocket server port
WebSocketsServer webSocket = WebSocketsServer(80);

// Buffer for received messages
String inputBuffer = "";

// Timer for sending status updates
unsigned long lastStatusUpdate = 0;
const unsigned long STATUS_UPDATE_INTERVAL = 1000; // 1 second

// Current position tracking
float currentPitch = 0;
float currentYaw = 0;
float currentRoll = 0;
bool isRunning = false;

void setup() {
  // Start Serial communication with Arduino Mega
  Serial.begin(115200);
  delay(100);
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  
  // Start WebSocket server
  webSocket.begin();
  webSocket.onEvent(webSocketEvent);
  
  Serial.println("WebSocket server started");
  
  // Send initial state to all clients
  broadcastCurrentState();
}

void loop() {
  webSocket.loop();
  
  // Check for messages from Arduino Mega
  while (Serial.available()) {
    char c = Serial.read();
    inputBuffer += c;
    
    // Complete message received (newline)
    if (c == '\n') {
      // Process the message from Arduino Mega
      processArduinoMessage(inputBuffer);
      
      // Clear the buffer for next message
      inputBuffer = "";
    }
  }
  
  // Periodically send status updates to clients if machine is running
  if (isRunning && (millis() - lastStatusUpdate > STATUS_UPDATE_INTERVAL)) {
    broadcastCurrentState();
    lastStatusUpdate = millis();
  }
}

void processArduinoMessage(String message) {
  Serial.print("Received from Arduino: ");
  Serial.println(message);
  
  // Parse JSON message
  StaticJsonDocument<256> doc;
  DeserializationError err = deserializeJson(doc, message);
  
  if (err) {
    Serial.println("Invalid JSON from Arduino");
    return;
  }
  
  // Update current angles if provided
  if (doc.containsKey("pitch")) currentPitch = doc["pitch"];
  if (doc.containsKey("yaw")) currentYaw = doc["yaw"];
  if (doc.containsKey("roll")) currentRoll = doc["roll"];
  
  // Check for status updates
  if (doc.containsKey("status")) {
    String status = doc["status"];
    
    // Handle calibration response
    if (status == "calibrated") {
      Serial.println("Calibration response received - forwarding to web clients");
      // Update our stored values
      if (doc.containsKey("motion")) {
        String motion = doc["motion"];
        if (motion == "pitch") currentPitch = 0;
        else if (motion == "yaw") currentYaw = 0;
        else if (motion == "roll") currentRoll = 0;
      }
    }
    
    // Forward message to all connected WebSocket clients
    webSocket.broadcastTXT(message);
  }
}

void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    case WStype_DISCONNECTED:
      Serial.printf("[%u] Disconnected!\n", num);
      break;
      
    case WStype_CONNECTED:
      {
        IPAddress ip = webSocket.remoteIP(num);
        Serial.printf("[%u] Connected from %d.%d.%d.%d\n", num, ip[0], ip[1], ip[2], ip[3]);
        
        // Send a welcome message and current state
        webSocket.sendTXT(num, "{\"status\":\"connected\",\"message\":\"ESP8266 connected\"}");
        
        // Send current angles and state
        broadcastCurrentState();
      }
      break;
      
    case WStype_TEXT:
      {
        // Print received message to Serial Monitor
        Serial.printf("[%u] Received text: %s\n", num, payload);
        
        // Parse the message to determine if it's a calibration command
        String message = (char*)payload;
        
        // Parse JSON for status updates
        StaticJsonDocument<256> doc;
        DeserializationError err = deserializeJson(doc, message);
        
        if (!err && doc.containsKey("command")) {
          String command = doc["command"];
          
          // Update running state based on commands
          if (command == "start") isRunning = true;
          else if (command == "stop") isRunning = false;
          
          // Check for calibration command
          if (command == "calibrate") {
            Serial.println("Calibration command received - forwarding to Arduino");
          }
        }
        
        // Forward the message to Arduino Mega
        Serial.println(message);
      }
      break;
  }
}

// Send current state to all WebSocket clients
void broadcastCurrentState() {
  // Create a JSON document with current values
  StaticJsonDocument<256> doc;
  doc["status"] = isRunning ? "running" : "ready";
  doc["pitch"] = currentPitch;
  doc["yaw"] = currentYaw;
  doc["roll"] = currentRoll;
  
  // Serialize to string
  String state;
  serializeJson(doc, state);
  
  // Send to all clients
  webSocket.broadcastTXT(state);
} 