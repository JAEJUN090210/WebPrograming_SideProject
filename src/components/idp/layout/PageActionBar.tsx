import { Button, Stack } from "@mui/material"
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined"
import type { ReactNode } from "react"

type PageActionBarProps = {
  onBack: () => void
  children?: ReactNode
}

export default function PageActionBar({ onBack, children }: PageActionBarProps) {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={2}
      sx={{ alignItems: { md: "center" }, justifyContent: "space-between" }}
    >
      <Button
        variant="text"
        startIcon={<ArrowBackOutlinedIcon />}
        onClick={onBack}
        sx={{ color: "var(--idp-text-muted)", fontWeight: 700, width: "fit-content" }}
      >
        뒤로가기
      </Button>
      {children ? (
        <Stack direction="row" spacing={1.25} sx={{ alignItems: "center", flexWrap: "wrap", rowGap: 1 }}>
          {children}
        </Stack>
      ) : null}
    </Stack>
  )
}
