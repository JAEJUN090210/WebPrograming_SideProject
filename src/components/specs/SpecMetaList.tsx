import { Box, Stack, Typography } from "@mui/material"
import type { ReactNode } from "react"

type SpecMetaItem = {
  icon?: ReactNode
  label: string
}

type SpecMetaListProps = {
  items: SpecMetaItem[]
}

export default function SpecMetaList({ items }: SpecMetaListProps) {
  return (
    <Stack direction="row" spacing={2} sx={{ color: "rgba(226, 232, 240, 0.72)", flexWrap: "wrap", rowGap: 1 }}>
      {items.map(item => (
        <Stack key={item.label} direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
          {item.icon ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                color: "rgba(226, 232, 240, 0.68)",
                fontSize: 18,
              }}
            >
              {item.icon}
            </Box>
          ) : null}
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {item.label}
          </Typography>
        </Stack>
      ))}
    </Stack>
  )
}
