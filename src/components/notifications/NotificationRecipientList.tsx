import { Box, Button, Chip, FormControlLabel, Stack, Switch, TextField, Typography } from "@mui/material"
import type { NotificationRecipient } from "../../types/specs"
import { fieldSx } from "../idp/formStyles"

type NotificationRecipientListProps = {
  recipients: NotificationRecipient[]
  onUpdate: (recipient: NotificationRecipient) => void
  onRemove: (recipientId: string) => void
}

export default function NotificationRecipientList({ recipients, onUpdate, onRemove }: NotificationRecipientListProps) {
  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="subtitle2" sx={{ color: "var(--idp-text)", fontWeight: 800 }}>
          수신자
        </Typography>
        <Chip size="small" label={`${recipients.length}명`} />
      </Stack>
      {recipients.length > 0 ? (
        recipients.map(recipient => (
          <Box
            key={recipient.id}
            sx={{
              p: 1.25,
              borderRadius: 2,
              border: "1px solid var(--idp-border)",
              backgroundColor: "var(--idp-surface-subtle)",
            }}
          >
            <Stack direction={{ xs: "column", md: "row" }} spacing={1} sx={{ alignItems: { md: "center" } }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={recipient.enabled}
                    onChange={event => onUpdate({ ...recipient, enabled: event.target.checked })}
                  />
                }
                label=""
                sx={{ mr: 0 }}
              />
              <TextField
                label="이름"
                value={recipient.name}
                onChange={event => onUpdate({ ...recipient, name: event.target.value })}
                sx={fieldSx}
              />
              <TextField
                label="역할"
                value={recipient.role}
                onChange={event => onUpdate({ ...recipient, role: event.target.value })}
                sx={fieldSx}
              />
              <TextField
                label="연락처/멘션"
                value={recipient.contact}
                onChange={event => onUpdate({ ...recipient, contact: event.target.value })}
                sx={fieldSx}
              />
              <Button
                size="small"
                onClick={() => onRemove(recipient.id)}
                sx={{ color: "var(--idp-danger)", fontWeight: 800, whiteSpace: "nowrap" }}
              >
                제거
              </Button>
            </Stack>
          </Box>
        ))
      ) : (
        <Typography variant="body2" sx={{ color: "var(--idp-text-muted)" }}>
          등록된 수신자가 없습니다.
        </Typography>
      )}
    </Stack>
  )
}
