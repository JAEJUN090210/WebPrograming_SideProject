import { Box, Container, Stack, Typography } from "@mui/material"
import type { ReactNode } from "react"

type SpecPageLayoutProps = {
  title: string
  eyebrow?: string
  children: ReactNode
}

export default function SpecPageLayout({ title, eyebrow, children }: SpecPageLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: "100dvh",
        px: { xs: 2, sm: 3 },
        py: { xs: 4, sm: 6 },
        color: "var(--idp-text)",
        background:
          "radial-gradient(900px 480px at 15% -10%, rgba(34, 197, 94, 0.12), transparent 60%), radial-gradient(900px 480px at 90% 15%, rgba(56, 189, 248, 0.10), transparent 60%), linear-gradient(180deg, var(--idp-bg) 0%, var(--idp-bg-soft) 100%)",
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Box>
            {eyebrow ? (
              <Typography variant="overline" sx={{ letterSpacing: "0.18em", color: "var(--idp-text-soft)" }}>
                {eyebrow}
              </Typography>
            ) : null}
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: "var(--idp-text)",
                fontFamily: '"Noto Sans KR", "Segoe UI", sans-serif',
              }}
            >
              {title}
            </Typography>
          </Box>
          {children}
        </Stack>
      </Container>
    </Box>
  )
}
