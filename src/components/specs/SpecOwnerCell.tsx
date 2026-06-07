import { Stack, Typography } from "@mui/material"

type SpecOwnerCellProps = {
  owner: string
  updatedAt: string
}

export default function SpecOwnerCell({ owner, updatedAt }: SpecOwnerCellProps) {
  return (
    <Stack spacing={0.25}>
      <Typography variant="body2" sx={{ color: "var(--idp-text-muted)", fontWeight: 600 }}>
        {owner}
      </Typography>
      <Typography variant="caption" sx={{ color: "var(--idp-text-soft)" }}>
        업데이트 {updatedAt}
      </Typography>
    </Stack>
  )
}
