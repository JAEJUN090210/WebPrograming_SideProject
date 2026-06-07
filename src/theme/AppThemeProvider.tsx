import { useMemo, useState, type ReactNode } from "react"
import { CssBaseline, GlobalStyles } from "@mui/material"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import { ThemeModeContext, type AppMode, type ThemeModeContextValue } from "./themeMode"

const STORAGE_KEY = "webpidp:theme-mode"

const darkVars = {
  "--idp-bg": "#0a1016",
  "--idp-bg-soft": "#0f172a",
  "--idp-surface": "rgba(12, 18, 28, 0.9)",
  "--idp-surface-strong": "rgba(15, 23, 42, 0.82)",
  "--idp-surface-subtle": "rgba(2, 6, 23, 0.46)",
  "--idp-field-bg": "rgba(15, 23, 42, 0.62)",
  "--idp-border": "rgba(148, 163, 184, 0.24)",
  "--idp-border-strong": "rgba(148, 163, 184, 0.38)",
  "--idp-text": "#f8fafc",
  "--idp-text-muted": "#cbd5e1",
  "--idp-text-soft": "#94a3b8",
  "--idp-accent": "#22c55e",
  "--idp-accent-blue": "#38bdf8",
  "--idp-danger": "#fca5a5",
}

const lightVars = {
  "--idp-bg": "#f6f8fb",
  "--idp-bg-soft": "#e8eef5",
  "--idp-surface": "rgba(255, 255, 255, 0.96)",
  "--idp-surface-strong": "rgba(248, 250, 252, 0.98)",
  "--idp-surface-subtle": "rgba(226, 232, 240, 0.52)",
  "--idp-field-bg": "#ffffff",
  "--idp-border": "rgba(71, 85, 105, 0.2)",
  "--idp-border-strong": "rgba(71, 85, 105, 0.32)",
  "--idp-text": "#0f172a",
  "--idp-text-muted": "#334155",
  "--idp-text-soft": "#64748b",
  "--idp-accent": "#15803d",
  "--idp-accent-blue": "#0369a1",
  "--idp-danger": "#be123c",
}

function getInitialMode(): AppMode {
  if (typeof window === "undefined") {
    return "dark"
  }

  const saved = window.localStorage.getItem(STORAGE_KEY)
  if (saved === "dark" || saved === "light") {
    return saved
  }

  return window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark"
}

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AppMode>(() => getInitialMode())
  const vars = mode === "dark" ? darkVars : lightVars

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: mode === "dark" ? "#22c55e" : "#15803d" },
          secondary: { main: mode === "dark" ? "#38bdf8" : "#0369a1" },
          background: {
            default: mode === "dark" ? "#0a1016" : "#f6f8fb",
            paper: mode === "dark" ? "#0f172a" : "#ffffff",
          },
          text: {
            primary: mode === "dark" ? "#f8fafc" : "#0f172a",
            secondary: mode === "dark" ? "#cbd5e1" : "#334155",
          },
        },
        typography: {
          fontFamily: '"Roboto", "Noto Sans KR", "Segoe UI", sans-serif',
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                color: "var(--idp-text)",
              },
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                color: "var(--idp-text)",
                backgroundColor: "var(--idp-field-bg)",
              },
              input: {
                color: "var(--idp-text)",
              },
            },
          },
          MuiInputBase: {
            styleOverrides: {
              root: {
                color: "var(--idp-text)",
              },
              input: {
                color: "var(--idp-text)",
              },
            },
          },
          MuiInputLabel: {
            styleOverrides: {
              root: {
                color: "var(--idp-text-soft)",
              },
            },
          },
          MuiSelect: {
            styleOverrides: {
              select: {
                color: "var(--idp-text)",
              },
            },
          },
          MuiMenu: {
            styleOverrides: {
              paper: {
                backgroundColor: "var(--idp-surface)",
                color: "var(--idp-text)",
                border: "1px solid var(--idp-border)",
              },
            },
          },
          MuiMenuItem: {
            styleOverrides: {
              root: {
                color: "var(--idp-text)",
              },
            },
          },
          MuiTableCell: {
            styleOverrides: {
              root: {
                color: "var(--idp-text)",
              },
            },
          },
        },
      }),
    [mode]
  )

  const value = useMemo<ThemeModeContextValue>(
    () => ({
      mode,
      toggleMode: () => {
        setMode(current => {
          const nextMode = current === "dark" ? "light" : "dark"
          window.localStorage.setItem(STORAGE_KEY, nextMode)
          return nextMode
        })
      },
    }),
    [mode]
  )

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            ":root": vars,
            body: {
              backgroundColor: "var(--idp-bg)",
              color: "var(--idp-text)",
            },
            "::selection": {
              backgroundColor: mode === "dark" ? "rgba(34, 197, 94, 0.32)" : "rgba(21, 128, 61, 0.2)",
            },
          }}
        />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  )
}
