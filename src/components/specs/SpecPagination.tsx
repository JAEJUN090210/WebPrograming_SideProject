import { Box, Pagination, Stack, Typography } from "@mui/material"

type SpecPaginationProps = {
  page: number
  pageCount: number
  pageSize: number
  totalCount: number
  onChange: (page: number) => void
}

export default function SpecPagination({ page, pageCount, pageSize, totalCount, onChange }: SpecPaginationProps) {
  const start = totalCount === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalCount)

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={2}
      alignItems={{ md: "center" }}
      justifyContent="space-between"
    >
      <Typography variant="body2" sx={{ color: "rgba(226, 232, 240, 0.7)" }}>
        {start}-{end} / 총 {totalCount}건
      </Typography>
      <Box>
        <Pagination
          count={pageCount}
          page={page}
          onChange={(_, value) => onChange(value)}
          shape="rounded"
          sx={{
            "& .MuiPaginationItem-root": {
              color: "#e2e8f0",
            },
            "& .Mui-selected": {
              backgroundColor: "rgba(0, 239, 139, 0.18)",
              color: "#00ef8b",
              fontWeight: 700,
            },
          }}
        />
      </Box>
    </Stack>
  )
}
