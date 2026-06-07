import { Paper, Stack, Typography } from "@mui/material"
import type { ReactNode } from "react"
import { panelSx } from "../formStyles"

type FormSectionProps = {
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
}

export default function FormSection({ title, description, actions, children }: FormSectionProps) {
  return (
    <Paper elevation={0} sx={panelSx}>
      <Stack spacing={2}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{ justifyContent: "space-between", alignItems: { sm: "flex-start" } }}
        >
          <Stack spacing={0.4}>
            <Typography variant="h6" sx={{ color: "var(--idp-text)", fontWeight: 800 }}>
              {title}
            </Typography>
            {description ? (
              <Typography variant="body2" sx={{ color: "var(--idp-text-muted)" }}>
                {description}
              </Typography>
            ) : null}
          </Stack>
          {actions}
        </Stack>
        {children}
      </Stack>
    </Paper>
  )
}
