import { Box, Container, Divider, Link, Stack, Typography } from "@mui/material"
import { NavLink } from "react-router-dom"

const footerLinks = [
  { label: "기능 명세", to: "/specs/functional" },
  { label: "API 명세", to: "/specs/api" },
  { label: "계정 관리", to: "/accounts" },
]

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#0a0f16",
        borderTop: "1px solid rgba(148, 163, 184, 0.18)",
        color: "rgba(226, 232, 240, 0.8)",
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={2}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ alignItems: { sm: "center" } }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#f8fafc" }}>
              WebpIdp
            </Typography>
            <Divider flexItem orientation="vertical" sx={{ display: { xs: "none", sm: "block" } }} />
            <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
              {footerLinks.map(link => (
                <Link
                  key={link.to}
                  component={NavLink}
                  to={link.to}
                  underline="none"
                  sx={{
                    color: "rgba(226, 232, 240, 0.72)",
                    fontWeight: 500,
                    "&.active": {
                      color: "#00EF8B",
                    },
                    "&:hover": {
                      color: "#f8fafc",
                    },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Stack>
          <Typography variant="caption" sx={{ color: "rgba(148, 163, 184, 0.72)" }}>
            IDP Platform Spec Console - 2026
          </Typography>
        </Stack>
      </Container>
    </Box>
  )
}
