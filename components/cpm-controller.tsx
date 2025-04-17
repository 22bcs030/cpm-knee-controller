"use client"

import { CPMProvider } from "@/context/cpm-context"
import ControlPanel from "@/components/control-panel"
import DataDisplay from "@/components/data-display"
import ActionButtons from "@/components/action-buttons"
import MotionGraph from "@/components/motion-graph"
import SessionInfo from "@/components/session-info"
import MotionSelector from "@/components/motion-selector"
import { ThemeProvider } from "@/components/theme-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/header"
import { Toaster } from "@/components/ui/toaster"

export default function CPMController() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <CPMProvider>
        <div className="min-h-screen bg-gradient-to-b from-blue-50 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 animated-bg p-2 sm:p-4 md:p-8">
          <div className="container mx-auto max-w-7xl">
            <Header />

            <div className="mt-4 sm:mt-8 grid grid-cols-1 gap-4 sm:gap-6">
              <MotionSelector />

              <Tabs defaultValue="controls" className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-12 sm:h-14 text-xs sm:text-sm md:text-base glass-card">
                  <TabsTrigger value="controls" className="text-sm sm:text-base">
                    Controls
                  </TabsTrigger>
                  <TabsTrigger value="data" className="text-sm sm:text-base">
                    Live Data
                  </TabsTrigger>
                  <TabsTrigger value="session" className="text-sm sm:text-base">
                    Session
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="controls" className="space-y-4 sm:space-y-6 py-4 sm:py-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <ControlPanel />
                    <ActionButtons />
                  </div>
                </TabsContent>

                <TabsContent value="data" className="space-y-4 sm:space-y-6 py-4 sm:py-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <DataDisplay />
                    <MotionGraph />
                  </div>
                </TabsContent>

                <TabsContent value="session" className="space-y-4 sm:space-y-6 py-4 sm:py-6">
                  <SessionInfo />
                </TabsContent>
              </Tabs>
            </div>
          </div>
          <Toaster />
        </div>
      </CPMProvider>
    </ThemeProvider>
  )
}
