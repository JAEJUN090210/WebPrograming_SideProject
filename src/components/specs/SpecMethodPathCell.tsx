import { Chip, Stack, Typography } from "@mui/material"

type SpecMethodPathCellProps = {
  method: string
  path: string
}

export default function SpecMethodPathCell({ method, path }: SpecMethodPathCellProps) {
  return (
    <Stack spacing={0.5}>
      <Chip
        size="small"
        variant="outlined"
        label={method}
        sx={{
          alignSelf: "flex-start",
          borderRadius: 999,
          color: "#38bdf8",
          borderColor: "rgba(56, 189, 248, 0.45)",
          backgroundColor: "rgba(8, 47, 73, 0.35)",
          fontWeight: 700,
        }}
      />
      <Typography
        variant="body2"
        sx={{
          color: "#e2e8f0",
          fontFamily: '"JetBrains Mono", "SFMono-Regular", "Consolas", "Liberation Mono", monospace',
        }}
      >
        {path}
      </Typography>
    </Stack>
  )
}
