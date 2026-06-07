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
import { AUTH_OPTIONS, METHOD_OPTIONS, OWNER_OPTIONS, REVIEW_STATE_OPTIONS } from "../data/idpOptions"
import type { ApiSpec, AuthType, HttpMethod, ReviewState } from "../types/specs"
import { createApiDraftFromPrompt } from "../utils/idpAnalysis"
import { splitList } from "../utils/idpStore"

type ApiSpecDraft = Omit<ApiSpec, "id" | "updatedAt">

const emptyDraft: ApiSpecDraft = {
  name: "",
  description: "",
  owner: "전재준",
  status: "Draft",
  method: "GET",
  path: "",
  version: "0.1",
  tags: [],
  auth: "JWT",
  latencyMs: 160,
  requestBody: "{}",
  responseBody: "{}",
  linkedFunctionalIds: [],
  linkedEntityIds: [],
  reviewers: [],
  reviewState: "대기",
}

export default function ApiSpecCreatePage() {
  const navigate = useNavigate()
  const { state, saveApiSpec } = useIdpStore()
  const [draft, setDraft] = useState<ApiSpecDraft>(emptyDraft)
  const [tags, setTags] = useState("")
  const [reviewers, setReviewers] = useState("")
  const [prompt, setPrompt] = useState("")
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const missingName = draft.name.trim().length === 0
  const missingPath = draft.path.trim().length === 0
  const isInvalid = missingName || missingPath

  const handleSave = () => {
    setSubmitAttempted(true)
    if (isInvalid) {
      return
    }

    const id = saveApiSpec({
      ...draft,
      id: "",
      updatedAt: "",
      tags: splitList(tags),
      reviewers: splitList(reviewers),
    })
    navigate(`/specs/api/${id}`)
  }

  const applyAiDraft = () => {
    const generated = createApiDraftFromPrompt(prompt)
    setDraft({
      name: generated.name,
      description: generated.description,
      owner: generated.owner,
      status: generated.status,
      method: generated.method,
      path: generated.path,
      version: generated.version,
      tags: generated.tags,
      auth: generated.auth,
      latencyMs: generated.latencyMs,
      requestBody: generated.requestBody,
      responseBody: generated.responseBody,
      linkedFunctionalIds: generated.linkedFunctionalIds,
      linkedEntityIds: generated.linkedEntityIds,
      reviewers: generated.reviewers,
      reviewState: generated.reviewState,
    })
    setTags(generated.tags.join(", "))
    setReviewers(generated.reviewers.join(", "))
  }

  return (
    <SpecPageLayout
      eyebrow="IDP SERVICE"
      title="API 명세서 작성"
      description="엔드포인트, 인증 방식, 요청/응답 예시와 연결 기능을 함께 작성합니다."
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
              API 명세 생성
            </Button>
          </PageActionBar>

          <AiDraftSection label="작성하려는 API" prompt={prompt} onPromptChange={setPrompt} onApply={applyAiDraft} />

          <FormSection title="기본 정보">
            <Stack spacing={2}>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <TextField
                  label="API 이름"
                  value={draft.name}
                  onChange={event => setDraft(current => ({ ...current, name: event.target.value }))}
                  error={submitAttempted && missingName}
                  helperText={submitAttempted && missingName ? "API 이름을 입력해 주세요." : ""}
                  fullWidth
                  sx={fieldSx}
                />
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
              </Stack>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <TextField
                  label="메서드"
                  value={draft.method}
                  onChange={event => setDraft(current => ({ ...current, method: event.target.value as HttpMethod }))}
                  fullWidth
                  select
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
                  value={draft.path}
                  onChange={event => setDraft(current => ({ ...current, path: event.target.value }))}
                  error={submitAttempted && missingPath}
                  helperText={submitAttempted && missingPath ? "API 경로를 입력해 주세요." : ""}
                  fullWidth
                  sx={fieldSx}
                />
                <TextField
                  label="인증"
                  value={draft.auth}
                  onChange={event => setDraft(current => ({ ...current, auth: event.target.value as AuthType }))}
                  fullWidth
                  select
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
                value={draft.description}
                onChange={event => setDraft(current => ({ ...current, description: event.target.value }))}
                fullWidth
                multiline
                minRows={3}
                sx={fieldSx}
              />
              <TextListField label="태그" value={tags} onChange={setTags} />
              <TextListField label="검토자" value={reviewers} onChange={setReviewers} />
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
          </FormSection>

          <FormSection
            title="요청 / 응답 구조"
            description="프론트엔드와 QA가 같은 기준으로 확인할 수 있도록 예시를 남깁니다."
          >
            <Stack spacing={2}>
              <TextField
                label="요청 예시"
                value={draft.requestBody}
                onChange={event => setDraft(current => ({ ...current, requestBody: event.target.value }))}
                fullWidth
                multiline
                minRows={4}
                sx={fieldSx}
              />
              <TextField
                label="응답 예시"
                value={draft.responseBody}
                onChange={event => setDraft(current => ({ ...current, responseBody: event.target.value }))}
                fullWidth
                multiline
                minRows={4}
                sx={fieldSx}
              />
            </Stack>
          </FormSection>

          <DocumentLinksSection
            primaryLabel="연결 기능 명세"
            primaryValue={draft.linkedFunctionalIds}
            primaryOptions={state.functionalSpecs.map(spec => ({
              value: spec.id,
              label: `${spec.id} · ${spec.title}`,
            }))}
            onPrimaryChange={value => setDraft(current => ({ ...current, linkedFunctionalIds: value }))}
            entityValue={draft.linkedEntityIds}
            entityOptions={state.erdEntities.map(entity => ({ value: entity.id, label: entity.name }))}
            onEntityChange={value => setDraft(current => ({ ...current, linkedEntityIds: value }))}
          />
        </Stack>
      </Paper>
    </SpecPageLayout>
  )
}
