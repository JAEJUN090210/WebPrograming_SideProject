import {
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material"
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined"
import SendOutlinedIcon from "@mui/icons-material/SendOutlined"
import { NOTIFICATION_CHANNEL_OPTIONS, NOTIFICATION_EVENT_OPTIONS } from "../../data/idpOptions"
import type { NotificationRecipient, NotificationRule } from "../../types/specs"
import { fieldSx, panelSx } from "../idp/formStyles"
import NotificationRecipientCreateForm from "./NotificationRecipientCreateForm"
import NotificationRecipientList from "./NotificationRecipientList"

type NotificationRuleCardProps = {
  rule: NotificationRule
  onChange: (rule: NotificationRule) => void
  onDelete: (id: string) => void
  onTestSend: (rule: NotificationRule) => void
}

export default function NotificationRuleCard({ rule, onChange, onDelete, onTestSend }: NotificationRuleCardProps) {
  const updateRule = (patch: Partial<NotificationRule>) => {
    onChange({ ...rule, ...patch })
  }

  const toggleEvent = (eventName: string) => {
    const events = rule.events.includes(eventName)
      ? rule.events.filter(event => event !== eventName)
      : [...rule.events, eventName]
    updateRule({ events })
  }

  const updateRecipient = (recipient: NotificationRecipient) => {
    updateRule({
      recipients: rule.recipients.map(item => (item.id === recipient.id ? recipient : item)),
    })
  }

  const addRecipient = (recipient: NotificationRecipient) => {
    updateRule({ recipients: [...rule.recipients, recipient] })
  }

  const removeRecipient = (recipientId: string) => {
    updateRule({
      recipients: rule.recipients.filter(recipient => recipient.id !== recipientId),
    })
  }

  const handleDelete = () => {
    if (window.confirm(`${rule.channel} 알림 규칙을 삭제할까요?`)) {
      onDelete(rule.id)
    }
  }

  return (
    <Paper elevation={0} sx={{ ...panelSx, flex: 1, minWidth: 0 }}>
      <Stack spacing={2.25}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{ justifyContent: "space-between", alignItems: { sm: "center" } }}
        >
          <Stack spacing={0.25}>
            <Typography variant="h6" sx={{ color: "var(--idp-text)", fontWeight: 800 }}>
              {rule.channel}
            </Typography>
            <Typography variant="body2" sx={{ color: "var(--idp-text-muted)" }}>
              {rule.recipients.filter(recipient => recipient.enabled).length}명 수신 · {rule.events.length}개 이벤트
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
            <FormControlLabel
              control={
                <Switch checked={rule.enabled} onChange={event => updateRule({ enabled: event.target.checked })} />
              }
              label={rule.enabled ? "활성" : "비활성"}
              sx={{ color: "var(--idp-text-muted)", mr: 0 }}
            />
            <Button
              size="small"
              startIcon={<DeleteOutlineOutlinedIcon />}
              onClick={handleDelete}
              sx={{ color: "var(--idp-danger)", fontWeight: 800 }}
            >
              삭제
            </Button>
          </Stack>
        </Stack>

        <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
          <TextField
            label="채널 유형"
            value={rule.channel}
            onChange={event => updateRule({ channel: event.target.value as NotificationRule["channel"] })}
            select
            fullWidth
            sx={fieldSx}
          >
            {NOTIFICATION_CHANNEL_OPTIONS.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="대상 채널"
            value={rule.target}
            onChange={event => updateRule({ target: event.target.value })}
            fullWidth
            sx={fieldSx}
          />
          <TextField
            label="웹훅 URL"
            value={rule.webhookUrl}
            onChange={event => updateRule({ webhookUrl: event.target.value })}
            fullWidth
            sx={fieldSx}
          />
        </Stack>

        <TextField
          label="메시지 템플릿"
          helperText="{event}, {targetId}, {targetTitle}, {actor} 토큰을 사용할 수 있습니다."
          value={rule.messageTemplate}
          onChange={event => updateRule({ messageTemplate: event.target.value })}
          fullWidth
          multiline
          minRows={2}
          sx={fieldSx}
        />

        <Stack spacing={0.75}>
          <Typography variant="subtitle2" sx={{ color: "var(--idp-text)", fontWeight: 800 }}>
            알림 이벤트
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 0.5 }}>
            {NOTIFICATION_EVENT_OPTIONS.map(eventName => (
              <FormControlLabel
                key={eventName}
                control={<Checkbox checked={rule.events.includes(eventName)} onChange={() => toggleEvent(eventName)} />}
                label={eventName}
                sx={{ color: "var(--idp-text-muted)", mr: 1 }}
              />
            ))}
          </Stack>
        </Stack>

        <Stack spacing={0.75}>
          <Typography variant="subtitle2" sx={{ color: "var(--idp-text)", fontWeight: 800 }}>
            포함 정보
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 0.5 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={rule.includeSummary}
                  onChange={event => updateRule({ includeSummary: event.target.checked })}
                />
              }
              label="요약"
              sx={{ color: "var(--idp-text-muted)" }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={rule.includeChangedFields}
                  onChange={event => updateRule({ includeChangedFields: event.target.checked })}
                />
              }
              label="변경 필드"
              sx={{ color: "var(--idp-text-muted)" }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={rule.includeAuditLink}
                  onChange={event => updateRule({ includeAuditLink: event.target.checked })}
                />
              }
              label="Audit 참조"
              sx={{ color: "var(--idp-text-muted)" }}
            />
          </Stack>
        </Stack>

        <NotificationRecipientList recipients={rule.recipients} onUpdate={updateRecipient} onRemove={removeRecipient} />
        <NotificationRecipientCreateForm onAdd={addRecipient} />

        <Button
          variant="contained"
          startIcon={<SendOutlinedIcon />}
          disabled={!rule.enabled}
          onClick={() => onTestSend(rule)}
          sx={{ backgroundColor: "var(--idp-accent)", color: "#ffffff", fontWeight: 800, width: "fit-content" }}
        >
          테스트 전송
        </Button>
      </Stack>
    </Paper>
  )
}
