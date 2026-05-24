import { Chip } from "@mui/material"
import type { SpecStatus } from "../../types/specs"

type SpecStatusChipProps = {
  status: SpecStatus
}

const STATUS_STYLES: Record<SpecStatus, { label: string; sx: Record<string, string> }> = {
  Draft: {
    label: "Draft",
    sx: {
      color: "#93c5fd",
      borderColor: "rgba(147, 197, 253, 0.5)",
      backgroundColor: "rgba(30, 64, 175, 0.18)",
    },
  },
  "In Review": {
    label: "In Review",
    sx: {
      color: "#fbbf24",
      borderColor: "rgba(251, 191, 36, 0.45)",
      backgroundColor: "rgba(146, 64, 14, 0.24)",
    },
  },
  Approved: {
    label: "Approved",
    sx: {
      color: "#34d399",
      borderColor: "rgba(52, 211, 153, 0.45)",
      backgroundColor: "rgba(6, 95, 70, 0.24)",
    },
  },
  Deprecated: {
    label: "Deprecated",
    sx: {
      color: "#fda4af",
      borderColor: "rgba(253, 164, 175, 0.5)",
      backgroundColor: "rgba(159, 18, 57, 0.2)",
    },
  },
}

export default function SpecStatusChip({ status }: SpecStatusChipProps) {
  const style = STATUS_STYLES[status]

  return (
    <Chip
      size="small"
      variant="outlined"
      label={style.label}
      sx={{
        borderRadius: 999,
        fontWeight: 600,
        ...style.sx,
      }}
    />
  )
}
