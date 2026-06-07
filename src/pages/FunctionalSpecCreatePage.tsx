import { Button, MenuItem, Paper, Stack, TextField } from "@mui/material"
import AddOutlinedIcon from "@mui/icons-material/AddOutlined"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import AiDraftSection from "../components/idp/forms/AiDraftSection"
import DocumentLinksSection from "../components/idp/forms/DocumentLinksSection"
import TextListField from "../components/idp/forms/TextListField"
import { fieldSx, pageCardSx } from "../components/idp/formStyles"
import FormSection from "../components/idp/layout/FormSection"
import PageActionBar from "../components/idp/layout/PageActionBar"
import SpecPageLayout from "../components/specs/SpecPageLayout"
import useIdpStore from "../hooks/useIdpStore"
import {
  CATEGORY_OPTIONS,
  OWNER_OPTIONS,
  PRIORITY_LABELS,
  PRIORITY_OPTIONS,
  REVIEW_STATE_OPTIONS,
} from "../data/idpOptions"
import type { FunctionalSpec, ReviewState, SpecPriority } from "../types/specs"
import { createFunctionalDraftFromPrompt } from "../utils/idpAnalysis"
import { splitList } from "../utils/idpStore"

type FunctionalSpecDraft = Omit<FunctionalSpec, "id" | "updatedAt" | "linkedApis">

const emptyDraft: FunctionalSpecDraft = {
  title: "",
  description: "",
  owner: "전재준",
  status: "Draft",
  category: "기능 명세",
  priority: "Medium",
  version: "0.1",
  tags: [],
  linkedApiIds: [],
  linkedEntityIds: [],
  requirements: [],
  acceptanceCriteria: [],
  reviewers: [],
  reviewState: "대기",
}

export default function FunctionalSpecCreatePage() {
  const navigate = useNavigate()
  const { state, saveFunctionalSpec } = useIdpStore()
  const [draft, setDraft] = useState<FunctionalSpecDraft>(emptyDraft)
  const [tags, setTags] = useState("")
  const [requirements, setRequirements] = useState("")
  const [criteria, setCriteria] = useState("")
  const [reviewers, setReviewers] = useState("")
  const [prompt, setPrompt] = useState("")
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const missingTitle = draft.title.trim().length === 0
  const missingDescription = draft.description.trim().length === 0
  const isInvalid = missingTitle || missingDescription

  const apiOptions = state.apiSpecs.map(api => ({ value: api.id, label: `${api.id} · ${api.name}` }))
  const entityOptions = state.erdEntities.map(entity => ({
    value: entity.id,
    label: `${entity.name} (${entity.fields.length})`,
  }))

  const handleSave = () => {
    setSubmitAttempted(true)
    if (isInvalid) {
      return
    }

    const id = saveFunctionalSpec({
      ...draft,
      id: "",
      updatedAt: "",
      linkedApis: draft.linkedApiIds.length,
      tags: splitList(tags),
      requirements: splitList(requirements),
      acceptanceCriteria: splitList(criteria),
      reviewers: splitList(reviewers),
    })
    navigate(`/specs/functional/${id}`)
  }

  const applyAiDraft = () => {
    const generated = createFunctionalDraftFromPrompt(prompt)
    setDraft({
      title: generated.title,
      description: generated.description,
      owner: generated.owner,
      status: generated.status,
      category: generated.category,
      priority: generated.priority,
      version: generated.version,
      tags: generated.tags,
      linkedApiIds: generated.linkedApiIds,
      linkedEntityIds: generated.linkedEntityIds,
      requirements: generated.requirements,
      acceptanceCriteria: generated.acceptanceCriteria,
      reviewers: generated.reviewers,
      reviewState: generated.reviewState,
    })
    setTags(generated.tags.join(", "))
    setRequirements(generated.requirements.join(", "))
    setCriteria(generated.acceptanceCriteria.join(", "))
    setReviewers(generated.reviewers.join(", "))
  }

  return (
    <SpecPageLayout
      eyebrow="IDP SERVICE"
      title="기능 명세서 작성"
      description="템플릿 기반으로 요구사항, 검증 기준, 연결 API와 데이터 구조를 함께 작성합니다."
    >
      <Paper elevation={0} sx={pageCardSx}>
        <Stack spacing={2.5}>
          <PageActionBar onBack={() => navigate(-1)}>
            <Button
              variant="contained"
              startIcon={<AddOutlinedIcon />}
              onClick={handleSave}
              sx={{
                backgroundColor: "#22c55e",
                color: "#07120d",
                fontWeight: 800,
                "&:hover": { backgroundColor: "#16a34a" },
              }}
            >
              명세 생성
            </Button>
          </PageActionBar>

          <AiDraftSection label="작성하려는 기능" prompt={prompt} onPromptChange={setPrompt} onApply={applyAiDraft} />

          <FormSection title="기본 정보">
            <Stack spacing={2}>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <TextField
                  label="제목"
                  value={draft.title}
                  onChange={event => setDraft(current => ({ ...current, title: event.target.value }))}
                  error={submitAttempted && missingTitle}
                  helperText={submitAttempted && missingTitle ? "제목을 입력해 주세요." : ""}
                  fullWidth
                  sx={fieldSx}
                />
                <TextField
                  label="카테고리"
                  value={draft.category}
                  onChange={event => setDraft(current => ({ ...current, category: event.target.value }))}
                  fullWidth
                  select
                  sx={fieldSx}
                >
                  {CATEGORY_OPTIONS.map(option => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <TextField
                  label="담당자"
                  value={draft.owner}
                  onChange={event => setDraft(current => ({ ...current, owner: event.target.value }))}
                  fullWidth
                  select
                  sx={fieldSx}
                >
                  {OWNER_OPTIONS.map(option => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="우선순위"
                  value={draft.priority}
                  onChange={event =>
                    setDraft(current => ({ ...current, priority: event.target.value as SpecPriority }))
                  }
                  fullWidth
                  select
                  sx={fieldSx}
                >
                  {PRIORITY_OPTIONS.map(option => (
                    <MenuItem key={option} value={option}>
                      {PRIORITY_LABELS[option]}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="리뷰 상태"
                  value={draft.reviewState}
                  onChange={event =>
                    setDraft(current => ({ ...current, reviewState: event.target.value as ReviewState }))
                  }
                  fullWidth
                  select
                  sx={fieldSx}
                >
                  {REVIEW_STATE_OPTIONS.map(option => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
            </Stack>
          </FormSection>

          <FormSection title="상세 내용" description="요구사항과 검증 기준은 테스트/리뷰 단계에서 기준으로 사용됩니다.">
            <Stack spacing={2}>
              <TextField
                label="기능 설명"
                value={draft.description}
                onChange={event => setDraft(current => ({ ...current, description: event.target.value }))}
                error={submitAttempted && missingDescription}
                helperText={submitAttempted && missingDescription ? "기능 설명을 입력해 주세요." : ""}
                fullWidth
                multiline
                minRows={4}
                sx={fieldSx}
              />
              <TextListField label="요구사항" value={requirements} onChange={setRequirements} />
              <TextListField label="검증 기준" value={criteria} onChange={setCriteria} />
              <TextListField label="태그" value={tags} onChange={setTags} />
              <TextListField label="검토자" value={reviewers} onChange={setReviewers} />
            </Stack>
          </FormSection>

          <DocumentLinksSection
            primaryLabel="연결 API"
            primaryValue={draft.linkedApiIds}
            primaryOptions={apiOptions}
            onPrimaryChange={value => setDraft(current => ({ ...current, linkedApiIds: value }))}
            entityValue={draft.linkedEntityIds}
            entityOptions={entityOptions}
            onEntityChange={value => setDraft(current => ({ ...current, linkedEntityIds: value }))}
          />
        </Stack>
      </Paper>
    </SpecPageLayout>
  )
}
