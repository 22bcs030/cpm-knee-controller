import * as XLSX from "xlsx"
import { jsPDF } from "jspdf"
import "jspdf-autotable"

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

// Export to Excel
export const exportToExcel = (logs: SessionLog[]) => {
  // Create worksheet data
  const worksheetData = logs.map((log) => {
    const motion =
      log.motionType && log.angles
        ? `${getMotionName(log.motionType, log.angles[log.motionType as keyof typeof log.angles])}: ${log.angles[log.motionType as keyof typeof log.angles].toFixed(1)}°`
        : "N/A"

    return {
      Timestamp: log.timestamp,
      Action: log.action,
      Motion: motion,
    }
  })

  // Create workbook
  const worksheet = XLSX.utils.json_to_sheet(worksheetData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Session Data")

  // Generate filename
  const filename = `cpm-session-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.xlsx`

  // Convert to binary string
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })

  // Create Blob and download
  const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()

  // Clean up
  setTimeout(() => {
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, 100)
}

// Export to PDF
export const exportToPDF = (logs: SessionLog[]) => {
  const doc = new jsPDF()

  // Add title
  doc.setFontSize(16)
  doc.text("CPM Session Data", 14, 15)
  doc.setFontSize(10)
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22)

  // Prepare table data
  const tableColumn = ["Timestamp", "Action", "Motion"]
  const tableRows = logs.map((log) => {
    const motion =
      log.motionType && log.angles
        ? `${getMotionName(log.motionType, log.angles[log.motionType as keyof typeof log.angles])}: ${log.angles[log.motionType as keyof typeof log.angles].toFixed(1)}°`
        : "N/A"

    return [log.timestamp, log.action, motion]
  })

  // Generate table
  ;(doc as any).autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 25,
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 1 },
    headStyles: { fillColor: [65, 105, 225], textColor: [255, 255, 255] },
  })

  // Generate filename and save using browser download
  const filename = `cpm-session-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.pdf`
  doc.save(filename)
}
