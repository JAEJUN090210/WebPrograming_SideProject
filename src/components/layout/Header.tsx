import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from "@mui/material"
import { NavLink } from "react-router-dom"

const navItems = [
  { label: "기능 명세", to: "/specs/functional" },
  { label: "API 명세", to: "/specs/api" },
  { label: "계정 관리", to: "/accounts" },
]

export default function Header() {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "rgba(10, 15, 22, 0.9)",
        borderBottom: "1px solid rgba(148, 163, 184, 0.18)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: { xs: 64, sm: 72 } }}>
          <Stack direction="row" spacing={2} sx={{ alignItems: "center", flex: 1 }}>
            <Typography
              variant="h6"
              component={NavLink}
              to="/"
              sx={{
                fontWeight: 700,
                letterSpacing: "0.04em",
                color: "#f8fafc",
                textTransform: "uppercase",
              }}
            >
              WebpIdp
            </Typography>
            <Box sx={{ flex: 1 }} />
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              {navItems.map(item => (
                <Button
                  key={item.to}
                  component={NavLink}
                  to={item.to}
                  sx={{
                    color: "rgba(226, 232, 240, 0.78)",
                    fontWeight: 600,
                    textTransform: "none",
                    px: 1.5,
                    "&.active": {
                      color: "#00EF8B",
                    },
                    "&:hover": {
                      backgroundColor: "rgba(148, 163, 184, 0.12)",
                      color: "#f8fafc",
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
