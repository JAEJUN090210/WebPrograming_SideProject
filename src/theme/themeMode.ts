import { createContext, useContext } from "react"

export type AppMode = "dark" | "light"

export type ThemeModeContextValue = {
  mode: AppMode
  toggleMode: () => void
}

export const ThemeModeContext = createContext<ThemeModeContextValue | null>(null)

export function useThemeMode() {
  const context = useContext(ThemeModeContext)
  if (!context) {
    throw new Error("useThemeMode must be used inside AppThemeProvider")
  }
  return context
}
