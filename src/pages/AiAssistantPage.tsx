import { Button, Chip, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material"
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined"
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined"
import { useMemo, useState } from "react"
import InsightPanel from "../components/idp/InsightPanel"
import { fieldSx, panelSx } from "../components/idp/formStyles"
import SpecPageLayout from "../components/specs/SpecPageLayout"
import SpecSummary from "../components/specs/SpecSummary"
import useIdpStore from "../hooks/useIdpStore"
import type { ApiSpec, FunctionalSpec } from "../types/specs"
import {
  createApiDraftFromPrompt,
  createFunctionalDraftFromPrompt,
  getApiInsights,
  getFunctionalInsights,
  type InsightItem,
} from "../utils/idpAnalysis"

type DraftType = "functional" | "api"

export default function AiAssistantPage() {
  const { state, saveFunctionalSpec, saveApiSpec } = useIdpStore()
  const [draftType, setDraftType] = useState<DraftType>("functional")
  const [prompt, setPrompt] = useState("문서 변경 알림 기능")
  const [functionalDraft, setFunctionalDraft] = useState<FunctionalSpec | null>(null)
  const [apiDraft, setApiDraft] = useState<ApiSpec | null>(null)

  const qualityInsights = useMemo<InsightItem[]>(() => {
    const functionalIssues = state.functionalSpecs.flatMap(spec =>
      getFunctionalInsights(spec, state).filter(item => item.severity !== "good")
    )
    const apiIssues = state.apiSpecs.flatMap(spec => getApiInsights(spec).filter(item => item.severity !== "good"))
    const duplicatePaths = state.apiSpecs
      .filter(
        (api, index) => state.apiSpecs.findIndex(item => item.path === api.path && item.method === api.method) !== index
      )
      .map(api => ({
        title: "중복 API 후보",
        detail: `${api.method} ${api.path} 경로가 중복될 수 있습니다.`,
        severity: "warning" as const,
      }))

    return [...duplicatePaths, ...functionalIssues, ...apiIssues].slice(0, 8)
  }, [state])

  const activeDraft = draftType === "functional" ? functionalDraft : apiDraft

  const handleGenerate = () => {
    if (draftType === "functional") {
      setFunctionalDraft(createFunctionalDraftFromPrompt(prompt))
      return
    }
    setApiDraft(createApiDraftFromPrompt(prompt))
  }

  const handleSave = () => {
    if (draftType === "functional" && functionalDraft) {
      saveFunctionalSpec(functionalDraft)
    }
    if (draftType === "api" && apiDraft) {
      saveApiSpec(apiDraft)
    }
  }

  return (
    <SpecPageLayout eyebrow="IDP SERVICE" title="AI 문서 작성 보조">
      <SpecSummary
        items={[
          { label: "검토 문서", value: state.functionalSpecs.length + state.apiSpecs.length, helper: "AI 점검 대상" },
          { label: "개선 후보", value: qualityInsights.length, helper: "누락·중복·불일치" },
          { label: "작성 초안", value: activeDraft ? 1 : 0, helper: "현재 생성된 초안" },
        ]}
      />

      <Paper elevation={0} sx={panelSx}>
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ color: "var(--idp-text)", fontWeight: 800 }}>
            문서 초안 생성
          </Typography>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              label="문서 종류"
              value={draftType}
              onChange={event => setDraftType(event.target.value as DraftType)}
              select
              sx={{ ...fieldSx, minWidth: 180 }}
            >
              <MenuItem value="functional">기능 명세</MenuItem>
              <MenuItem value="api">API 명세</MenuItem>
            </TextField>
            <TextField
              label="키워드 또는 작성 요청"
              value={prompt}
              onChange={event => setPrompt(event.target.value)}
              fullWidth
              sx={fieldSx}
            />
            <Button
              variant="contained"
              startIcon={<AutoAwesomeOutlinedIcon />}
              onClick={handleGenerate}
              sx={{
                backgroundColor: "#38bdf8",
                color: "#03101a",
                fontWeight: 800,
                "&:hover": { backgroundColor: "#0ea5e9" },
              }}
            >
              생성
            </Button>
            <Button
              variant="outlined"
              startIcon={<SaveOutlinedIcon />}
              disabled={!activeDraft}
              onClick={handleSave}
              sx={{ borderColor: "rgba(34, 197, 94, 0.55)", color: "#86efac", fontWeight: 800 }}
            >
              저장
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {activeDraft ? (
        <Paper elevation={0} sx={panelSx}>
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
              <Chip label={draftType === "functional" ? "기능 명세 초안" : "API 명세 초안"} />
              <Typography variant="h6" sx={{ color: "var(--idp-text)", fontWeight: 800 }}>
                {"title" in activeDraft ? activeDraft.title : activeDraft.name}
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: "var(--idp-text-muted)" }}>
              {activeDraft.description}
            </Typography>
            {"path" in activeDraft ? (
              <Typography variant="body2" sx={{ color: "#bae6fd", fontWeight: 800 }}>
                {activeDraft.method} {activeDraft.path}
              </Typography>
            ) : (
              <Stack spacing={0.75}>
                {activeDraft.requirements.map(requirement => (
                  <Typography key={requirement} variant="body2" sx={{ color: "var(--idp-text-muted)" }}>
                    · {requirement}
                  </Typography>
                ))}
              </Stack>
            )}
          </Stack>
        </Paper>
      ) : null}

      <InsightPanel
        title="전체 문서 품질 검토"
        insights={
          qualityInsights.length > 0
            ? qualityInsights
            : [{ title: "문서 품질 양호", detail: "현재 큰 누락이나 불일치 후보가 없습니다.", severity: "good" }]
        }
      />
    </SpecPageLayout>
  )
}
