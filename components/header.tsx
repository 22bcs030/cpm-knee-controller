"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Activity } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import ConnectDialog from "@/components/connect-dialog"

export default function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Only show the theme toggle after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="flex flex-col sm:flex-row items-center justify-between gap-2 py-3 sm:py-4 border-b border-slate-200 dark:border-slate-700 mb-4 sm:mb-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3"
      >
        <div className="hidden sm:flex h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 items-center justify-center shadow-lg dark:glow-dark">
          <Activity className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 dark:from-blue-400 dark:via-cyan-400 dark:to-blue-300 text-transparent bg-clip-text text-center sm:text-left">
            Ankle CPM Controller
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground text-center sm:text-left">
            Precision Foot/Ankle Rehabilitation System
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center gap-2"
      >
        <ConnectDialog />
        
        {mounted && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="rounded-full h-9 w-9 sm:h-10 sm:w-10 border-2 glass-card btn-shine"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
            ) : (
              <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            )}
          </Button>
        )}
      </motion.div>
    </header>
  )
}
