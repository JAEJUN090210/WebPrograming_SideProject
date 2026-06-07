import { Box, Button, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material"
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined"
import type { ReactNode } from "react"

export type FilterOption = {
  label: string
  value: string
}

type SpecToolbarProps = {
  title?: string
  subtitle?: string
  searchValue: string
  onSearchChange: (value: string) => void
  statusValue: string
  onStatusChange: (value: string) => void
  ownerValue: string
  onOwnerChange: (value: string) => void
  statusOptions: FilterOption[]
  ownerOptions: FilterOption[]
  primaryAction?: ReactNode
}

export default function SpecToolbar({
  title,
  subtitle,
  searchValue,
  onSearchChange,
  statusValue,
  onStatusChange,
  ownerValue,
  onOwnerChange,
  statusOptions,
  ownerOptions,
  primaryAction,
}: SpecToolbarProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        p: { xs: 2.5, sm: 3 },
        border: "1px solid var(--idp-border)",
        backgroundColor: "var(--idp-surface)",
      }}
    >
      <Stack spacing={2}>
        {title || subtitle || primaryAction ? (
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ justifyContent: "space-between" }}>
            <Box>
              {title ? (
                <Typography variant="h5" sx={{ fontWeight: 700, color: "var(--idp-text)" }}>
                  {title}
                </Typography>
              ) : null}
              {subtitle ? (
                <Typography variant="body2" sx={{ color: "var(--idp-text-muted)" }}>
                  {subtitle}
                </Typography>
              ) : null}
            </Box>
            {primaryAction ? <Box>{primaryAction}</Box> : null}
          </Stack>
        ) : null}

        <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ alignItems: { md: "center" } }}>
          <TextField
            fullWidth
            placeholder="제목, 담당자, 태그 검색"
            value={searchValue}
            onChange={event => onSearchChange(event.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
                    <SearchOutlinedIcon sx={{ color: "var(--idp-text-soft)" }} />
                  </Box>
                ),
              },
            }}
            sx={{
              "& .MuiInputBase-input": {
                color: "var(--idp-text)",
              },
              "& .MuiOutlinedInput-root": {
                backgroundColor: "var(--idp-field-bg)",
                "& fieldset": {
                  borderColor: "var(--idp-border-strong)",
                },
                "&:hover fieldset": {
                  borderColor: "var(--idp-accent)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "var(--idp-accent)",
                },
              },
            }}
          />

          <TextField
            select
            label="상태"
            value={statusValue}
            onChange={event => onStatusChange(event.target.value)}
            sx={{
              minWidth: 180,
              "& .MuiInputBase-input": {
                color: "var(--idp-text)",
              },
              "& .MuiInputLabel-root": {
                color: "var(--idp-text-soft)",
              },
              "& .MuiOutlinedInput-root": {
                backgroundColor: "var(--idp-field-bg)",
                "& fieldset": {
                  borderColor: "var(--idp-border-strong)",
                },
                "&:hover fieldset": {
                  borderColor: "var(--idp-accent)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "var(--idp-accent)",
                },
              },
            }}
          >
            {statusOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="담당자"
            value={ownerValue}
            onChange={event => onOwnerChange(event.target.value)}
            sx={{
              minWidth: 180,
              "& .MuiInputBase-input": {
                color: "var(--idp-text)",
              },
              "& .MuiInputLabel-root": {
                color: "var(--idp-text-soft)",
              },
              "& .MuiOutlinedInput-root": {
                backgroundColor: "var(--idp-field-bg)",
                "& fieldset": {
                  borderColor: "var(--idp-border-strong)",
                },
                "&:hover fieldset": {
                  borderColor: "var(--idp-accent)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "var(--idp-accent)",
                },
              },
            }}
          >
            {ownerOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <Button
            variant="outlined"
            sx={{
              borderColor: "var(--idp-border-strong)",
              color: "var(--idp-text)",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                borderColor: "#22c55e",
                color: "#22c55e",
                backgroundColor: "rgba(34, 197, 94, 0.08)",
              },
            }}
            onClick={() => {
              onSearchChange("")
              onStatusChange("All")
              onOwnerChange("All")
            }}
          >
            필터 초기화
          </Button>
        </Stack>
      </Stack>
    </Paper>
  )
}
