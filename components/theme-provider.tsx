"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

type ThemeProviderProps = {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: string
  enableSystem?: boolean
  [prop: string]: any
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      {children}
    </NextThemesProvider>
  )
}

export const useTheme = () => {
  const { theme, setTheme } = React.useContext(React.createContext({ theme: "", setTheme: (_: string) => {} }))
  return { theme, setTheme }
}
