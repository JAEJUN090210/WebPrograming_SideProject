import { Box, Container, Divider, Link, Stack, Typography } from "@mui/material"
import { NavLink } from "react-router-dom"

const footerLinks = [
  { label: "기능 명세", to: "/specs/functional" },
  { label: "API 명세", to: "/specs/api" },
  { label: "ERD", to: "/erd" },
  { label: "AI 보조", to: "/ai" },
  { label: "알림", to: "/notifications" },
  { label: "Audit", to: "/audit" },
]

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "var(--idp-bg)",
        borderTop: "1px solid var(--idp-border)",
        color: "var(--idp-text-muted)",
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={2}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ alignItems: { sm: "center" } }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "var(--idp-text)" }}>
              IDP Service
            </Typography>
            <Divider flexItem orientation="vertical" sx={{ display: { xs: "none", sm: "block" } }} />
            <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap", rowGap: 1 }}>
              {footerLinks.map(link => (
                <Link
                  key={link.to}
                  component={NavLink}
                  to={link.to}
                  underline="none"
                  sx={{
                    color: "var(--idp-text-muted)",
                    fontWeight: 600,
                    "&.active": { color: "#00EF8B" },
                    "&:hover": { color: "var(--idp-text)" },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Stack>
          <Typography variant="caption" sx={{ color: "var(--idp-text-soft)" }}>
            기능 명세, API 명세, 데이터 구조, 버전, 협업, AI 보조를 통합 관리하는 개발 문서 플랫폼
          </Typography>
        </Stack>
      </Container>
    </Box>
  )
}
