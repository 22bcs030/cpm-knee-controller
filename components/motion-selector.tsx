"use client"

import { useCPM, type MotionType } from "@/context/cpm-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpDown, RotateCw, MoveHorizontal } from "lucide-react"
import { motion } from "framer-motion"

export default function MotionSelector() {
  const { activeMotion, setActiveMotion, isConnected, isRunning } = useCPM()

  const handleMotionChange = (value: string) => {
    setActiveMotion(value as MotionType)
  }

  if (!isConnected) {
    return (
      <Card className="card-gradient shadow-lg border-2 border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Motion Selection</CardTitle>
          <CardDescription>Connect to the device first</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-24 text-muted-foreground">
            Please connect to the CPM device to select a motion type
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="card-gradient shadow-lg border-2 border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Motion Selection</CardTitle>
        <CardDescription>Select one motion type to control</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeMotion || ""} onValueChange={handleMotionChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-16 sm:h-24 glass-card">
            <TabsTrigger
              value="pitch"
              disabled={isRunning}
              className="flex flex-col items-center justify-center gap-1 sm:gap-2 h-full data-[state=active]:bg-primary/20 data-[state=active]:shadow-md transition-all duration-300"
            >
              <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.95 }} className="flex flex-col items-center">
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-1">
                  <ArrowUpDown className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span>Pitch</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground">Dorsi/Plantar</span>
              </motion.div>
            </TabsTrigger>

            <TabsTrigger
              value="roll"
              disabled={isRunning}
              className="flex flex-col items-center justify-center gap-1 sm:gap-2 h-full data-[state=active]:bg-primary/20 data-[state=active]:shadow-md transition-all duration-300"
            >
              <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.95 }} className="flex flex-col items-center">
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 mb-1">
                  <MoveHorizontal className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
                </div>
                <span>Roll</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground">In/Eversion</span>
              </motion.div>
            </TabsTrigger>

            <TabsTrigger
              value="yaw"
              disabled={isRunning}
              className="flex flex-col items-center justify-center gap-1 sm:gap-2 h-full data-[state=active]:bg-primary/20 data-[state=active]:shadow-md transition-all duration-300"
            >
              <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.95 }} className="flex flex-col items-center">
                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-1">
                  <RotateCw className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <span>Yaw</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground">Ab/Adduction</span>
              </motion.div>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardContent>
    </Card>
  )
}
