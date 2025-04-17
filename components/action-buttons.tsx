"use client"

import { useCPM } from "@/context/cpm-context"
import { Button } from "@/components/ui/button"
import { Play, Square, Compass, Wifi, WifiOff } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

export default function ActionButtons() {
  const { isConnected, isRunning, connect, disconnect, startSession, stopSession, calibrate, activeMotion } = useCPM()

  if (!isConnected) {
    return (
      <Card className="card-gradient shadow-lg border-2 border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
        <CardHeader>
          <CardTitle>Device Connection</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={connect}
            variant="default"
            className="w-full h-12 text-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md btn-shine"
          >
            <Wifi className="h-5 w-5 mr-2" />
            Connect to Device
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="card-gradient shadow-lg border-2 border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
        <CardHeader>
          <CardTitle>Machine Control</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-3 sm:space-y-4">
            {isRunning ? (
              <Button
                onClick={stopSession}
                variant="destructive"
                className="h-10 sm:h-12 text-base sm:text-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-md btn-shine"
              >
                <Square className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Stop Machine
              </Button>
            ) : (
              <Button
                onClick={startSession}
                variant="default"
                className="h-10 sm:h-12 text-base sm:text-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-md btn-shine"
                disabled={!activeMotion}
              >
                <Play className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Start Machine
              </Button>
            )}

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <Button
                onClick={calibrate}
                variant="secondary"
                className="h-9 sm:h-12 text-xs sm:text-sm"
                disabled={isRunning || !activeMotion}
              >
                <Compass className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                Calibrate
              </Button>

              <Button
                onClick={disconnect}
                variant="outline"
                className="h-9 sm:h-12 text-xs sm:text-sm border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
              >
                <WifiOff className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                Disconnect
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
