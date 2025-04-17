"use client"

import { useCPM } from "@/context/cpm-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, RotateCw, MoveHorizontal, Wifi, WifiOff } from "lucide-react"
import { motion } from "framer-motion"

export default function DataDisplay() {
  const { currentAngles, isConnected, isRunning, activeMotion } = useCPM()

  // Get motion details based on the active motion
  const getMotionDetails = () => {
    if (activeMotion === "pitch") {
      const isPlantar = currentAngles.pitch >= 0
      return {
        icon: <ArrowUpDown className="h-6 w-6" />,
        title: "Pitch",
        value: currentAngles.pitch,
        movement: isPlantar ? "Plantar flexion" : "Dorsiflexion",
        range: isPlantar ? "0° to 40°" : "0° to -30°",
      }
    } else if (activeMotion === "roll") {
      const isEversion = currentAngles.roll >= 0
      return {
        icon: <MoveHorizontal className="h-6 w-6" />,
        title: "Roll",
        value: currentAngles.roll,
        movement: isEversion ? "Eversion" : "Inversion",
        range: isEversion ? "0° to 20°" : "0° to -30°",
      }
    } else if (activeMotion === "yaw") {
      const isAdduction = currentAngles.yaw >= 0
      return {
        icon: <RotateCw className="h-6 w-6" />,
        title: "Yaw",
        value: currentAngles.yaw,
        movement: isAdduction ? "Adduction" : "Abduction",
        range: isAdduction ? "0° to 20°" : "0° to -30°",
      }
    }

    return null
  }

  const motionDetails = getMotionDetails()

  if (!isConnected) {
    return (
      <Card className="card-gradient shadow-lg border-2 border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <WifiOff className="h-5 w-5 text-muted-foreground" />
            Device Disconnected
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40 text-muted-foreground">
            Connect to the CPM device to view live data
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!activeMotion) {
    return (
      <Card className="card-gradient shadow-lg border-2 border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5 text-green-500" />
            Device Connected
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40 text-muted-foreground">
            Select a motion type to view live data
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!motionDetails) return null

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="card-gradient shadow-lg border-2 border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-medium flex items-center gap-2">
            <Wifi className="h-5 w-5 text-green-500 animate-pulse" />
            Live Sensor Data
          </CardTitle>
          {motionDetails.icon}
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-4 sm:py-6">
            <div className="text-4xl sm:text-6xl font-bold mb-2 tabular-nums bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400 text-transparent bg-clip-text">
              {motionDetails.value.toFixed(1)}°
            </div>
            <div className="flex flex-col items-center">
              <p className="text-base sm:text-lg font-medium">{motionDetails.movement}</p>
              <Badge variant="outline" className="mt-1 glass-card">
                {motionDetails.range}
              </Badge>
            </div>
            <div className="w-full mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${isRunning ? "bg-green-500 animate-pulse" : "bg-amber-500"}`}
                  ></div>
                  <span className="text-xs sm:text-sm font-medium">
                    {isRunning ? "Machine Active" : "Machine Ready"}
                  </span>
                </div>
                <Badge variant={isRunning ? "default" : "secondary"} className={isRunning ? "animate-pulse" : ""}>
                  {isRunning ? "Running" : "Idle"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
