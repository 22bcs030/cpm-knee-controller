#include <ArduinoJson.h>
#include <math.h>

// Roll motor ON/OFF pin
const int ROLL_MOTOR_PIN = 10;

// Pitch motor pins
const int PITCH_PULSE_PIN = 3;
const int PITCH_DIR_PIN   = 4;

// Yaw motor pins
const int YAW_PULSE_PIN = 5;
const int YAW_DIR_PIN   = 6;

// Stepper timing
const int STEP_DELAY_MICROS = 500;

// Pitch constants
const float PITCH_STEPS_PER_REV = 200.0;
const float PITCH_MM_PER_REV = 1.0;
const float PITCH_ARM_LENGTH = 300.0;
const float PITCH_STEPS_PER_MM = PITCH_STEPS_PER_REV / PITCH_MM_PER_REV;

// Yaw constants (simplified logic)
const float YAW_PIVOT_DISTANCE = 300.0;
const float SPUR_GEAR_DIAMETER = 38.0;
const float YAW_STEPS_PER_REV = 200.0;
const float SPUR_GEAR_CIRCUMFERENCE = PI * SPUR_GEAR_DIAMETER;
const unsigned long YAW_STEP_INTERVAL = 1000000UL / 50; // Fixed 50 steps/sec

// Variables for yaw motion
volatile long yawCurrentPos = 0;
volatile long yawTargetPos = 0;
volatile int yawDirection = 1;
volatile bool yawRun = false;
unsigned long yawLastStepTime = 0;

void setup() {
  Serial.begin(9600);
  Serial1.begin(115200);

  pinMode(ROLL_MOTOR_PIN, OUTPUT);
  pinMode(PITCH_PULSE_PIN, OUTPUT);
  pinMode(PITCH_DIR_PIN, OUTPUT);
  pinMode(YAW_PULSE_PIN, OUTPUT);
  pinMode(YAW_DIR_PIN, OUTPUT);

  digitalWrite(ROLL_MOTOR_PIN, LOW);
  digitalWrite(PITCH_PULSE_PIN, LOW);
  digitalWrite(PITCH_DIR_PIN, LOW);
  digitalWrite(YAW_PULSE_PIN, LOW);
  digitalWrite(YAW_DIR_PIN, LOW);

  Serial.println("Controller ready (Mega).");
}

void loop() {
  if (Serial1.available()) {
    String json = Serial1.readStringUntil('\n');
    processMessage(json);
  }

  runYawMotor();
}

void processMessage(String message) {
  StaticJsonDocument<256> doc;
  DeserializationError err = deserializeJson(doc, message);
  if (err) {
    Serial.println("Invalid JSON");
    return;
  }

  if (doc.containsKey("command") && doc.containsKey("motionType")) {
    String command = doc["command"];
    String motion = doc["motionType"];

    if (command == "start") {
      if (motion == "pitch" && doc.containsKey("pitch")) {
        moveStepper("pitch", doc["pitch"]);
      }
      else if (motion == "yaw" && doc.containsKey("yaw")) {
        startYawMovement(doc["yaw"]);
      }
      else if (motion == "roll") {
        digitalWrite(ROLL_MOTOR_PIN, HIGH);
        Serial.println("Roll motor ON");
      }
    }

    if (command == "stop") {
      digitalWrite(ROLL_MOTOR_PIN, LOW);
      Serial.println("STOP command received");
    }
  }
  else if (doc["status"] == "ready" && doc.containsKey("activeMotion")) {
    String motion = doc["activeMotion"];
    float pitch = doc["pitch"];
    float yaw = doc["yaw"];
    float roll = doc["roll"];

    if (motion == "pitch") {
      moveStepper("pitch", pitch);
    }
    else if (motion == "yaw") {
      startYawMovement(yaw);
    }
    else if (motion == "roll") {
      digitalWrite(ROLL_MOTOR_PIN, roll != 0 ? HIGH : LOW);
      Serial.println(roll != 0 ? "Roll motor ON" : "Roll motor OFF");
    }
  }
  else {
    Serial.println("Unknown JSON format");
  }
}

void moveStepper(String type, float angle) {
  if (type == "pitch") {
    int steps = pitchAngleToSteps(angle);
    bool dir = angle >= 0;

    digitalWrite(PITCH_DIR_PIN, dir ? HIGH : LOW);

    Serial.print(dir ? "P " : "N ");
    Serial.print(abs(angle));
    Serial.print(" ");
    Serial.println("800");

    for (int i = 0; i < steps; i++) {
      digitalWrite(PITCH_PULSE_PIN, HIGH);
      delayMicroseconds(STEP_DELAY_MICROS);
      digitalWrite(PITCH_PULSE_PIN, LOW);
      delayMicroseconds(STEP_DELAY_MICROS);
    }
  }
}

int pitchAngleToSteps(float angle) {
  float rad = radians(angle);
  float travel_mm = 0.5 * tan(rad) * PITCH_ARM_LENGTH;
  float steps = abs(travel_mm) * PITCH_STEPS_PER_MM;

  Serial.print("Pitch Angle: "); Serial.print(angle);
  Serial.print("°, Travel (mm): "); Serial.print(travel_mm);
  Serial.print(", Steps: "); Serial.println(steps);

  return (int)steps;
}

// ==== YAW CODE ONLY (simplified logic with 50 steps/sec) ====
void startYawMovement(float angle) {
  float arcLength = (angle * PI * YAW_PIVOT_DISTANCE) / 180.0;
  float gearCirc = SPUR_GEAR_CIRCUMFERENCE;
  float revolutions = arcLength / gearCirc;
  long steps = long(2 * revolutions * YAW_STEPS_PER_REV); // 2:1 gear assumed

  yawDirection = (angle >= 0) ? 1 : -1;
  yawTargetPos = yawCurrentPos + yawDirection * abs(steps);
  digitalWrite(YAW_DIR_PIN, (yawDirection == 1) ? HIGH : LOW);
  yawRun = true;

  Serial.print("Yaw: ");
  Serial.print(angle, 2);
  Serial.print("° = ");
  Serial.print(steps);
  Serial.println(" steps");
}

void runYawMotor() {
  if (yawRun) {
    unsigned long now = micros();
    if (now - yawLastStepTime >= YAW_STEP_INTERVAL) {
      yawLastStepTime = now;

      digitalWrite(YAW_PULSE_PIN, HIGH);
      delayMicroseconds(2);
      digitalWrite(YAW_PULSE_PIN, LOW);

      yawCurrentPos += (yawDirection == 1) ? 1 : -1;

      if (yawCurrentPos == yawTargetPos) {
        yawRun = false;
        Serial.println("Yaw movement complete.");
      }
    }
  }
}