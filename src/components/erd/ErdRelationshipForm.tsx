import { Button, Divider, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material"
import { fieldSx, panelSx } from "../idp/formStyles"
import type { ErdEntity, ErdRelationship } from "../../types/specs"

type RelationshipDraft = {
  fromEntityId: string
  toEntityId: string
  label: string
}

type ErdRelationshipFormProps = {
  entities: ErdEntity[]
  relationships: ErdRelationship[]
  draft: RelationshipDraft
  onDraftChange: (draft: RelationshipDraft) => void
  onSave: () => void
}

export default function ErdRelationshipForm({
  entities,
  relationships,
  draft,
  onDraftChange,
  onSave,
}: ErdRelationshipFormProps) {
  const updateDraft = (patch: Partial<RelationshipDraft>) => onDraftChange({ ...draft, ...patch })

  return (
    <Paper elevation={0} sx={{ ...panelSx, flex: 1 }}>
      <Stack spacing={2}>
        <Typography variant="h6" sx={{ color: "var(--idp-text)", fontWeight: 800 }}>
          관계 정의
        </Typography>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            label="출발 테이블"
            value={draft.fromEntityId}
            onChange={event => updateDraft({ fromEntityId: event.target.value })}
            select
            fullWidth
            sx={fieldSx}
          >
            {entities.map(entity => (
              <MenuItem key={entity.id} value={entity.id}>
                {entity.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="도착 테이블"
            value={draft.toEntityId}
            onChange={event => updateDraft({ toEntityId: event.target.value })}
            select
            fullWidth
            sx={fieldSx}
          >
            {entities.map(entity => (
              <MenuItem key={entity.id} value={entity.id}>
                {entity.name}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
        <TextField
          label="관계 이름"
          value={draft.label}
          onChange={event => updateDraft({ label: event.target.value })}
          fullWidth
          sx={fieldSx}
        />
        <Button
          variant="contained"
          onClick={onSave}
          sx={{ backgroundColor: "#38bdf8", color: "#03101a", fontWeight: 800, width: "fit-content" }}
        >
          관계 추가
        </Button>
        <Divider sx={{ borderColor: "var(--idp-border)" }} />
        <Stack spacing={1}>
          {relationships.map(item => (
            <Paper
              key={item.id}
              elevation={0}
              sx={{ p: 1.25, borderRadius: 2, backgroundColor: "var(--idp-surface-subtle)" }}
            >
              <Typography variant="body2" sx={{ color: "var(--idp-text)", fontWeight: 700 }}>
                {`${item.fromEntityId} -> ${item.toEntityId}`}
              </Typography>
              <Typography variant="caption" sx={{ color: "var(--idp-text-muted)" }}>
                {item.label}
              </Typography>
            </Paper>
          ))}
        </Stack>
      </Stack>
    </Paper>
  )
}
