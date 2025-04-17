"use client"

import { useState, useEffect } from "react"
import { useCPM } from "@/context/cpm-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Timer, Save, FileSpreadsheet, FileIcon as FilePdf, Clock, Wifi, WifiOff, FileText, Trash2 } from "lucide-react"
import { motion } from "framer-motion"
import { exportToExcel, exportToPDF } from "@/utils/export-data"
import { exportToCSV } from "@/utils/csv-export"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function SessionInfo() {
  const {
    isConnected,
    isRunning,
    sessionStartTime,
    sessionLogs,
    activeMotion,
    clearSessionLogs,
  } = useCPM()
  const { toast } = useToast()
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isExporting, setIsExporting] = useState(false)

  // Update elapsed time every second when session is running
  useEffect(() => {
    if (!isRunning || !sessionStartTime) {
      return
    }

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000)
      setElapsedTime(elapsed)
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, sessionStartTime])

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Export session logs as JSON
  const exportLogs = () => {
    try {
      const dataStr = JSON.stringify(sessionLogs, null, 2)
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

      const exportFileDefaultName = `cpm-session-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.json`

      const linkElement = document.createElement("a")
      linkElement.setAttribute("href", dataUri)
      linkElement.setAttribute("download", exportFileDefaultName)
      document.body.appendChild(linkElement)
      linkElement.click()
      document.body.removeChild(linkElement)
    } catch (error) {
      console.error("Error exporting JSON:", error)
      toast({
        title: "Export Failed",
        description: "There was an error exporting the JSON file.",
        variant: "destructive",
      })
    }
  }

  // Handle Excel export with error handling
  const handleExcelExport = async () => {
    try {
      setIsExporting(true)
      await exportToExcel(sessionLogs)
      setIsExporting(false)
    } catch (error) {
      console.error("Error exporting Excel:", error)
      setIsExporting(false)
      toast({
        title: "Export Failed",
        description: "There was an error exporting the Excel file. Try CSV export instead.",
        variant: "destructive",
      })
    }
  }

  // Handle PDF export with error handling
  const handlePDFExport = async () => {
    try {
      setIsExporting(true)
      await exportToPDF(sessionLogs)
      setIsExporting(false)
    } catch (error) {
      console.error("Error exporting PDF:", error)
      setIsExporting(false)
      toast({
        title: "Export Failed",
        description: "There was an error exporting the PDF file.",
        variant: "destructive",
      })
    }
  }

  // Handle CSV export with error handling
  const handleCSVExport = async () => {
    try {
      setIsExporting(true)
      await exportToCSV(sessionLogs)
      setIsExporting(false)
    } catch (error) {
      console.error("Error exporting CSV:", error)
      setIsExporting(false)
      toast({
        title: "Export Failed",
        description: "There was an error exporting the CSV file.",
        variant: "destructive",
      })
    }
  }

  // Handle clearing session logs
  const handleClearLogs = () => {
    clearSessionLogs()
    toast({
      title: "Session Cleared",
      description: "All session logs have been deleted.",
    })
  }

  // Get motion name based on type and value
  const getMotionName = (type: string, value: number) => {
    if (type === "pitch") {
      return value >= 0 ? "Plantar flexion" : "Dorsiflexion"
    } else if (type === "roll") {
      return value >= 0 ? "Eversion" : "Inversion"
    } else if (type === "yaw") {
      return value >= 0 ? "Adduction" : "Abduction"
    }
    return type
  }

  if (!isConnected) {
    return (
      <Card className="card-gradient shadow-lg border-2 border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <WifiOff className="h-5 w-5 text-muted-foreground" />
            Session Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40 text-muted-foreground">
            Connect to the CPM device to access session information
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="card-gradient shadow-lg border-2 border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">Session Timer</CardTitle>
            <Timer className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6">
              <div className="text-6xl font-bold mb-4 tabular-nums bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400 text-transparent bg-clip-text">
                {formatTime(elapsedTime)}
              </div>
              <div className="flex flex-col items-center">
                <p className="text-lg font-medium">{isRunning ? "Session in progress" : "Session not started"}</p>
                <Badge
                  variant={isRunning ? "default" : "outline"}
                  className={`mt-1 ${isRunning ? "animate-pulse" : ""}`}
                >
                  {isRunning ? "Running" : "Idle"}
                </Badge>
              </div>
              {activeMotion && (
                <div className="mt-4 pt-4 border-t w-full text-center">
                  <p className="text-sm text-muted-foreground">
                    Current motion: <span className="font-medium">{activeMotion.toUpperCase()}</span>
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="card-gradient shadow-lg border-2 border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5 text-green-500" />
              Session History
            </CardTitle>
            {sessionLogs.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear Session History</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will delete all session logs. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearLogs} className="bg-red-500 hover:bg-red-600 text-white">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sessionLogs.length > 0 ? (
                <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                  {sessionLogs.map((log, index) => (
                    <div
                      key={index}
                      className="border rounded-md p-3 text-sm glass-card shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{log.action}</span>
                        <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                      </div>
                      {log.angles && log.motionType && (
                        <div className="text-xs">
                          <span className="font-medium">
                            {getMotionName(log.motionType, log.angles[log.motionType])}:{" "}
                          </span>
                          <span>{log.angles[log.motionType].toFixed(1)}°</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Clock className="mx-auto h-12 w-12 mb-2 opacity-20" />
                  <p>No session data available</p>
                  <p className="text-xs">Start a session to record data</p>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
                <Button
                  onClick={exportLogs}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 glass-card hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  disabled={sessionLogs.length === 0 || isExporting}
                >
                  <Save className="h-4 w-4" />
                  <span className="hidden sm:inline">JSON</span>
                </Button>

                <Button
                  onClick={handleCSVExport}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 glass-card hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  disabled={sessionLogs.length === 0 || isExporting}
                >
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">CSV</span>
                </Button>

                <Button
                  onClick={handleExcelExport}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 glass-card hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  disabled={sessionLogs.length === 0 || isExporting}
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  <span className="hidden sm:inline">Excel</span>
                </Button>

                <Button
                  onClick={handlePDFExport}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 glass-card hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  disabled={sessionLogs.length === 0 || isExporting}
                >
                  <FilePdf className="h-4 w-4" />
                  <span className="hidden sm:inline">PDF</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
