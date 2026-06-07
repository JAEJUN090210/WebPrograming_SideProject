import { Button, Chip, Paper, Stack, Typography } from "@mui/material"
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined"
import { Link as RouterLink } from "react-router-dom"
import type { ApiSpec, ErdEntity, FunctionalSpec } from "../../types/specs"
import { panelSx } from "./formStyles"

type RelationshipPanelProps = {
  functionalSpecs?: FunctionalSpec[]
  apiSpecs?: ApiSpec[]
  entities?: ErdEntity[]
}

export default function RelationshipPanel({
  functionalSpecs = [],
  apiSpecs = [],
  entities = [],
}: RelationshipPanelProps) {
  return (
    <Paper elevation={0} sx={panelSx}>
      <Stack spacing={2}>
        <Stack spacing={0.5}>
          <Typography variant="h6" sx={{ color: "var(--idp-text)", fontWeight: 700 }}>
            연결 관계
          </Typography>
          <Typography variant="body2" sx={{ color: "var(--idp-text-muted)" }}>
            기능, API, 데이터 구조를 한 흐름으로 연결해 변경 영향도를 확인합니다.
          </Typography>
        </Stack>

        <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
          <RelationColumn
            title="기능 명세"
            emptyText="연결된 기능이 없습니다."
            items={functionalSpecs.map(spec => ({
              id: spec.id,
              label: spec.title,
              subLabel: spec.status,
              href: `/specs/functional/${spec.id}`,
            }))}
          />
          <RelationColumn
            title="API 명세"
            emptyText="연결된 API가 없습니다."
            items={apiSpecs.map(spec => ({
              id: spec.id,
              label: spec.name,
              subLabel: `${spec.method} ${spec.path}`,
              href: `/specs/api/${spec.id}`,
            }))}
          />
          <RelationColumn
            title="데이터 구조"
            emptyText="연결된 테이블이 없습니다."
            items={entities.map(entity => ({
              id: entity.id,
              label: entity.name,
              subLabel: `${entity.fields.length}개 컬럼`,
              href: "/erd",
            }))}
          />
        </Stack>
      </Stack>
    </Paper>
  )
}

type RelationItem = {
  id: string
  label: string
  subLabel: string
  href: string
}

function RelationColumn({ title, items, emptyText }: { title: string; items: RelationItem[]; emptyText: string }) {
  return (
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        p: 1.5,
        borderRadius: 2,
        border: "1px solid var(--idp-border)",
        backgroundColor: "rgba(2, 6, 23, 0.34)",
      }}
    >
      <Stack spacing={1.25}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="subtitle2" sx={{ color: "var(--idp-text)", fontWeight: 800 }}>
            {title}
          </Typography>
          <Chip size="small" label={items.length} />
        </Stack>
        {items.length === 0 ? (
          <Typography variant="body2" sx={{ color: "var(--idp-text-soft)" }}>
            {emptyText}
          </Typography>
        ) : (
          items.map(item => (
            <Paper
              key={item.id}
              elevation={0}
              sx={{
                p: 1.25,
                borderRadius: 2,
                backgroundColor: "rgba(15, 23, 42, 0.58)",
                border: "1px solid var(--idp-border)",
              }}
            >
              <Stack spacing={0.75}>
                <Typography variant="body2" sx={{ color: "var(--idp-text)", fontWeight: 700 }}>
                  {item.id} · {item.label}
                </Typography>
                <Typography variant="caption" sx={{ color: "var(--idp-text-muted)" }}>
                  {item.subLabel}
                </Typography>
                <Button
                  size="small"
                  component={RouterLink}
                  to={item.href}
                  startIcon={<OpenInNewOutlinedIcon />}
                  sx={{
                    color: "#7dd3fc",
                    justifyContent: "flex-start",
                    px: 0,
                    width: "fit-content",
                    fontWeight: 700,
                  }}
                >
                  열기
                </Button>
              </Stack>
            </Paper>
          ))
        )}
      </Stack>
    </Paper>
  )
}
