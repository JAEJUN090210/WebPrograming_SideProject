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
  AUTH_OPTIONS,
  METHOD_OPTIONS,
  OWNER_OPTIONS,
  REVIEW_STATE_OPTIONS,
  STATUS_LABELS,
  STATUS_OPTIONS,
} from "../data/idpOptions"
import type { ApiSpec, AuthType, HttpMethod, ReviewState, SpecStatus } from "../types/specs"
import { getApiInsights } from "../utils/idpAnalysis"
import { splitList } from "../utils/idpStore"

export default function ApiSpecDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { state, saveApiSpec, deleteApiSpec, restoreApiVersion, addComment } = useIdpStore()
  const spec = useMemo(() => state.apiSpecs.find(item => item.id === id), [id, state.apiSpecs])
  const [form, setForm] = useState<ApiSpec | null>(() => spec ?? null)
  const [tags, setTags] = useState(() => spec?.tags.join(", ") ?? "")
  const [reviewers, setReviewers] = useState(() => spec?.reviewers.join(", ") ?? "")

  const safeForm = form ?? spec
  const versions = state.versions.filter(version => version.targetType === "api" && version.targetId === id)
  const comments = state.comments.filter(comment => comment.targetType === "api" && comment.targetId === id)
  const linkedFunctionalSpecs = state.functionalSpecs.filter(functional =>
    safeForm?.linkedFunctionalIds.includes(functional.id)
  )
  const linkedEntities = state.erdEntities.filter(entity => safeForm?.linkedEntityIds.includes(entity.id))
  const insights = safeForm ? getApiInsights({ ...safeForm, tags: splitList(tags) }) : []

  if (!safeForm) {
    return (
      <SpecPageLayout
        eyebrow="IDP SERVICE"
        title="API 명세를 찾을 수 없습니다"
        description="삭제되었거나 존재하지 않는 문서입니다."
      >
        <Button component={RouterLink} to="/specs/api" sx={{ color: "#7dd3fc", width: "fit-content" }}>
          목록으로 이동
        </Button>
      </SpecPageLayout>
    )
  }

  const updateForm = <K extends keyof ApiSpec>(field: K, value: ApiSpec[K]) => {
    setForm(current => (current ? { ...current, [field]: value } : current))
  }

  const handleSave = () => {
    saveApiSpec({
      ...safeForm,
      tags: splitList(tags),
      reviewers: splitList(reviewers),
    })
  }

  const handleDelete = () => {
    if (window.confirm(`${safeForm.id} API 명세를 삭제할까요?`)) {
      deleteApiSpec(safeForm.id)
      navigate("/specs/api")
    }
  }

  return (
    <SpecPageLayout
      eyebrow="IDP SERVICE"
      title="API 명세서 상세"
      description="엔드포인트, 요청/응답 구조, 기능·데이터 연결, 버전과 리뷰를 함께 관리합니다."
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
              value={safeForm.name}
              onChange={event => updateForm("name", event.target.value)}
              slotProps={{ input: { sx: { fontSize: 28, fontWeight: 800, color: "var(--idp-text)" } } }}
              sx={{ "& .MuiInputBase-input": { color: "var(--idp-text)" } }}
            />
          </Stack>

          <Divider sx={{ borderColor: "var(--idp-border)" }} />

          <Paper elevation={0} sx={panelSx}>
            <Stack spacing={2}>
              <Typography variant="h6" sx={{ color: "var(--idp-text)", fontWeight: 700 }}>
                엔드포인트 정보
              </Typography>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <TextField
                  label="메서드"
                  value={safeForm.method}
                  onChange={event => updateForm("method", event.target.value as HttpMethod)}
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
                  value={safeForm.path}
                  onChange={event => updateForm("path", event.target.value)}
                  fullWidth
                  sx={fieldSx}
                />
                <TextField
                  label="인증"
                  value={safeForm.auth}
                  onChange={event => updateForm("auth", event.target.value as AuthType)}
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
                value={safeForm.description}
                onChange={event => updateForm("description", event.target.value)}
                multiline
                minRows={3}
                fullWidth
                sx={fieldSx}
              />
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
                label="예상 응답 시간(ms)"
                type="number"
                value={safeForm.latencyMs}
                onChange={event => updateForm("latencyMs", Number(event.target.value))}
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
                요청 / 응답 구조
              </Typography>
              <TextField
                label="요청 예시"
                value={safeForm.requestBody}
                onChange={event => updateForm("requestBody", event.target.value)}
                fullWidth
                multiline
                minRows={5}
                sx={fieldSx}
              />
              <TextField
                label="응답 예시"
                value={safeForm.responseBody}
                onChange={event => updateForm("responseBody", event.target.value)}
                fullWidth
                multiline
                minRows={5}
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
                label="연결 기능 명세"
                value={safeForm.linkedFunctionalIds}
                options={state.functionalSpecs.map(functional => ({
                  value: functional.id,
                  label: `${functional.id} · ${functional.title}`,
                }))}
                onChange={value => updateForm("linkedFunctionalIds", value)}
              />
              <MultiSelectField
                label="연결 데이터 테이블"
                value={safeForm.linkedEntityIds}
                options={state.erdEntities.map(entity => ({ value: entity.id, label: entity.name }))}
                onChange={value => updateForm("linkedEntityIds", value)}
              />
            </Stack>
          </Paper>

          <RelationshipPanel functionalSpecs={linkedFunctionalSpecs} entities={linkedEntities} />
          <InsightPanel insights={insights} />
          <VersionPanel versions={versions} onRestore={restoreApiVersion} />
          <CommentPanel comments={comments} onAdd={(message, kind) => addComment("api", safeForm.id, message, kind)} />
        </Stack>
      </Paper>
    </SpecPageLayout>
  )
}
