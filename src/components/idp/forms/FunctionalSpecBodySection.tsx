import { MenuItem, Stack, TextField } from "@mui/material"
import {
  CATEGORY_OPTIONS,
  OWNER_OPTIONS,
  PRIORITY_LABELS,
  PRIORITY_OPTIONS,
  REVIEW_STATE_OPTIONS,
  STATUS_LABELS,
  STATUS_OPTIONS,
} from "../../../data/idpOptions"
import type { FunctionalSpec, ReviewState, SpecPriority, SpecStatus } from "../../../types/specs"
import { fieldSx } from "../formStyles"
import FormSection from "../layout/FormSection"
import TextListField from "./TextListField"

type FunctionalSpecBodySectionProps = {
  spec: FunctionalSpec
  tags: string
  requirements: string
  criteria: string
  reviewers: string
  onSpecChange: <K extends keyof FunctionalSpec>(field: K, value: FunctionalSpec[K]) => void
  onTagsChange: (value: string) => void
  onRequirementsChange: (value: string) => void
  onCriteriaChange: (value: string) => void
  onReviewersChange: (value: string) => void
}

export default function FunctionalSpecBodySection({
  spec,
  tags,
  requirements,
  criteria,
  reviewers,
  onSpecChange,
  onTagsChange,
  onRequirementsChange,
  onCriteriaChange,
  onReviewersChange,
}: FunctionalSpecBodySectionProps) {
  return (
    <FormSection title="명세 본문">
      <Stack spacing={2}>
        <TextField
          label="기능 설명"
          value={spec.description}
          onChange={event => onSpecChange("description", event.target.value)}
          multiline
          minRows={4}
          fullWidth
          sx={fieldSx}
        />
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            label="카테고리"
            value={spec.category}
            onChange={event => onSpecChange("category", event.target.value)}
            select
            fullWidth
            sx={fieldSx}
          >
            {CATEGORY_OPTIONS.map(option => (
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
            label="우선순위"
            value={spec.priority}
            onChange={event => onSpecChange("priority", event.target.value as SpecPriority)}
            select
            fullWidth
            sx={fieldSx}
          >
            {PRIORITY_OPTIONS.map(option => (
              <MenuItem key={option} value={option}>
                {PRIORITY_LABELS[option]}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
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
        <TextListField label="요구사항" value={requirements} onChange={onRequirementsChange} />
        <TextListField label="검증 기준" value={criteria} onChange={onCriteriaChange} />
        <TextListField label="태그" value={tags} onChange={onTagsChange} />
        <TextListField label="검토자" value={reviewers} onChange={onReviewersChange} />
      </Stack>
    </FormSection>
  )
}
