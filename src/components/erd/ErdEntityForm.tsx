import { Button, Stack, TextField } from "@mui/material"
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined"
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined"
import { fieldSx } from "../idp/formStyles"
import FormSection from "../idp/layout/FormSection"
import type { EntityDraft } from "./erdFieldText"

type ErdEntityFormProps = {
  draft: EntityDraft
  onDraftChange: (draft: EntityDraft) => void
  onSave: () => void
  onSaveSnapshot: () => void
}

export default function ErdEntityForm({ draft, onDraftChange, onSave, onSaveSnapshot }: ErdEntityFormProps) {
  const updateDraft = (patch: Partial<EntityDraft>) => onDraftChange({ ...draft, ...patch })

  return (
    <FormSection title="테이블 작성 / 수정" description="테이블과 컬럼 정의를 ERD 문서 단위로 저장합니다.">
      <Stack spacing={2}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            label="테이블 ID"
            value={draft.id}
            onChange={event => updateDraft({ id: event.target.value })}
            fullWidth
            sx={fieldSx}
          />
          <TextField
            label="테이블명"
            value={draft.name}
            onChange={event => updateDraft({ name: event.target.value })}
            fullWidth
            sx={fieldSx}
          />
        </Stack>
        <TextField
          label="설명"
          value={draft.description}
          onChange={event => updateDraft({ description: event.target.value })}
          fullWidth
          sx={fieldSx}
        />
        <TextField
          label="컬럼 정의"
          helperText="한 줄에 name: type: required|optional: note 형식으로 입력합니다."
          value={draft.fieldsText}
          onChange={event => updateDraft({ fieldsText: event.target.value })}
          multiline
          minRows={5}
          fullWidth
          sx={fieldSx}
        />
        <Stack direction="row" spacing={1.5} sx={{ flexWrap: "wrap" }}>
          <Button
            variant="contained"
            startIcon={<SaveOutlinedIcon />}
            onClick={onSave}
            sx={{
              backgroundColor: "#22c55e",
              color: "#07120d",
              fontWeight: 800,
              "&:hover": { backgroundColor: "#16a34a" },
            }}
          >
            테이블 저장
          </Button>
          <Button
            variant="outlined"
            startIcon={<CameraAltOutlinedIcon />}
            onClick={onSaveSnapshot}
            sx={{ borderColor: "rgba(125, 211, 252, 0.55)", color: "#7dd3fc", fontWeight: 800 }}
          >
            ERD 스냅샷
          </Button>
        </Stack>
      </Stack>
    </FormSection>
  )
}
