import { AppBar, Box, Button, Container, IconButton, Stack, Toolbar, Tooltip, Typography } from "@mui/material"
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined"
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined"
import { NavLink } from "react-router-dom"
import { useThemeMode } from "../../theme/themeMode"

const navItems = [
  { label: "기능 명세", to: "/specs/functional" },
  { label: "API 명세", to: "/specs/api" },
  { label: "ERD", to: "/erd" },
  { label: "관계도", to: "/impact" },
  { label: "AI 보조", to: "/ai" },
  { label: "알림", to: "/notifications" },
  { label: "Audit", to: "/audit" },
  { label: "계정", to: "/accounts" },
]

export default function Header() {
  const { mode, toggleMode } = useThemeMode()

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "color-mix(in srgb, var(--idp-bg) 92%, transparent)",
        borderBottom: "1px solid var(--idp-border)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: { xs: 64, sm: 72 } }}>
          <Stack direction="row" spacing={2} sx={{ alignItems: "center", flex: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              component={NavLink}
              to="/"
              sx={{
                fontWeight: 800,
                color: "var(--idp-text)",
                whiteSpace: "nowrap",
              }}
            >
              IDP Service
            </Typography>
            <Box sx={{ flex: 1 }} />
            <Stack
              direction="row"
              spacing={0.5}
              sx={{
                overflowX: "auto",
                maxWidth: "100%",
                py: 1,
                "&::-webkit-scrollbar": { display: "none" },
              }}
            >
              {navItems.map(item => (
                <Button
                  key={item.to}
                  component={NavLink}
                  to={item.to}
                  sx={{
                    color: "var(--idp-text-muted)",
                    fontWeight: 700,
                    textTransform: "none",
                    whiteSpace: "nowrap",
                    px: 1.25,
                    "&.active": {
                      color: "#00EF8B",
                    },
                    "&:hover": {
                      backgroundColor: "var(--idp-surface-subtle)",
                      color: "var(--idp-text)",
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>
            <Tooltip title={mode === "dark" ? "화이트 모드" : "다크 모드"}>
              <IconButton
                onClick={toggleMode}
                sx={{
                  color: "var(--idp-text)",
                  border: "1px solid var(--idp-border)",
                  width: 38,
                  height: 38,
                }}
              >
                {mode === "dark" ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
