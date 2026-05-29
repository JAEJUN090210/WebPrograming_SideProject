import { Box, Container, Stack, Typography } from "@mui/material"
import type { ReactNode } from "react"

type SpecPageLayoutProps = {
  title: string
  description: string
  eyebrow?: string
  children: ReactNode
}

export default function SpecPageLayout({ title, description, eyebrow, children }: SpecPageLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: "100dvh",
        px: { xs: 2, sm: 3 },
        py: { xs: 4, sm: 6 },
        color: "#e2e8f0",
        background:
          "radial-gradient(900px 480px at 15% -10%, rgba(34, 197, 94, 0.12), transparent 60%), radial-gradient(900px 480px at 90% 15%, rgba(56, 189, 248, 0.12), transparent 60%), linear-gradient(180deg, #0a1016 0%, #0b1118 100%)",
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Box>
            {eyebrow ? (
              <Typography variant="overline" sx={{ letterSpacing: "0.18em", color: "rgba(148, 163, 184, 0.8)" }}>
                {eyebrow}
              </Typography>
            ) : null}
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: "#f8fafc",
                fontFamily: '"Noto Sans KR", "Segoe UI", sans-serif',
              }}
            >
              {title}
            </Typography>
            <Typography sx={{ mt: 1, color: "rgba(226, 232, 240, 0.78)" }}>{description}</Typography>
          </Box>
          {children}
        </Stack>
      </Container>
    </Box>
  )
}
