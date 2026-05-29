import { Button, Chip, Divider, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material"
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined"
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined"
import { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import SpecPageLayout from "../components/specs/SpecPageLayout"
import apiSpecsData from "../data/apiSpecs.json"
import type { ApiSpec } from "../types/specs"

type EditableApiSpec = {
  name: string
  description: string
  method: string
  path: string
  auth: string
  owner: string
  status: string
  tags: string
}

const STATUS_OPTIONS = ["Draft", "In Review", "Approved", "Deprecated"]
const OWNER_OPTIONS = ["Min Seo", "Jenna Park", "Avery Kim", "Riley Chen", "Morgan Yu", "Sam Patel"]

const fieldSx = {
  "& .MuiInputBase-input": { color: "#f8fafc" },
  "& .MuiInputBase-input::placeholder": { color: "rgba(226, 232, 240, 0.6)", opacity: 1 },
  "& .MuiInputLabel-root": { color: "rgba(226, 232, 240, 0.7)" },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    borderRadius: 2,
    "& fieldset": { borderColor: "rgba(148, 163, 184, 0.35)" },
    "&:hover fieldset": { borderColor: "rgba(56, 189, 248, 0.6)" },
    "&.Mui-focused fieldset": { borderColor: "#38bdf8" },
  },
  "& .MuiFormHelperText-root": { color: "rgba(148, 163, 184, 0.8)" },
}

export default function ApiSpecDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const specs = apiSpecsData as ApiSpec[]
  const spec = useMemo(() => specs.find(item => item.id === id), [id, specs])

  const [form, setForm] = useState<EditableApiSpec>(() => ({
    name: spec?.name ?? "",
    description: spec?.description ?? "",
    method: spec?.method ?? "",
    path: spec?.path ?? "",
    auth: spec?.auth ?? "",
    owner: spec?.owner ?? "",
    status: spec?.status ?? "",
    tags: spec?.tags.join(", ") ?? "",
  }))

  const handleChange = (field: keyof EditableApiSpec) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm(current => ({ ...current, [field]: event.target.value }))
  }

  return (
    <SpecPageLayout
      eyebrow="IDP PLATFORM"
      title="API 명세서 상세"
      description="API 정보를 확인하고 바로 수정할 수 있습니다."
    >
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          p: { xs: 2.5, sm: 3 },
          border: "1px solid rgba(148, 163, 184, 0.2)",
          backgroundColor: "rgba(12, 18, 28, 0.9)",
          color: "#e2e8f0",
        }}
      >
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
              sx={{
                color: "rgba(226, 232, 240, 0.9)",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { backgroundColor: "rgba(148, 163, 184, 0.12)" },
              }}
            >
              뒤로가기
            </Button>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <Chip
                label={form.status || "상태 미설정"}
                sx={{
                  borderRadius: 999,
                  backgroundColor: "rgba(30, 41, 59, 0.6)",
                  color: "#f8fafc",
                  fontWeight: 600,
                }}
              />
              <Button
                variant="contained"
                startIcon={<SaveOutlinedIcon />}
                sx={{
                  backgroundColor: "#22c55e",
                  color: "#f8fafc",
                  fontWeight: 700,
                  textTransform: "none",
                  "&:hover": { backgroundColor: "#16a34a" },
                }}
              >
                저장
              </Button>
            </Stack>
          </Stack>
          <Stack spacing={1}>
            <Typography variant="overline" sx={{ color: "rgba(148, 163, 184, 0.8)" }}>
              {spec?.id ?? "UNKNOWN"}
            </Typography>
            <TextField
              variant="standard"
              placeholder="API 이름"
              value={form.name}
              onChange={handleChange("name")}
              slotProps={{
                input: {
                  sx: { fontSize: 28, fontWeight: 700, color: "#f8fafc" },
                },
              }}
              sx={{
                "& .MuiInputBase-input": { color: "#f8fafc" },
                "& .MuiInputBase-input::placeholder": {
                  color: "rgba(226, 232, 240, 0.55)",
                  opacity: 1,
                },
              }}
            />
          </Stack>

          <Divider sx={{ borderColor: "rgba(148, 163, 184, 0.3)" }} />

          <Paper
            elevation={0}
            sx={{
              borderRadius: 2.5,
              p: { xs: 2, sm: 2.5 },
              border: "1px solid rgba(148, 163, 184, 0.2)",
              backgroundColor: "rgba(15, 23, 42, 0.55)",
            }}
          >
            <Stack spacing={1}>
              <Typography variant="subtitle2" sx={{ color: "#e2e8f0", fontWeight: 700 }}>
                요약
              </Typography>
              <TextField
                placeholder="요약을 입력하세요"
                value={form.description}
                onChange={handleChange("description")}
                multiline
                minRows={4}
                fullWidth
                sx={fieldSx}
              />
            </Stack>
          </Paper>

          <Divider sx={{ borderColor: "rgba(148, 163, 184, 0.3)" }} />

          <Paper
            elevation={0}
            sx={{
              borderRadius: 2.5,
              p: { xs: 2, sm: 2.5 },
              border: "1px solid rgba(148, 163, 184, 0.2)",
              backgroundColor: "rgba(15, 23, 42, 0.55)",
            }}
          >
            <Stack spacing={2}>
              <Typography variant="subtitle2" sx={{ color: "#e2e8f0", fontWeight: 700 }}>
                엔드포인트
              </Typography>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <TextField
                  label="메서드"
                  value={form.method}
                  onChange={handleChange("method")}
                  fullWidth
                  variant="outlined"
                  sx={fieldSx}
                />
                <TextField
                  label="경로"
                  value={form.path}
                  onChange={handleChange("path")}
                  fullWidth
                  variant="outlined"
                  sx={fieldSx}
                />
              </Stack>
            </Stack>
          </Paper>

          <Divider sx={{ borderColor: "rgba(148, 163, 184, 0.3)" }} />

          <Paper
            elevation={0}
            sx={{
              borderRadius: 2.5,
              p: { xs: 2, sm: 2.5 },
              border: "1px solid rgba(148, 163, 184, 0.2)",
              backgroundColor: "rgba(15, 23, 42, 0.55)",
            }}
          >
            <Stack spacing={2}>
              <Typography variant="subtitle2" sx={{ color: "#e2e8f0", fontWeight: 700 }}>
                정책 및 상태
              </Typography>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <TextField
                  label="인증 방식"
                  value={form.auth}
                  onChange={handleChange("auth")}
                  fullWidth
                  variant="outlined"
                  sx={fieldSx}
                />
                <TextField
                  label="상태"
                  value={form.status}
                  onChange={handleChange("status")}
                  fullWidth
                  variant="outlined"
                  select
                  sx={fieldSx}
                >
                  {STATUS_OPTIONS.map(option => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <TextField
                  label="담당자"
                  value={form.owner}
                  onChange={handleChange("owner")}
                  fullWidth
                  variant="outlined"
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
                  label="태그"
                  value={form.tags}
                  onChange={handleChange("tags")}
                  fullWidth
                  helperText="쉼표로 구분해 주세요"
                  sx={fieldSx}
                />
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </Paper>
    </SpecPageLayout>
  )
}
