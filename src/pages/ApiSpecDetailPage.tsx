import { Button, Chip, Paper, Stack } from "@mui/material"
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined"
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined"
import { useMemo, useState } from "react"
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom"
import CommentPanel from "../components/idp/CommentPanel"
import InsightPanel from "../components/idp/InsightPanel"
import VersionPanel from "../components/idp/VersionPanel"
import ApiSpecEndpointSection from "../components/idp/forms/ApiSpecEndpointSection"
import ApiSpecPayloadSection from "../components/idp/forms/ApiSpecPayloadSection"
import DocumentLinksSection from "../components/idp/forms/DocumentLinksSection"
import { pageCardSx } from "../components/idp/formStyles"
import DocumentEditHeader from "../components/idp/layout/DocumentEditHeader"
import PageActionBar from "../components/idp/layout/PageActionBar"
import RelationshipPanel from "../components/idp/RelationshipPanel"
import SpecPageLayout from "../components/specs/SpecPageLayout"
import useIdpStore from "../hooks/useIdpStore"
import { STATUS_LABELS } from "../data/idpOptions"
import type { ApiSpec } from "../types/specs"
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
          <PageActionBar onBack={() => navigate(-1)}>
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
          </PageActionBar>

          <DocumentEditHeader
            id={safeForm.id}
            version={safeForm.version}
            updatedAt={safeForm.updatedAt}
            value={safeForm.name}
            onChange={value => updateForm("name", value)}
          />

          <ApiSpecEndpointSection
            spec={safeForm}
            tags={tags}
            reviewers={reviewers}
            onSpecChange={updateForm}
            onTagsChange={setTags}
            onReviewersChange={setReviewers}
          />
          <ApiSpecPayloadSection spec={safeForm} onSpecChange={updateForm} />

          <DocumentLinksSection
            primaryLabel="연결 기능 명세"
            primaryValue={safeForm.linkedFunctionalIds}
            primaryOptions={state.functionalSpecs.map(functional => ({
              value: functional.id,
              label: `${functional.id} · ${functional.title}`,
            }))}
            onPrimaryChange={value => updateForm("linkedFunctionalIds", value)}
            entityValue={safeForm.linkedEntityIds}
            entityOptions={state.erdEntities.map(entity => ({ value: entity.id, label: entity.name }))}
            onEntityChange={value => updateForm("linkedEntityIds", value)}
          />

          <RelationshipPanel functionalSpecs={linkedFunctionalSpecs} entities={linkedEntities} />
          <InsightPanel insights={insights} />
          <VersionPanel versions={versions} onRestore={restoreApiVersion} />
          <CommentPanel comments={comments} onAdd={(message, kind) => addComment("api", safeForm.id, message, kind)} />
        </Stack>
      </Paper>
    </SpecPageLayout>
  )
}
