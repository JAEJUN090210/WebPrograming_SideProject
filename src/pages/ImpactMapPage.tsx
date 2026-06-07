import { Box, Button, Chip, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material"
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined"
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined"
import { Link as RouterLink } from "react-router-dom"
import { useMemo, useState } from "react"
import { panelSx, fieldSx } from "../components/idp/formStyles"
import SpecPageLayout from "../components/specs/SpecPageLayout"
import SpecSummary from "../components/specs/SpecSummary"
import useIdpStore from "../hooks/useIdpStore"
import { getImpactSummary } from "../utils/idpAnalysis"

export default function ImpactMapPage() {
  const { state } = useIdpStore()
  const targets = [
    ...state.functionalSpecs.map(spec => ({ value: spec.id, label: `${spec.id} · ${spec.title}`, type: "기능" })),
    ...state.apiSpecs.map(spec => ({ value: spec.id, label: `${spec.id} · ${spec.name}`, type: "API" })),
    ...state.erdEntities.map(entity => ({ value: entity.id, label: `${entity.name}`, type: "데이터" })),
  ]
  const [targetId, setTargetId] = useState(targets[0]?.value ?? "")
  const impact = useMemo(() => getImpactSummary(targetId, state), [state, targetId])
  const totalImpact = impact.functional.length + impact.apis.length + impact.entities.length

  const summaryItems = [
    { label: "영향 기능", value: impact.functional.length, helper: "확인할 기능 명세" },
    { label: "영향 API", value: impact.apis.length, helper: "수정 영향 API" },
    { label: "영향 데이터", value: impact.entities.length, helper: "참조 데이터 구조" },
  ]

  return (
    <SpecPageLayout
      eyebrow="IDP SERVICE"
      title="문서 관계도 / 영향도 분석"
      description="기능 명세, API 명세, ERD의 연결 관계를 기반으로 변경 영향 범위를 추적합니다."
    >
      <SpecSummary items={summaryItems} />

      <Paper elevation={0} sx={panelSx}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ alignItems: { md: "center" } }}>
          <TextField
            label="변경 기준 문서"
            value={targetId}
            onChange={event => setTargetId(event.target.value)}
            fullWidth
            select
            sx={fieldSx}
          >
            {targets.map(target => (
              <MenuItem key={target.value} value={target.value}>
                [{target.type}] {target.label}
              </MenuItem>
            ))}
          </TextField>
          <Chip
            icon={<AccountTreeOutlinedIcon />}
            label={`총 ${totalImpact}개 영향 문서`}
            sx={{ color: "var(--idp-text)", fontWeight: 800, px: 1, width: "fit-content" }}
          />
        </Stack>
      </Paper>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "repeat(3, minmax(0, 1fr))" },
          gap: 2,
        }}
      >
        <ImpactColumn
          title="기능 명세"
          color="#34d399"
          items={impact.functional.map(spec => ({
            id: spec.id,
            title: spec.title,
            detail: `${spec.status} · API ${spec.linkedApiIds.length} · ERD ${spec.linkedEntityIds.length}`,
            href: `/specs/functional/${spec.id}`,
          }))}
        />
        <ImpactColumn
          title="API 명세"
          color="#38bdf8"
          items={impact.apis.map(api => ({
            id: api.id,
            title: api.name,
            detail: `${api.method} ${api.path} · ${api.auth}`,
            href: `/specs/api/${api.id}`,
          }))}
        />
        <ImpactColumn
          title="데이터 구조"
          color="#fbbf24"
          items={impact.entities.map(entity => ({
            id: entity.id,
            title: entity.name,
            detail: `${entity.fields.length}개 컬럼 · ${entity.owner}`,
            href: "/erd",
          }))}
        />
      </Box>
    </SpecPageLayout>
  )
}

type ImpactItem = {
  id: string
  title: string
  detail: string
  href: string
}

function ImpactColumn({ title, color, items }: { title: string; color: string; items: ImpactItem[] }) {
  return (
    <Paper elevation={0} sx={panelSx}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ color: "var(--idp-text)", fontWeight: 800 }}>
            {title}
          </Typography>
          <Chip label={items.length} sx={{ color, fontWeight: 800 }} />
        </Stack>

        <Stack spacing={1.25}>
          {items.length === 0 ? (
            <Typography variant="body2" sx={{ color: "var(--idp-text-soft)" }}>
              연결된 문서가 없습니다.
            </Typography>
          ) : (
            items.map(item => (
              <Paper
                key={item.id}
                elevation={0}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  border: `1px solid ${color}55`,
                  backgroundColor: "rgba(2, 6, 23, 0.42)",
                }}
              >
                <Stack spacing={0.75}>
                  <Typography variant="body2" sx={{ color: "var(--idp-text)", fontWeight: 800 }}>
                    {item.id} · {item.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "var(--idp-text-muted)" }}>
                    {item.detail}
                  </Typography>
                  <Button
                    component={RouterLink}
                    to={item.href}
                    startIcon={<OpenInNewOutlinedIcon />}
                    sx={{ color, justifyContent: "flex-start", width: "fit-content", px: 0, fontWeight: 800 }}
                  >
                    열기
                  </Button>
                </Stack>
              </Paper>
            ))
          )}
        </Stack>
      </Stack>
    </Paper>
  )
}
