"use client"

import { useState } from "react"
import { useCPM } from "@/context/cpm-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Wifi, WifiOff } from "lucide-react"

// Validate IP address format
function isValidIP(ip: string): boolean {
  const ipPattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipPattern.test(ip);
}

export default function ConnectDialog() {
  const { isConnected, connect, disconnect, deviceIP, updateDeviceIP } = useCPM()
  const [ipAddress, setIpAddress] = useState(deviceIP)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [ipError, setIpError] = useState<string | null>(null)

  const handleIpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIpAddress(e.target.value)
    setIpError(null)
  }

  const handleConnect = () => {
    if (!isValidIP(ipAddress)) {
      setIpError("Please enter a valid IP address")
      return
    }

    updateDeviceIP(ipAddress)
    connect()
    setIsDialogOpen(false)
  }

  const handleDisconnect = () => {
    disconnect()
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant={isConnected ? "default" : "outline"} className="gap-2">
          {isConnected ? (
            <>
              <Wifi className="h-4 w-4" />
              <span className="hidden sm:inline">Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4" />
              <span className="hidden sm:inline">Connect</span>
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isConnected ? "Device Connection" : "Connect to CPM Device"}</DialogTitle>
          <DialogDescription>
            {isConnected
              ? `Currently connected to CPM device at ${deviceIP}`
              : "Enter the IP address of your CPM device"}
          </DialogDescription>
        </DialogHeader>

        {isConnected ? (
          <div className="flex items-center justify-center py-4">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-green-500">
                <Wifi className="h-5 w-5 animate-pulse" />
                <span className="font-medium">Connected to {deviceIP}</span>
              </div>
              <Button variant="destructive" onClick={handleDisconnect}>
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="ipAddress" className="text-sm font-medium">
                  Device IP Address
                </label>
                <Input
                  id="ipAddress"
                  value={ipAddress}
                  onChange={handleIpChange}
                  placeholder="192.168.1.100"
                />
                {ipError && <p className="text-sm text-red-500">{ipError}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleConnect}>
                Connect
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
} 