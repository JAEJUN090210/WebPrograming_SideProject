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
            border: "1px solid rgba(148, 163, 184, 0.18)",
            backgroundColor: "rgba(15, 23, 42, 0.82)",
          }}
        >
          <Typography variant="overline" sx={{ color: "rgba(148, 163, 184, 0.8)" }}>
            {item.label}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#f8fafc" }}>
            {item.value}
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(226, 232, 240, 0.7)" }}>
            {item.helper}
          </Typography>
        </Paper>
      ))}
    </Stack>
  )
}
