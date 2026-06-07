import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material"
import type { ReactNode } from "react"
import SpecStatusChip from "./SpecStatusChip"
import SpecMetaList from "./SpecMetaList"
import type { SpecStatus } from "../../types/specs"

type SpecCardProps = {
  eyebrow?: string
  title: string
  description: string
  status: SpecStatus
  owner: string
  updatedAt: string
  tags: string[]
  metaItems: { label: string; icon?: ReactNode }[]
  actionLabel?: string
}

export default function SpecCard({
  eyebrow,
  title,
  description,
  status,
  owner,
  updatedAt,
  tags,
  metaItems,
  actionLabel = "Open",
}: SpecCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        p: { xs: 2.5, sm: 3 },
        border: "1px solid var(--idp-border)",
        backgroundColor: "rgba(12, 17, 24, 0.82)",
        backdropFilter: "blur(8px)",
      }}
    >
      <Stack spacing={2}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
          <Stack spacing={0.5}>
            {eyebrow ? (
              <Typography variant="overline" sx={{ color: "var(--idp-text-soft)" }}>
                {eyebrow}
              </Typography>
            ) : null}
            <Typography variant="h6" sx={{ color: "var(--idp-text)", fontWeight: 700 }}>
              {title}
            </Typography>
            <Typography variant="body2" sx={{ color: "var(--idp-text-muted)" }}>
              {description}
            </Typography>
          </Stack>
          <Stack spacing={1} sx={{ alignItems: { xs: "flex-start", sm: "flex-end" } }}>
            <SpecStatusChip status={status} />
            <Typography variant="caption" sx={{ color: "var(--idp-text-soft)" }}>
              Updated {updatedAt} · {owner}
            </Typography>
          </Stack>
        </Stack>

        <SpecMetaList items={metaItems} />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
          }}
        >
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
            {tags.map(tag => (
              <Chip
                key={tag}
                size="small"
                label={tag}
                sx={{
                  borderRadius: 999,
                  color: "var(--idp-text-muted)",
                  backgroundColor: "rgba(30, 41, 59, 0.6)",
                }}
              />
            ))}
          </Stack>
          <Box>
            <Button
              variant="outlined"
              size="small"
              sx={{
                borderColor: "var(--idp-border-strong)",
                color: "var(--idp-text-muted)",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": {
                  borderColor: "#00ef8b",
                  color: "#00ef8b",
                  backgroundColor: "rgba(0, 239, 139, 0.08)",
                },
              }}
            >
              {actionLabel}
            </Button>
          </Box>
        </Stack>
      </Stack>
    </Paper>
  )
}
