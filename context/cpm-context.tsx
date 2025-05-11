"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useRef } from "react"
import { createESPConnection, parseESPMessage } from "@/utils/websocket-connection"
import { useToast } from "@/components/ui/use-toast"

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
  deviceIP: string
  setActiveMotion: (motion: MotionType) => void
  setAngles: (angles: Angles) => void
  connect: () => void
  disconnect: () => void
  startSession: () => void
  stopSession: () => void
  calibrate: () => void
  clearSessionLogs: () => void
  updateDeviceIP: (newIP: string) => void
}

// Create context
const CPMContext = createContext<CPMContextType | undefined>(undefined)

// Create provider component
export function CPMProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()
  const [isConnected, setIsConnected] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [angles, setAngles] = useState<Angles>({ pitch: 0, yaw: 0, roll: 0 })
  const [currentAngles, setCurrentAngles] = useState<Angles>({ pitch: 0, yaw: 0, roll: 0 })
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null)
  const [sessionLogs, setSessionLogs] = useState<SessionLog[]>([])
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [activeMotion, setActiveMotion] = useState<MotionType>(null)
  const [deviceIP, setDeviceIP] = useState<string>("192.168.137.102") // Default IP, can be changed
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Real WebSocket connection to ESP8266
  const connect = () => {
    // Clear any existing reconnection attempts
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }

    try {
      // Create real WebSocket connection
      console.log(`Connecting to ESP8266 at ${deviceIP}...`)
      addSessionLog(`Attempting to connect to device at ${deviceIP}`)
      
      const newSocket = createESPConnection({
        ipAddress: deviceIP,
        onOpen: () => {
          setIsConnected(true)
          addSessionLog("Connected to device")
          toast({
            title: "Connected",
            description: `Successfully connected to CPM device at ${deviceIP}`,
          })
        },
        onMessage: (event) => {
          const data = parseESPMessage(event.data)
          if (!data) return
          
          // Update state based on received data
          if (data.pitch !== undefined && data.roll !== undefined && data.yaw !== undefined) {
            setCurrentAngles({
              pitch: data.pitch,
              roll: data.roll,
              yaw: data.yaw,
            })
          }
          
          // Update motion status
          if (data.status === "running") {
            setIsRunning(true)
          } else if (data.status === "stopped") {
            setIsRunning(false)
          } else if (data.status === "calibrated") {
            // Handle calibration complete
            console.log(`Calibration complete for ${data.motion} - setting to 0`); // Debug log
            
            // Update both current angles and target angles
            const updatedAngles = {
              ...currentAngles,
              [data.motion]: 0
            };
            
            setCurrentAngles(updatedAngles);
            setAngles(updatedAngles);
            
            addSessionLog(`${data.motion.toUpperCase()} calibration completed`);
            
            toast({
              title: "Calibration Complete",
              description: `${data.motion} has been calibrated successfully`,
            });
          }
        },
        onClose: () => {
          setIsConnected(false)
          addSessionLog("Disconnected from device")
          
          // Attempt to reconnect after 5 seconds
          reconnectTimeoutRef.current = setTimeout(() => {
            if (!isConnected) {
              connect()
            }
          }, 10000)
        },
        onError: () => {
          toast({
            title: "Connection Error",
            description: "Failed to connect to the CPM device",
            variant: "destructive",
          })
        }
      })
      
      setSocket(newSocket)
    } catch (error) {
      console.error("Connection error:", error)
      addSessionLog(`Connection error: ${error}`)
      toast({
        title: "Connection Failed",
        description: "Could not connect to the CPM device. Check if the device is powered on and on the same network.",
        variant: "destructive",
      })
    }
  }

  const disconnect = () => {
    // Clear any reconnection attempts
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    if (isRunning) {
      stopSession()
    }

    if (socket) {
      socket.close()
      setSocket(null)
    }

    setIsConnected(false)
    setActiveMotion(null)
    addSessionLog("Disconnected from device")
    
    toast({
      title: "Disconnected",
      description: "Successfully disconnected from CPM device",
    })
  }

  const startSession = () => {
    if (!isConnected || !activeMotion) return

    setIsRunning(true)
    setSessionStartTime(Date.now())
    addSessionLog(`${activeMotion.toUpperCase()} motion session started`, angles, activeMotion)

    // Send command to ESP8266
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

    // Send command to ESP8266
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

    // Send command to ESP8266
    if (socket) {
      const command = {
        command: "calibrate",
        motionType: activeMotion,
      }
      socket.send(JSON.stringify(command))
      
      // Immediately reset both angles and currentAngles for the active motion
      setAngles((prev) => ({
        ...prev,
        [activeMotion]: 0,
      }))
      
      setCurrentAngles((prev) => ({
        ...prev,
        [activeMotion]: 0,
      }))
      
      console.log(`Calibrating ${activeMotion} - resetting to 0`); // Debug log
      
      toast({
        title: "Calibrating",
        description: `Calibrating ${activeMotion} motion. Please wait...`,
      })
    }
  }

  // Update device IP
  const updateDeviceIP = (newIP: string) => {
    setDeviceIP(newIP)
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.close()
      }
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [socket])

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

  // Context value
  const value = {
    isConnected,
    isRunning,
    angles,
    currentAngles,
    sessionStartTime,
    sessionLogs,
    activeMotion,
    deviceIP,
    setActiveMotion,
    setAngles,
    connect,
    disconnect,
    startSession,
    stopSession,
    calibrate,
    clearSessionLogs,
    updateDeviceIP,
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
