import { Chip, Stack, Typography } from "@mui/material"

type SpecTitleCellProps = {
  title: string
  tags: string[]
}

export default function SpecTitleCell({ title, tags }: SpecTitleCellProps) {
  return (
    <Stack spacing={0.5}>
      <Typography variant="subtitle2" sx={{ color: "#f8fafc", fontWeight: 700 }}>
        {title}
      </Typography>
      {tags.length > 0 ? (
        <Stack direction="row" spacing={0.75} flexWrap="wrap" rowGap={0.5}>
          {tags.slice(0, 3).map(tag => (
            <Chip
              key={tag}
              size="small"
              label={tag}
              sx={{
                borderRadius: 999,
                backgroundColor: "rgba(30, 41, 59, 0.6)",
                color: "rgba(226, 232, 240, 0.82)",
              }}
            />
          ))}
        </Stack>
      ) : null}
    </Stack>
  )
}
