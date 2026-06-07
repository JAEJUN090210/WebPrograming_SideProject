import { Stack, TextField } from "@mui/material"
import type { ApiSpec } from "../../../types/specs"
import { fieldSx } from "../formStyles"
import FormSection from "../layout/FormSection"

type ApiSpecPayloadSectionProps = {
  spec: ApiSpec
  onSpecChange: <K extends keyof ApiSpec>(field: K, value: ApiSpec[K]) => void
}

export default function ApiSpecPayloadSection({ spec, onSpecChange }: ApiSpecPayloadSectionProps) {
  return (
    <FormSection title="요청 / 응답 구조">
      <Stack spacing={2}>
        <TextField
          label="요청 예시"
          value={spec.requestBody}
          onChange={event => onSpecChange("requestBody", event.target.value)}
          fullWidth
          multiline
          minRows={5}
          sx={fieldSx}
        />
        <TextField
          label="응답 예시"
          value={spec.responseBody}
          onChange={event => onSpecChange("responseBody", event.target.value)}
          fullWidth
          multiline
          minRows={5}
          sx={fieldSx}
        />
      </Stack>
    </FormSection>
  )
}
