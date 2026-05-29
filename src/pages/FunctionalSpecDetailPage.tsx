import { Button, Chip, Divider, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material"
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined"
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined"
import { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import SpecPageLayout from "../components/specs/SpecPageLayout"
import functionalSpecsData from "../data/functionalSpecs.json"
import type { FunctionalSpec } from "../types/specs"

type EditableSpec = {
  title: string
  description: string
  category: string
  priority: string
  owner: string
  status: string
  tags: string
}

const CATEGORY_OPTIONS = ["Onboarding", "Design Ops", "Governance", "Platform", "Analytics", "Security"]
const PRIORITY_OPTIONS = ["Low", "Medium", "High", "Critical"]
const STATUS_OPTIONS = ["Draft", "In Review", "Approved", "Deprecated"]
const OWNER_OPTIONS = ["Jenna Park", "Avery Kim", "Riley Chen", "Jordan Lee", "Morgan Yu", "Sam Patel"]

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

export default function FunctionalSpecDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const specs = functionalSpecsData as FunctionalSpec[]
  const spec = useMemo(() => specs.find(item => item.id === id), [id, specs])
  const initialCategory = spec?.category ?? ""
  const isCategoryPreset = CATEGORY_OPTIONS.includes(initialCategory)
  const [categoryMode, setCategoryMode] = useState<"preset" | "custom">(isCategoryPreset ? "preset" : "custom")
  const [customCategory, setCustomCategory] = useState(isCategoryPreset ? "" : initialCategory)

  const [form, setForm] = useState<EditableSpec>(() => ({
    title: spec?.title ?? "",
    description: spec?.description ?? "",
    category: spec?.category ?? "",
    priority: spec?.priority ?? "",
    owner: spec?.owner ?? "",
    status: spec?.status ?? "",
    tags: spec?.tags.join(", ") ?? "",
  }))

  const handleChange = (field: keyof EditableSpec) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm(current => ({ ...current, [field]: event.target.value }))
  }

  return (
    <SpecPageLayout
      eyebrow="IDP PLATFORM"
      title="기능 명세서 상세"
      description="세부 내용을 확인하고 바로 수정할 수 있습니다."
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
              placeholder="제목"
              value={form.title}
              onChange={handleChange("title")}
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
                메타 정보
              </Typography>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <TextField
                  label="카테고리"
                  value={categoryMode === "custom" ? "custom" : form.category}
                  onChange={event => {
                    const value = event.target.value
                    if (value === "custom") {
                      setCategoryMode("custom")
                      setForm(current => ({ ...current, category: customCategory }))
                    } else {
                      setCategoryMode("preset")
                      setForm(current => ({ ...current, category: value }))
                    }
                  }}
                  fullWidth
                  variant="outlined"
                  select
                  sx={fieldSx}
                >
                  {CATEGORY_OPTIONS.map(option => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                  <MenuItem value="custom">직접 입력</MenuItem>
                </TextField>
                {categoryMode === "custom" ? (
                  <TextField
                    label="카테고리 직접 입력"
                    value={customCategory}
                    onChange={event => {
                      const value = event.target.value
                      setCustomCategory(value)
                      setForm(current => ({ ...current, category: value }))
                    }}
                    fullWidth
                    variant="outlined"
                    sx={fieldSx}
                  />
                ) : null}
                <TextField
                  label="우선순위"
                  value={form.priority}
                  onChange={handleChange("priority")}
                  fullWidth
                  variant="outlined"
                  select
                  sx={fieldSx}
                >
                  {PRIORITY_OPTIONS.map(option => (
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
              <TextField
                label="태그"
                value={form.tags}
                onChange={handleChange("tags")}
                fullWidth
                helperText="쉼표로 구분해 주세요"
                sx={fieldSx}
              />
            </Stack>
          </Paper>
        </Stack>
      </Paper>
    </SpecPageLayout>
  )
}
