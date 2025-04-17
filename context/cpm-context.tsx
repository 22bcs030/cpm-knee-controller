"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define types
interface Angles {
  pitch: number
  yaw: number
  roll: number
}

export type MotionType = "pitch" | "roll" | "yaw" | null

interface SessionLog {
  timestamp: string
  action: string
  angles?: Angles
  motionType?: MotionType
}

interface CPMContextType {
  isConnected: boolean
  isRunning: boolean
  angles: Angles
  currentAngles: Angles
  sessionStartTime: number | null
  sessionLogs: SessionLog[]
  activeMotion: MotionType
  setActiveMotion: (motion: MotionType) => void
  setAngles: (angles: Angles) => void
  connect: () => void
  disconnect: () => void
  startSession: () => void
  stopSession: () => void
  calibrate: () => void
  clearSessionLogs: () => void // New function to clear session logs
}

// Create context
const CPMContext = createContext<CPMContextType | undefined>(undefined)

// Create provider component
export function CPMProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [angles, setAngles] = useState<Angles>({ pitch: 0, yaw: 0, roll: 0 })
  const [currentAngles, setCurrentAngles] = useState<Angles>({ pitch: 0, yaw: 0, roll: 0 })
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null)
  const [sessionLogs, setSessionLogs] = useState<SessionLog[]>([])
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [activeMotion, setActiveMotion] = useState<MotionType>(null)

  // Simulate WebSocket connection
  const connect = () => {
    // In a real app, this would connect to the ESP32 WebSocket
    console.log("Connecting to ESP32...")

    // Simulate connection delay
    setTimeout(() => {
      setIsConnected(true)
      addSessionLog("Connected to device")

      // Simulate WebSocket
      const mockSocket = {
        send: (data: string) => {
          console.log("Sent to ESP32:", data)
        },
        close: () => {
          console.log("WebSocket closed")
        },
      } as unknown as WebSocket

      setSocket(mockSocket)
    }, 1000)
  }

  const disconnect = () => {
    if (isRunning) {
      stopSession()
    }

    if (socket) {
      socket.close()
    }

    setIsConnected(false)
    setActiveMotion(null)
    addSessionLog("Disconnected from device")
  }

  const startSession = () => {
    if (!isConnected || !activeMotion) return

    setIsRunning(true)
    setSessionStartTime(Date.now())
    addSessionLog(`${activeMotion.toUpperCase()} motion session started`, angles, activeMotion)

    // Send command to ESP32
    if (socket) {
      const command = {
        [activeMotion]: angles[activeMotion],
        command: "start",
        motionType: activeMotion,
      }
      socket.send(JSON.stringify(command))
    }
  }

  const stopSession = () => {
    if (!isConnected || !isRunning) return

    setIsRunning(false)
    addSessionLog(`${activeMotion?.toUpperCase()} motion session stopped`, currentAngles, activeMotion)

    // Send command to ESP32
    if (socket) {
      const command = {
        command: "stop",
      }
      socket.send(JSON.stringify(command))
    }
  }

  const calibrate = () => {
    if (!isConnected || isRunning || !activeMotion) return

    addSessionLog(`${activeMotion.toUpperCase()} calibration started`, undefined, activeMotion)

    // Send command to ESP32
    if (socket) {
      const command = {
        command: "calibrate",
        motionType: activeMotion,
      }
      socket.send(JSON.stringify(command))
    }

    // Simulate calibration process
    setTimeout(() => {
      setCurrentAngles((prev) => ({
        ...prev,
        [activeMotion]: 0,
      }))
      setAngles((prev) => ({
        ...prev,
        [activeMotion]: 0,
      }))
      addSessionLog(`${activeMotion.toUpperCase()} calibration completed`, undefined, activeMotion)
    }, 2000)
  }

  // New function to clear session logs
  const clearSessionLogs = () => {
    setSessionLogs([])
    console.log("Session logs cleared")
    // Only reset session start time if not currently running
    if (!isRunning) {
      setSessionStartTime(null)
    }
  }

  const addSessionLog = (action: string, angles?: Angles, motionType?: MotionType) => {
    const now = new Date()
    const timestamp = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })

    setSessionLogs((prev) => [...prev, { timestamp, action, angles, motionType }])
  }

  // Simulate receiving data from ESP32
  useEffect(() => {
    if (!isConnected || !activeMotion) return

    let interval: NodeJS.Timeout

    if (isRunning) {
      interval = setInterval(() => {
        // Simulate gradual movement towards target angles for the active motion only
        setCurrentAngles((prev) => {
          const newAngles = { ...prev }

          // Only update the active motion
          newAngles[activeMotion] =
            prev[activeMotion] + (angles[activeMotion] - prev[activeMotion]) * 0.1 + (Math.random() * 0.4 - 0.2)

          return newAngles
        })
      }, 100)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isConnected, isRunning, angles, activeMotion])

  // Context value
  const value = {
    isConnected,
    isRunning,
    angles,
    currentAngles,
    sessionStartTime,
    sessionLogs,
    activeMotion,
    setActiveMotion,
    setAngles,
    connect,
    disconnect,
    startSession,
    stopSession,
    calibrate,
    clearSessionLogs, // Add the new function to the context value
  }

  return <CPMContext.Provider value={value}>{children}</CPMContext.Provider>
}

// Custom hook to use the context
export function useCPM() {
  const context = useContext(CPMContext)
  if (context === undefined) {
    throw new Error("useCPM must be used within a CPMProvider")
  }
  return context
}
