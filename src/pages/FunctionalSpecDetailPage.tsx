import { Button, Chip, Divider, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material"
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined"
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined"
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined"
import { useMemo, useState } from "react"
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom"
import CommentPanel from "../components/idp/CommentPanel"
import InsightPanel from "../components/idp/InsightPanel"
import MultiSelectField from "../components/idp/MultiSelectField"
import RelationshipPanel from "../components/idp/RelationshipPanel"
import VersionPanel from "../components/idp/VersionPanel"
import { fieldSx, pageCardSx, panelSx } from "../components/idp/formStyles"
import SpecPageLayout from "../components/specs/SpecPageLayout"
import useIdpStore from "../hooks/useIdpStore"
import {
  CATEGORY_OPTIONS,
  OWNER_OPTIONS,
  PRIORITY_LABELS,
  PRIORITY_OPTIONS,
  REVIEW_STATE_OPTIONS,
  STATUS_LABELS,
  STATUS_OPTIONS,
} from "../data/idpOptions"
import type { FunctionalSpec, ReviewState, SpecPriority, SpecStatus } from "../types/specs"
import { getFunctionalInsights, recommendApiLinks } from "../utils/idpAnalysis"
import { splitList } from "../utils/idpStore"

export default function FunctionalSpecDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { state, saveFunctionalSpec, deleteFunctionalSpec, restoreFunctionalVersion, addComment } = useIdpStore()
  const spec = useMemo(() => state.functionalSpecs.find(item => item.id === id), [id, state.functionalSpecs])
  const [form, setForm] = useState<FunctionalSpec | null>(() => spec ?? null)
  const [tags, setTags] = useState(() => spec?.tags.join(", ") ?? "")
  const [requirements, setRequirements] = useState(() => spec?.requirements.join(", ") ?? "")
  const [criteria, setCriteria] = useState(() => spec?.acceptanceCriteria.join(", ") ?? "")
  const [reviewers, setReviewers] = useState(() => spec?.reviewers.join(", ") ?? "")

  const safeForm = form ?? spec
  const versions = state.versions.filter(version => version.targetType === "functional" && version.targetId === id)
  const comments = state.comments.filter(comment => comment.targetType === "functional" && comment.targetId === id)
  const linkedApis = state.apiSpecs.filter(api => safeForm?.linkedApiIds.includes(api.id))
  const linkedEntities = state.erdEntities.filter(entity => safeForm?.linkedEntityIds.includes(entity.id))
  const insights = safeForm
    ? getFunctionalInsights(
        {
          ...safeForm,
          tags: splitList(tags),
          requirements: splitList(requirements),
          acceptanceCriteria: splitList(criteria),
        },
        state
      )
    : []
  const recommendations = safeForm ? recommendApiLinks({ ...safeForm, tags: splitList(tags) }, state) : []

  if (!safeForm) {
    return (
      <SpecPageLayout
        eyebrow="IDP SERVICE"
        title="기능 명세를 찾을 수 없습니다"
        description="삭제되었거나 존재하지 않는 문서입니다."
      >
        <Button component={RouterLink} to="/specs/functional" sx={{ color: "#7dd3fc", width: "fit-content" }}>
          목록으로 이동
        </Button>
      </SpecPageLayout>
    )
  }

  const updateForm = <K extends keyof FunctionalSpec>(field: K, value: FunctionalSpec[K]) => {
    setForm(current => (current ? { ...current, [field]: value } : current))
  }

  const handleSave = () => {
    saveFunctionalSpec({
      ...safeForm,
      tags: splitList(tags),
      requirements: splitList(requirements),
      acceptanceCriteria: splitList(criteria),
      reviewers: splitList(reviewers),
      linkedApis: safeForm.linkedApiIds.length,
    })
  }

  const handleDelete = () => {
    if (window.confirm(`${safeForm.id} 기능 명세를 삭제할까요?`)) {
      deleteFunctionalSpec(safeForm.id)
      navigate("/specs/functional")
    }
  }

  return (
    <SpecPageLayout
      eyebrow="IDP SERVICE"
      title="기능 명세서 상세"
      description="기능 요구사항, API·데이터 연결, 버전 이력, 댓글과 AI 검토 결과를 한 화면에서 관리합니다."
    >
      <Paper elevation={0} sx={pageCardSx}>
        <Stack spacing={2.5}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            sx={{ alignItems: { md: "center" }, justifyContent: "space-between" }}
          >
            <Button
              variant="text"
              startIcon={<ArrowBackOutlinedIcon />}
              onClick={() => navigate(-1)}
              sx={{ color: "var(--idp-text-muted)", fontWeight: 700 }}
            >
              뒤로가기
            </Button>
            <Stack direction="row" spacing={1.25} sx={{ alignItems: "center", flexWrap: "wrap" }}>
              <Chip label={STATUS_LABELS[safeForm.status]} sx={{ color: "var(--idp-text)", fontWeight: 700 }} />
              <Button
                variant="outlined"
                startIcon={<DeleteOutlineOutlinedIcon />}
                onClick={handleDelete}
                sx={{ borderColor: "rgba(248, 113, 113, 0.5)", color: "#fca5a5", fontWeight: 700 }}
              >
                삭제
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveOutlinedIcon />}
                onClick={handleSave}
                sx={{
                  backgroundColor: "#22c55e",
                  color: "#07120d",
                  fontWeight: 800,
                  "&:hover": { backgroundColor: "#16a34a" },
                }}
              >
                저장
              </Button>
            </Stack>
          </Stack>

          <Stack spacing={0.75}>
            <Typography variant="overline" sx={{ color: "var(--idp-text-soft)" }}>
              {safeForm.id} · v{safeForm.version} · {safeForm.updatedAt}
            </Typography>
            <TextField
              variant="standard"
              value={safeForm.title}
              onChange={event => updateForm("title", event.target.value)}
              slotProps={{ input: { sx: { fontSize: 28, fontWeight: 800, color: "var(--idp-text)" } } }}
              sx={{ "& .MuiInputBase-input": { color: "var(--idp-text)" } }}
            />
          </Stack>

          <Divider sx={{ borderColor: "var(--idp-border)" }} />

          <Paper elevation={0} sx={panelSx}>
            <Stack spacing={2}>
              <Typography variant="h6" sx={{ color: "var(--idp-text)", fontWeight: 700 }}>
                명세 본문
              </Typography>
              <TextField
                label="기능 설명"
                value={safeForm.description}
                onChange={event => updateForm("description", event.target.value)}
                multiline
                minRows={4}
                fullWidth
                sx={fieldSx}
              />
              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <TextField
                  label="카테고리"
                  value={safeForm.category}
                  onChange={event => updateForm("category", event.target.value)}
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
                  value={safeForm.status}
                  onChange={event => updateForm("status", event.target.value as SpecStatus)}
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
                  value={safeForm.priority}
                  onChange={event => updateForm("priority", event.target.value as SpecPriority)}
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
                  value={safeForm.owner}
                  onChange={event => updateForm("owner", event.target.value)}
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
                  value={safeForm.reviewState}
                  onChange={event => updateForm("reviewState", event.target.value as ReviewState)}
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
                label="요구사항(쉼표로 구분)"
                value={requirements}
                onChange={event => setRequirements(event.target.value)}
                fullWidth
                sx={fieldSx}
              />
              <TextField
                label="검증 기준(쉼표로 구분)"
                value={criteria}
                onChange={event => setCriteria(event.target.value)}
                fullWidth
                sx={fieldSx}
              />
              <TextField
                label="태그(쉼표로 구분)"
                value={tags}
                onChange={event => setTags(event.target.value)}
                fullWidth
                sx={fieldSx}
              />
              <TextField
                label="검토자(쉼표로 구분)"
                value={reviewers}
                onChange={event => setReviewers(event.target.value)}
                fullWidth
                sx={fieldSx}
              />
            </Stack>
          </Paper>

          <Paper elevation={0} sx={panelSx}>
            <Stack spacing={2}>
              <Typography variant="h6" sx={{ color: "var(--idp-text)", fontWeight: 700 }}>
                문서 연결
              </Typography>
              <MultiSelectField
                label="연결 API"
                value={safeForm.linkedApiIds}
                options={state.apiSpecs.map(api => ({ value: api.id, label: `${api.id} · ${api.name}` }))}
                onChange={value => updateForm("linkedApiIds", value)}
              />
              <MultiSelectField
                label="연결 데이터 테이블"
                value={safeForm.linkedEntityIds}
                options={state.erdEntities.map(entity => ({ value: entity.id, label: entity.name }))}
                onChange={value => updateForm("linkedEntityIds", value)}
              />
              {recommendations.length > 0 ? (
                <Stack spacing={0.75}>
                  <Typography variant="subtitle2" sx={{ color: "#e0f2fe", fontWeight: 800 }}>
                    AI 추천 연결 API
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
                    {recommendations.map(item => (
                      <Chip
                        key={item.api.id}
                        label={`${item.api.id} · ${item.api.name}`}
                        sx={{ color: "var(--idp-text)" }}
                      />
                    ))}
                  </Stack>
                </Stack>
              ) : null}
            </Stack>
          </Paper>

          <RelationshipPanel apiSpecs={linkedApis} entities={linkedEntities} />
          <InsightPanel insights={insights} />
          <VersionPanel versions={versions} onRestore={restoreFunctionalVersion} />
          <CommentPanel
            comments={comments}
            onAdd={(message, kind) => addComment("functional", safeForm.id, message, kind)}
          />
        </Stack>
      </Paper>
    </SpecPageLayout>
  )
}
