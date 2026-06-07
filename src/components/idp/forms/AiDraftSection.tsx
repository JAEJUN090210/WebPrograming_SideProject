import { Button, Stack, TextField } from "@mui/material"
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined"
import { fieldSx } from "../formStyles"
import FormSection from "../layout/FormSection"

type AiDraftSectionProps = {
  label: string
  prompt: string
  onPromptChange: (value: string) => void
  onApply: () => void
}

export default function AiDraftSection({ label, prompt, onPromptChange, onApply }: AiDraftSectionProps) {
  return (
    <FormSection title="AI 초안 생성" description="키워드 기반으로 문서의 기본 구조를 빠르게 채웁니다.">
      <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
        <TextField
          label={label}
          value={prompt}
          onChange={event => onPromptChange(event.target.value)}
          fullWidth
          sx={fieldSx}
        />
        <Button
          variant="outlined"
          startIcon={<AutoAwesomeOutlinedIcon />}
          onClick={onApply}
          sx={{ color: "#7dd3fc", borderColor: "rgba(125, 211, 252, 0.55)", fontWeight: 800, whiteSpace: "nowrap" }}
        >
          초안 채우기
        </Button>
      </Stack>
    </FormSection>
  )
}
