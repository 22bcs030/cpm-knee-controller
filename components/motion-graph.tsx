"use client"

import { useState, useEffect } from "react"
import { useCPM } from "@/context/cpm-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Tooltip,
} from "recharts"
import { Wifi, WifiOff } from "lucide-react"
import { motion } from "framer-motion"

// Define the data point structure
interface DataPoint {
  time: string
  value: number
}

export default function MotionGraph() {
  const { currentAngles, isConnected, isRunning, activeMotion } = useCPM()
  const [data, setData] = useState<DataPoint[]>([])

  // Reset data when motion type changes
  useEffect(() => {
    setData([])
  }, [activeMotion])

  // Add new data point every second when connected
  useEffect(() => {
    if (!isConnected || !activeMotion) {
      return
    }

    // Add initial data point
    const now = new Date()
    const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })

    setData([
      {
        time: timeString,
        value: activeMotion ? currentAngles[activeMotion] : 0,
      },
    ])

    const interval = setInterval(() => {
      const now = new Date()
      const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })

      setData((prevData) => {
        // Keep only the last 30 data points (30 seconds of data)
        const newData = [
          ...prevData,
          {
            time: timeString,
            value: activeMotion ? currentAngles[activeMotion] : 0,
          },
        ]

        if (newData.length > 30) {
          return newData.slice(newData.length - 30)
        }
        return newData
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isConnected, activeMotion, currentAngles])

  // Update data when current angles change
  useEffect(() => {
    if (!isConnected || !activeMotion) {
      return
    }

    // Only update the last data point if we have data
    if (data.length > 0) {
      setData((prevData) => {
        const newData = [...prevData]
        const lastIndex = newData.length - 1

        // Update the last data point with the new value
        newData[lastIndex] = {
          ...newData[lastIndex],
          value: currentAngles[activeMotion],
        }

        return newData
      })
    }
  }, [currentAngles, isConnected, activeMotion, data.length])

  // Get motion details based on the active motion
  const getMotionDetails = () => {
    if (activeMotion === "pitch") {
      return {
        title: "Pitch Motion",
        min: -35,
        max: 45,
        color: "#3b82f6", // blue-500
      }
    } else if (activeMotion === "roll") {
      return {
        title: "Roll Motion",
        min: -35,
        max: 25,
        color: "#10b981", // emerald-500
      }
    } else if (activeMotion === "yaw") {
      return {
        title: "Yaw Motion",
        min: -35,
        max: 25,
        color: "#f43f5e", // rose-500
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
            Motion Graph
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            Connect to the CPM device to view motion graph
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
            Motion Graph
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            Select a motion type to view motion graph
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
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5 text-green-500 animate-pulse" />
            {motionDetails.title} Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" className="dark:stroke-slate-700" />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 12 }}
                  tickCount={5}
                  minTickGap={30}
                  stroke="rgba(0,0,0,0.5)"
                  className="dark:text-slate-400 dark:stroke-slate-600"
                />
                <YAxis
                  domain={[motionDetails.min, motionDetails.max]}
                  tick={{ fontSize: 12 }}
                  tickCount={7}
                  stroke="rgba(0,0,0,0.5)"
                  className="dark:text-slate-400 dark:stroke-slate-600"
                  label={{
                    value: "Angle (°)",
                    angle: -90,
                    position: "insideLeft",
                    style: { textAnchor: "middle", fontSize: 12 },
                    className: "dark:fill-slate-400",
                  }}
                />
                <Tooltip
                  formatter={(value) => [`${value}°`, "Angle"]}
                  labelFormatter={(label) => `Time: ${label}`}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "8px",
                  }}
                  wrapperClassName="dark:bg-slate-800 dark:text-white dark:border-slate-700"
                />
                <ReferenceLine y={0} stroke="#888" strokeDasharray="3 3" className="dark:stroke-slate-600" />
                <Legend verticalAlign="top" height={36} className="dark:text-slate-300" />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={motionDetails.color}
                  name={`${activeMotion.charAt(0).toUpperCase() + activeMotion.slice(1)} Angle`}
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            {data.length === 0 ? (
              <p>Start the machine to see angle data over time</p>
            ) : (
              <p>Showing the last {data.length} seconds of motion data</p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
