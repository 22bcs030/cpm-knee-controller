"use client"

import { useState, useEffect } from "react"
import { useCPM } from "@/context/cpm-context"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

export default function ControlPanel() {
  const { angles, setAngles, isConnected, isRunning, activeMotion } = useCPM()
  const [localAngles, setLocalAngles] = useState(angles)

  useEffect(() => {
    setLocalAngles(angles)
  }, [angles])

  const handleSliderChange = (value: number[], axis: "pitch" | "yaw" | "roll") => {
    const newAngles = { ...localAngles, [axis]: value[0] }
    setLocalAngles(newAngles)
    setAngles(newAngles)
  }

  const handleInputChange = (value: string, axis: "pitch" | "yaw" | "roll") => {
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue)) {
      const newAngles = { ...localAngles, [axis]: numValue }
      setLocalAngles(newAngles)
      setAngles(newAngles)
    }
  }

  const getMotionDetails = () => {
    if (activeMotion === "pitch") {
      const isPlantar = localAngles.pitch >= 0
      return {
        title: isPlantar ? "Plantar flexion" : "Dorsiflexion",
        min: -30,
        max: 40,
        value: localAngles.pitch,
        isExceeded: isPlantar ? localAngles.pitch > 40 : localAngles.pitch < -30,
        warningText: isPlantar
          ? "Plantar flexion should not exceed 40° for safety"
          : "Dorsiflexion should not exceed -30° for safety",
        description: isPlantar
          ? "Movement of pointing the toes downward"
          : "Movement of bringing the toes up toward the shin",
        range: isPlantar ? "0° to 40°" : "0° to -30°",
      }
    } else if (activeMotion === "roll") {
      const isEversion = localAngles.roll >= 0
      return {
        title: isEversion ? "Eversion" : "Inversion",
        min: -30,
        max: 20,
        value: localAngles.roll,
        isExceeded: isEversion ? localAngles.roll > 20 : localAngles.roll < -30,
        warningText: isEversion
          ? "Eversion should not exceed 20° for safety"
          : "Inversion should not exceed -30° for safety",
        description: isEversion
          ? "Movement of turning the sole of the foot outward"
          : "Movement of turning the sole of the foot inward",
        range: isEversion ? "0° to 20°" : "0° to -30°",
      }
    } else if (activeMotion === "yaw") {
      const isAdduction = localAngles.yaw >= 0
      return {
        title: isAdduction ? "Adduction" : "Abduction",
        min: -30,
        max: 20,
        value: localAngles.yaw,
        isExceeded: isAdduction ? localAngles.yaw > 20 : localAngles.yaw < -30,
        warningText: isAdduction
          ? "Adduction should not exceed 20° for safety"
          : "Abduction should not exceed -30° for safety",
        description: isAdduction
          ? "Movement of the foot toward the midline of the body"
          : "Movement of the foot away from the midline of the body",
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
          <CardTitle>Motion Control</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40 text-muted-foreground">
            Please connect to the CPM device to access controls
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!activeMotion) {
    return (
      <Card className="card-gradient shadow-lg border-2 border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
        <CardHeader>
          <CardTitle>Motion Control</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40 text-muted-foreground">
            Please select a motion type first
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!motionDetails) return null

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="card-gradient shadow-lg border-2 border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{activeMotion.charAt(0).toUpperCase() + activeMotion.slice(1)} Control</span>
            <Badge variant="outline" className="ml-2">
              {motionDetails.range}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-medium">{motionDetails.title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">{motionDetails.description}</p>
            </div>
            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              <Badge variant={isRunning ? "default" : "outline"}>{isRunning ? "Active" : "Ready"}</Badge>
              <Input
                type="number"
                value={motionDetails.value}
                onChange={(e) => handleInputChange(e.target.value, activeMotion)}
                className="w-16 sm:w-20"
                min={motionDetails.min}
                max={motionDetails.max}
                disabled={!isConnected || isRunning}
              />
            </div>
          </div>

          {/* === SLIDER SECTION START === */}
          <div className="pt-2">
            <div className="relative">
              {/* Blue center line */}
              <div className="absolute inset-0 pointer-events-none">
                <div
                  className="absolute top-0 bottom-0 w-px bg-blue-400 dark:bg-blue-300"
                  style={{
                    left: `${((0 - motionDetails.min) / (motionDetails.max - motionDetails.min)) * 100}%`,
                    transform: "translateX(-0.5px)", // Center 1px width
                  }}
                ></div>
              </div>

              {/* Aligned labels */}
              <div className="relative h-5 mb-1">
                {/* Min Label */}
                <span className="absolute left-0 text-xs sm:text-sm font-medium">{motionDetails.min}°</span>

                {/* 0° Label */}
                <span
                  className="absolute text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-medium"
                  style={{
                    left: `${((0 - motionDetails.min) / (motionDetails.max - motionDetails.min)) * 100}%`,
                    transform: "translateX(-50%)",
                  }}
                >
                  0°
                </span>

                {/* Max Label */}
                <span className="absolute right-0 text-xs sm:text-sm font-medium">{motionDetails.max}°</span>
              </div>

              <Slider
                min={motionDetails.min}
                max={motionDetails.max}
                step={1}
                value={[motionDetails.value]}
                onValueChange={(value) => handleSliderChange(value, activeMotion)}
                disabled={!isConnected || isRunning}
                className="py-4"
              />
            </div>
            <div className="mt-2 text-center">
              <span
                className={`text-sm font-medium px-3 py-1 rounded-full ${
                  motionDetails.isExceeded
                    ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                    : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                }`}
              >
                Current value: {motionDetails.value}°
              </span>
            </div>
          </div>
          {/* === SLIDER SECTION END === */}

          {motionDetails.isExceeded && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>Warning: {motionDetails.warningText}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
