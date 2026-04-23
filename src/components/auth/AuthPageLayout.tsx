import { Box, Container, Paper, Typography } from "@mui/material"
import type { ReactNode } from "react"

type AuthPageLayoutProps = {
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
}

export default function AuthPageLayout({ title, subtitle, children, footer }: AuthPageLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        background:
          "radial-gradient(1200px 600px at 0% -10%, rgba(0, 239, 139, 0.18), transparent 60%), radial-gradient(1200px 600px at 100% 120%, rgba(30, 136, 229, 0.2), transparent 60%), linear-gradient(180deg, #0d1117 0%, #0a0f14 100%)",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            px: { xs: 2.5, sm: 4 },
            py: { xs: 3, sm: 4 },
            border: "1px solid rgba(240, 246, 252, 0.14)",
            backgroundColor: "rgba(13, 17, 23, 0.76)",
            backdropFilter: "blur(8px)",
          }}
        >
          <Typography variant="h4" sx={{ color: "#f0f6fc", fontWeight: 700 }}>
            {title}
          </Typography>
          <Typography sx={{ mt: 1, color: "rgba(240, 246, 252, 0.72)" }}>{subtitle}</Typography>

          <Box component="section" sx={{ mt: 3 }}>
            {children}
          </Box>

          {footer ? <Box sx={{ mt: 2 }}>{footer}</Box> : null}
        </Paper>
      </Container>
    </Box>
  )
}
