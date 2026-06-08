import { Box, Chip, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import { fieldSx, panelSx } from "../components/idp/formStyles"
import SpecPageLayout from "../components/specs/SpecPageLayout"
import SpecSummary from "../components/specs/SpecSummary"
import useIdpStore from "../hooks/useIdpStore"
import type { AuditLog } from "../types/specs"

const TARGET_OPTIONS: Array<{ label: string; value: "All" | AuditLog["targetType"] }> = [
  { label: "전체", value: "All" },
  { label: "기능 명세", value: "functional" },
  { label: "API 명세", value: "api" },
  { label: "ERD", value: "erd" },
  { label: "댓글/리뷰", value: "comment" },
  { label: "알림", value: "notification" },
  { label: "계정", value: "account" },
  { label: "테마", value: "theme" },
]

const TARGET_LABELS: Record<AuditLog["targetType"], string> = {
  functional: "기능",
  api: "API",
  erd: "ERD",
  comment: "댓글",
  notification: "알림",
  account: "계정",
  theme: "테마",
}

export default function AuditLogPage() {
  const { state } = useIdpStore()
  const [query, setQuery] = useState("")
  const [targetType, setTargetType] = useState<"All" | AuditLog["targetType"]>("All")

  const filteredLogs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return state.auditLogs.filter(log => {
      const matchesTarget = targetType === "All" || log.targetType === targetType
      const haystack = [log.action, log.targetId, log.targetTitle, log.actor, log.summary, JSON.stringify(log.metadata)]
        .join(" ")
        .toLowerCase()
      const matchesQuery = normalizedQuery.length === 0 || haystack.includes(normalizedQuery)
      return matchesTarget && matchesQuery
    })
  }, [query, state.auditLogs, targetType])

  const summaryItems = [
    { label: "전체 로그", value: state.auditLogs.length, helper: "추적 중인 이벤트" },
    {
      label: "문서 변경",
      value: state.auditLogs.filter(log => ["functional", "api", "erd"].includes(log.targetType)).length,
      helper: "명세/ERD 변경 이벤트",
    },
    {
      label: "알림/댓글",
      value: state.auditLogs.filter(log => ["comment", "notification"].includes(log.targetType)).length,
      helper: "협업 이벤트",
    },
  ]

  return (
    <SpecPageLayout eyebrow="IDP SERVICE" title="Audit 로그">
      <SpecSummary items={summaryItems} />

      <Paper elevation={0} sx={panelSx}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            label="로그 검색"
            value={query}
            onChange={event => setQuery(event.target.value)}
            fullWidth
            sx={fieldSx}
          />
          <TextField
            label="대상"
            value={targetType}
            onChange={event => setTargetType(event.target.value as "All" | AuditLog["targetType"])}
            select
            sx={{ ...fieldSx, minWidth: 190 }}
          >
            {TARGET_OPTIONS.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </Paper>

      <Stack spacing={1.5}>
        {filteredLogs.length === 0 ? (
          <Paper elevation={0} sx={panelSx}>
            <Typography variant="body2" sx={{ color: "var(--idp-text-muted)" }}>
              조건에 맞는 Audit 로그가 없습니다.
            </Typography>
          </Paper>
        ) : (
          filteredLogs.map(log => (
            <Paper key={log.id} elevation={0} sx={panelSx}>
              <Stack spacing={1.5}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={1} sx={{ justifyContent: "space-between" }}>
                  <Stack spacing={0.5}>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 0.75, alignItems: "center" }}>
                      <Chip label={TARGET_LABELS[log.targetType]} />
                      <Chip label={log.action} sx={{ color: "var(--idp-text)" }} />
                      <Typography variant="h6" sx={{ color: "var(--idp-text)", fontWeight: 800 }}>
                        {log.targetId} · {log.targetTitle}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ color: "var(--idp-text-muted)" }}>
                      {log.summary}
                    </Typography>
                  </Stack>
                  <Stack spacing={0.25} sx={{ alignItems: { md: "flex-end" } }}>
                    <Typography variant="body2" sx={{ color: "var(--idp-text)", fontWeight: 800 }}>
                      {log.actor}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "var(--idp-text-soft)" }}>
                      {log.actorRole} · {new Date(log.createdAt).toLocaleString("ko-KR")}
                    </Typography>
                  </Stack>
                </Stack>

                <Box
                  component="pre"
                  sx={{
                    m: 0,
                    p: 1.5,
                    borderRadius: 2,
                    border: "1px solid var(--idp-border)",
                    backgroundColor: "var(--idp-surface-subtle)",
                    color: "var(--idp-text-muted)",
                    fontSize: 13,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {JSON.stringify(log.metadata, null, 2)}
                </Box>
              </Stack>
            </Paper>
          ))
        )}
      </Stack>
    </SpecPageLayout>
  )
}
