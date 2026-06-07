import { Box, Button, Stack, TextField, Typography } from "@mui/material"
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined"
import { useState } from "react"
import type { NotificationRecipient } from "../../types/specs"
import { createClientId } from "../../utils/idpStore"
import { fieldSx } from "../idp/formStyles"

type RecipientDraft = Omit<NotificationRecipient, "id" | "enabled">

type NotificationRecipientCreateFormProps = {
  onAdd: (recipient: NotificationRecipient) => void
}

const emptyRecipientDraft: RecipientDraft = {
  name: "",
  role: "",
  contact: "",
}

export default function NotificationRecipientCreateForm({ onAdd }: NotificationRecipientCreateFormProps) {
  const [draft, setDraft] = useState<RecipientDraft>(emptyRecipientDraft)

  const handleAdd = () => {
    if (!draft.name.trim() || !draft.contact.trim()) {
      return
    }

    onAdd({
      id: createClientId("REC"),
      name: draft.name.trim(),
      role: draft.role.trim() || "협업자",
      contact: draft.contact.trim(),
      enabled: true,
    })
    setDraft(emptyRecipientDraft)
  }

  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 2,
        border: "1px solid var(--idp-border)",
        backgroundColor: "var(--idp-surface-subtle)",
      }}
    >
      <Stack spacing={1.25}>
        <Typography variant="subtitle2" sx={{ color: "var(--idp-text)", fontWeight: 800 }}>
          수신자 추가
        </Typography>
        <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
          <TextField
            label="이름"
            value={draft.name}
            onChange={event => setDraft(current => ({ ...current, name: event.target.value }))}
            sx={fieldSx}
          />
          <TextField
            label="역할"
            value={draft.role}
            onChange={event => setDraft(current => ({ ...current, role: event.target.value }))}
            sx={fieldSx}
          />
          <TextField
            label="연락처/멘션"
            value={draft.contact}
            onChange={event => setDraft(current => ({ ...current, contact: event.target.value }))}
            sx={fieldSx}
          />
          <Button
            variant="outlined"
            startIcon={<PersonAddOutlinedIcon />}
            onClick={handleAdd}
            sx={{
              borderColor: "var(--idp-border-strong)",
              color: "var(--idp-text)",
              fontWeight: 800,
              whiteSpace: "nowrap",
            }}
          >
            추가
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
