interface SessionLog {
  timestamp: string
  action: string
  angles?: {
    pitch: number
    yaw: number
    roll: number
  }
  motionType?: string | null
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

// Export to CSV
export const exportToCSV = (logs: SessionLog[]) => {
  // Create CSV header
  let csvContent = "Timestamp,Action,Motion\n"

  // Add data rows
  logs.forEach((log) => {
    const motion =
      log.motionType && log.angles
        ? `${getMotionName(log.motionType, log.angles[log.motionType as keyof typeof log.angles])}: ${log.angles[log.motionType as keyof typeof log.angles].toFixed(1)}°`
        : "N/A"

    // Escape any commas in the fields
    const escapedAction = log.action.includes(",") ? `"${log.action}"` : log.action
    const escapedMotion = motion.includes(",") ? `"${motion}"` : motion

    csvContent += `${log.timestamp},${escapedAction},${escapedMotion}\n`
  })

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const filename = `cpm-session-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.csv`

  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", filename)
  document.body.appendChild(link)
  link.click()

  // Clean up
  setTimeout(() => {
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, 100)
}
