import { Button, Chip, Paper, Stack, Typography } from "@mui/material"
import RestoreOutlinedIcon from "@mui/icons-material/RestoreOutlined"
import type { SpecVersion } from "../../types/specs"
import { panelSx } from "./formStyles"

type VersionPanelProps = {
  versions: SpecVersion[]
  onRestore: (versionId: string) => void
}

export default function VersionPanel({ versions, onRestore }: VersionPanelProps) {
  return (
    <Paper elevation={0} sx={panelSx}>
      <Stack spacing={2}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
          <Stack spacing={0.5}>
            <Typography variant="h6" sx={{ color: "var(--idp-text)", fontWeight: 700 }}>
              버전 관리
            </Typography>
          </Stack>
          <Chip label={`${versions.length}개 버전`} sx={{ width: "fit-content", color: "var(--idp-text-muted)" }} />
        </Stack>

        <Stack spacing={1.25}>
          {versions.length === 0 ? (
            <Typography variant="body2" sx={{ color: "var(--idp-text-soft)" }}>
              아직 저장된 이전 버전이 없습니다. 문서를 수정하면 이력이 생성됩니다.
            </Typography>
          ) : (
            versions.map(version => (
              <Paper
                key={version.id}
                elevation={0}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: "rgba(2, 6, 23, 0.46)",
                  border: "1px solid var(--idp-border)",
                }}
              >
                <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
                  <Stack spacing={0.5}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
                      <Chip size="small" label={`v${version.version}`} />
                      <Typography variant="body2" sx={{ color: "var(--idp-text)", fontWeight: 700 }}>
                        {version.summary}
                      </Typography>
                    </Stack>
                    <Typography variant="caption" sx={{ color: "var(--idp-text-soft)" }}>
                      {version.author} · {version.createdAt}
                    </Typography>
                  </Stack>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<RestoreOutlinedIcon />}
                    onClick={() => onRestore(version.id)}
                    sx={{
                      borderColor: "rgba(56, 189, 248, 0.55)",
                      color: "#7dd3fc",
                      fontWeight: 700,
                      width: "fit-content",
                      "&:hover": {
                        borderColor: "#38bdf8",
                        backgroundColor: "rgba(56, 189, 248, 0.1)",
                      },
                    }}
                  >
                    복원
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
