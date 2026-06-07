import { MenuItem, Stack, TextField } from "@mui/material"
import {
  AUTH_OPTIONS,
  METHOD_OPTIONS,
  OWNER_OPTIONS,
  REVIEW_STATE_OPTIONS,
  STATUS_LABELS,
  STATUS_OPTIONS,
} from "../../../data/idpOptions"
import type { ApiSpec, AuthType, HttpMethod, ReviewState, SpecStatus } from "../../../types/specs"
import { fieldSx } from "../formStyles"
import FormSection from "../layout/FormSection"
import TextListField from "./TextListField"

type ApiSpecEndpointSectionProps = {
  spec: ApiSpec
  tags: string
  reviewers: string
  onSpecChange: <K extends keyof ApiSpec>(field: K, value: ApiSpec[K]) => void
  onTagsChange: (value: string) => void
  onReviewersChange: (value: string) => void
}

export default function ApiSpecEndpointSection({
  spec,
  tags,
  reviewers,
  onSpecChange,
  onTagsChange,
  onReviewersChange,
}: ApiSpecEndpointSectionProps) {
  return (
    <FormSection title="엔드포인트 정보">
      <Stack spacing={2}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            label="메서드"
            value={spec.method}
            onChange={event => onSpecChange("method", event.target.value as HttpMethod)}
            select
            fullWidth
            sx={fieldSx}
          >
            {METHOD_OPTIONS.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="경로"
            value={spec.path}
            onChange={event => onSpecChange("path", event.target.value)}
            fullWidth
            sx={fieldSx}
          />
          <TextField
            label="인증"
            value={spec.auth}
            onChange={event => onSpecChange("auth", event.target.value as AuthType)}
            select
            fullWidth
            sx={fieldSx}
          >
            {AUTH_OPTIONS.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
        <TextField
          label="API 설명"
          value={spec.description}
          onChange={event => onSpecChange("description", event.target.value)}
          multiline
          minRows={3}
          fullWidth
          sx={fieldSx}
        />
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            label="담당자"
            value={spec.owner}
            onChange={event => onSpecChange("owner", event.target.value)}
            select
            fullWidth
            sx={fieldSx}
          >
            {OWNER_OPTIONS.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="상태"
            value={spec.status}
            onChange={event => onSpecChange("status", event.target.value as SpecStatus)}
            select
            fullWidth
            sx={fieldSx}
          >
            {STATUS_OPTIONS.map(option => (
              <MenuItem key={option} value={option}>
                {STATUS_LABELS[option]}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="리뷰 상태"
            value={spec.reviewState}
            onChange={event => onSpecChange("reviewState", event.target.value as ReviewState)}
            select
            fullWidth
            sx={fieldSx}
          >
            {REVIEW_STATE_OPTIONS.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
        <TextField
          label="예상 응답 시간(ms)"
          type="number"
          value={spec.latencyMs}
          onChange={event => onSpecChange("latencyMs", Number(event.target.value))}
          fullWidth
          sx={fieldSx}
        />
        <TextListField label="태그" value={tags} onChange={onTagsChange} />
        <TextListField label="검토자" value={reviewers} onChange={onReviewersChange} />
      </Stack>
    </FormSection>
  )
}
