import { Chip, Paper, Stack, Typography } from "@mui/material"
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineOutlined"
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlineOutlined"
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined"
import type { InsightItem } from "../../utils/idpAnalysis"
import { panelSx } from "./formStyles"

const SEVERITY_CONFIG = {
  good: {
    icon: <CheckCircleOutlineIcon fontSize="small" />,
    label: "양호",
    color: "#34d399",
    bg: "rgba(16, 185, 129, 0.12)",
  },
  warning: {
    icon: <ReportProblemOutlinedIcon fontSize="small" />,
    label: "주의",
    color: "#fbbf24",
    bg: "rgba(251, 191, 36, 0.12)",
  },
  danger: {
    icon: <ErrorOutlineIcon fontSize="small" />,
    label: "위험",
    color: "#fb7185",
    bg: "rgba(251, 113, 133, 0.12)",
  },
}

type InsightPanelProps = {
  title?: string
  insights: InsightItem[]
}

export default function InsightPanel({ title = "AI 문서 검토", insights }: InsightPanelProps) {
  return (
    <Paper elevation={0} sx={panelSx}>
      <Stack spacing={2}>
        <Stack spacing={0.5}>
          <Typography variant="h6" sx={{ color: "var(--idp-text)", fontWeight: 700 }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: "var(--idp-text-muted)" }}>
            프론트엔드 규칙 기반으로 누락, 불일치, 개선 후보를 분석합니다.
          </Typography>
        </Stack>

        <Stack spacing={1.25}>
          {insights.map(insight => {
            const config = SEVERITY_CONFIG[insight.severity]
            return (
              <Paper
                key={`${insight.title}-${insight.detail}`}
                elevation={0}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  border: `1px solid ${config.color}55`,
                  backgroundColor: config.bg,
                }}
              >
                <Stack spacing={0.75}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
                    <Chip
                      size="small"
                      icon={config.icon}
                      label={config.label}
                      sx={{
                        color: config.color,
                        borderColor: `${config.color}66`,
                        "& .MuiChip-icon": { color: config.color },
                      }}
                      variant="outlined"
                    />
                    <Typography variant="body2" sx={{ color: "var(--idp-text)", fontWeight: 700 }}>
                      {insight.title}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ color: "var(--idp-text-muted)" }}>
                    {insight.detail}
                  </Typography>
                </Stack>
              </Paper>
            )
          })}
        </Stack>
      </Stack>
    </Paper>
  )
}
