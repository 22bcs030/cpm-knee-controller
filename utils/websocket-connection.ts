// WebSocket connection utility for ESP8266
// This file manages the WebSocket connection to the ESP8266 module

// Configuration - update with your ESP8266's IP address
const DEFAULT_ESP_IP = "192.168.137.125"; // Update with your ESP's IP address
const DEFAULT_ESP_PORT = 81;

export interface WSConnectionConfig {
  ipAddress?: string;
  port?: number;
  onOpen?: (event: Event) => void;
  onMessage?: (event: MessageEvent) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
}

/**
 * Creates a WebSocket connection to the ESP8266
 */
export function createESPConnection(config: WSConnectionConfig = {}): WebSocket {
  const {
    ipAddress = DEFAULT_ESP_IP,
    port = DEFAULT_ESP_PORT,
    onOpen,
    onMessage,
    onClose,
    onError,
  } = config;

  const wsUrl = `ws://${ipAddress}:${port}`;
  console.log(`Connecting to ESP8266 at ${wsUrl}...`);

  try {
    const socket = new WebSocket(wsUrl);

    // Set up event handlers
    socket.onopen = (event) => {
      console.log("Connected to ESP8266");
      if (onOpen) onOpen(event);
    };

    socket.onmessage = (event) => {
      console.log("Received from ESP8266:", event.data);
      if (onMessage) onMessage(event);
    };

    socket.onclose = (event) => {
      console.log("Disconnected from ESP8266");
      if (onClose) onClose(event);
    };

    socket.onerror = (event) => {
      console.error("WebSocket error:", event);
      if (onError) onError(event);
    };

    return socket;
  } catch (error) {
    console.error("Failed to create WebSocket connection:", error);
    throw error;
  }
}

/**
 * Parses the ESP8266 message data
 */
export function parseESPMessage(data: string) {
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to parse ESP8266 message:", error);
    return null;
  }
}

/**
 * Creates a connection configuration object with the device's IP
 */
export function createConnectionConfig(ipAddress: string): WSConnectionConfig {
  return {
    ipAddress,
    port: DEFAULT_ESP_PORT,
  };
} 
