import { Paper, Stack, Typography } from "@mui/material"

type SummaryCard = {
  label: string
  value: number
  helper: string
}

type SpecSummaryProps = {
  items: SummaryCard[]
}

export default function SpecSummary({ items }: SpecSummaryProps) {
  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
      {items.map(item => (
        <Paper
          key={item.label}
          elevation={0}
          sx={{
            flex: 1,
            borderRadius: 3,
            p: 2.5,
            border: "1px solid var(--idp-border)",
            backgroundColor: "var(--idp-surface)",
          }}
        >
          <Typography variant="overline" sx={{ color: "var(--idp-text-soft)" }}>
            {item.label}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "var(--idp-text)" }}>
            {item.value}
          </Typography>
          <Typography variant="body2" sx={{ color: "var(--idp-text-muted)" }}>
            {item.helper}
          </Typography>
        </Paper>
      ))}
    </Stack>
  )
}
