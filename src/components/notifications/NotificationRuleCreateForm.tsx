import { Button, MenuItem, Stack, TextField } from "@mui/material"
import AddOutlinedIcon from "@mui/icons-material/AddOutlined"
import { useState } from "react"
import {
  DEFAULT_NOTIFICATION_TEMPLATE,
  NOTIFICATION_CHANNEL_OPTIONS,
  NOTIFICATION_EVENT_OPTIONS,
} from "../../data/idpOptions"
import type { NotificationRule } from "../../types/specs"
import { createClientId } from "../../utils/idpStore"
import { fieldSx } from "../idp/formStyles"
import FormSection from "../idp/layout/FormSection"

type RuleDraft = Pick<NotificationRule, "channel" | "target" | "webhookUrl">

type NotificationRuleCreateFormProps = {
  onCreate: (rule: NotificationRule) => void
}

const emptyDraft: RuleDraft = {
  channel: "Slack",
  target: "",
  webhookUrl: "",
}

export default function NotificationRuleCreateForm({ onCreate }: NotificationRuleCreateFormProps) {
  const [draft, setDraft] = useState<RuleDraft>(emptyDraft)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const missingTarget = draft.target.trim().length === 0

  const handleCreate = () => {
    setSubmitAttempted(true)
    if (missingTarget) {
      return
    }

    onCreate({
      id: createClientId("NOTI"),
      channel: draft.channel,
      target: draft.target.trim(),
      webhookUrl: draft.webhookUrl.trim(),
      enabled: true,
      events: [...NOTIFICATION_EVENT_OPTIONS],
      recipients: [],
      messageTemplate: DEFAULT_NOTIFICATION_TEMPLATE,
      includeSummary: true,
      includeChangedFields: true,
      includeAuditLink: true,
    })
    setDraft(emptyDraft)
    setSubmitAttempted(false)
  }

  return (
    <FormSection title="알림 규칙 등록">
      <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
        <TextField
          label="채널 유형"
          value={draft.channel}
          onChange={event =>
            setDraft(current => ({ ...current, channel: event.target.value as NotificationRule["channel"] }))
          }
          select
          sx={{ ...fieldSx, minWidth: 160 }}
        >
          {NOTIFICATION_CHANNEL_OPTIONS.map(option => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="대상 채널"
          value={draft.target}
          onChange={event => setDraft(current => ({ ...current, target: event.target.value }))}
          error={submitAttempted && missingTarget}
          helperText={submitAttempted && missingTarget ? "대상 채널을 입력해 주세요." : ""}
          fullWidth
          sx={fieldSx}
        />
        <TextField
          label="웹훅 URL"
          value={draft.webhookUrl}
          onChange={event => setDraft(current => ({ ...current, webhookUrl: event.target.value }))}
          fullWidth
          sx={fieldSx}
        />
        <Button
          variant="contained"
          startIcon={<AddOutlinedIcon />}
          onClick={handleCreate}
          sx={{ backgroundColor: "var(--idp-accent)", color: "#ffffff", fontWeight: 800, whiteSpace: "nowrap" }}
        >
          규칙 추가
        </Button>
      </Stack>
    </FormSection>
  )
}
