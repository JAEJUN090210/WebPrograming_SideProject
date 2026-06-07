import { Box, Paper, Stack, Typography } from "@mui/material"
import type { NotificationLog } from "../../types/specs"
import { panelSx } from "../idp/formStyles"

type NotificationLogListProps = {
  logs: NotificationLog[]
}

export default function NotificationLogList({ logs }: NotificationLogListProps) {
  return (
    <Paper elevation={0} sx={panelSx}>
      <Stack spacing={2}>
        <Typography variant="h6" sx={{ color: "var(--idp-text)", fontWeight: 800 }}>
          알림 로그
        </Typography>
        <Stack spacing={1.25}>
          {logs.length > 0 ? (
            logs.map(log => (
              <Box
                key={log.id}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: "var(--idp-surface-subtle)",
                  border: "1px solid var(--idp-border)",
                }}
              >
                <Typography variant="body2" sx={{ color: "var(--idp-text)", fontWeight: 800 }}>
                  {log.channel} · {log.event}
                </Typography>
                <Typography variant="body2" sx={{ color: "var(--idp-text-muted)" }}>
                  {log.message}
                </Typography>
                <Typography variant="caption" sx={{ color: "var(--idp-text-soft)" }}>
                  {log.createdAt}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2" sx={{ color: "var(--idp-text-muted)" }}>
              아직 전송된 알림 로그가 없습니다.
            </Typography>
          )}
        </Stack>
      </Stack>
    </Paper>
  )
}
