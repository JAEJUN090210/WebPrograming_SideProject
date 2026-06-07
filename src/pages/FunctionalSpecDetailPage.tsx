import { Button, Chip, Paper, Stack, Typography } from "@mui/material"
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined"
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined"
import { useMemo, useState } from "react"
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom"
import CommentPanel from "../components/idp/CommentPanel"
import InsightPanel from "../components/idp/InsightPanel"
import VersionPanel from "../components/idp/VersionPanel"
import DocumentLinksSection from "../components/idp/forms/DocumentLinksSection"
import FunctionalSpecBodySection from "../components/idp/forms/FunctionalSpecBodySection"
import { pageCardSx } from "../components/idp/formStyles"
import DocumentEditHeader from "../components/idp/layout/DocumentEditHeader"
import PageActionBar from "../components/idp/layout/PageActionBar"
import RelationshipPanel from "../components/idp/RelationshipPanel"
import SpecPageLayout from "../components/specs/SpecPageLayout"
import useIdpStore from "../hooks/useIdpStore"
import { STATUS_LABELS } from "../data/idpOptions"
import type { FunctionalSpec } from "../types/specs"
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
            value={safeForm.title}
            onChange={value => updateForm("title", value)}
          />

          <FunctionalSpecBodySection
            spec={safeForm}
            tags={tags}
            requirements={requirements}
            criteria={criteria}
            reviewers={reviewers}
            onSpecChange={updateForm}
            onTagsChange={setTags}
            onRequirementsChange={setRequirements}
            onCriteriaChange={setCriteria}
            onReviewersChange={setReviewers}
          />

          <DocumentLinksSection
            primaryLabel="연결 API"
            primaryValue={safeForm.linkedApiIds}
            primaryOptions={state.apiSpecs.map(api => ({ value: api.id, label: `${api.id} · ${api.name}` }))}
            onPrimaryChange={value => updateForm("linkedApiIds", value)}
            entityValue={safeForm.linkedEntityIds}
            entityOptions={state.erdEntities.map(entity => ({ value: entity.id, label: entity.name }))}
            onEntityChange={value => updateForm("linkedEntityIds", value)}
          >
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
          </DocumentLinksSection>

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
