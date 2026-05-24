import { Stack, Typography } from "@mui/material"

type SpecOwnerCellProps = {
  owner: string
  updatedAt: string
}

export default function SpecOwnerCell({ owner, updatedAt }: SpecOwnerCellProps) {
  return (
    <Stack spacing={0.25}>
      <Typography variant="body2" sx={{ color: "#e2e8f0", fontWeight: 600 }}>
        {owner}
      </Typography>
      <Typography variant="caption" sx={{ color: "rgba(148, 163, 184, 0.8)" }}>
        업데이트 {updatedAt}
      </Typography>
    </Stack>
  )
}
