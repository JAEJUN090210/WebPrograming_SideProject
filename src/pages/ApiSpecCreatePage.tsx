import { Button, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material"
import AddOutlinedIcon from "@mui/icons-material/AddOutlined"
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import SpecPageLayout from "../components/specs/SpecPageLayout"

type ApiSpecDraft = {
  name: string
  method: string
  path: string
  auth: string
  owner: string
  status: string
  description: string
  tags: string
}

const METHOD_OPTIONS = ["GET", "POST", "PUT", "PATCH", "DELETE"]
const STATUS_OPTIONS = ["Draft", "In Review", "Approved", "Deprecated"]
const OWNER_OPTIONS = ["Min Seo", "Jenna Park", "Avery Kim", "Riley Chen", "Morgan Yu", "Sam Patel"]
const AUTH_OPTIONS = ["None", "API Key", "OAuth2", "JWT"]

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

export default function ApiSpecCreatePage() {
  const navigate = useNavigate()
  const [draft, setDraft] = useState<ApiSpecDraft>({
    name: "",
    method: "",
    path: "",
    auth: "",
    owner: "",
    status: "Draft",
    description: "",
    tags: "",
  })
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const handleChange = (field: keyof ApiSpecDraft) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setDraft(current => ({ ...current, [field]: event.target.value }))
  }

  const missingFields = {
    name: draft.name.trim().length === 0,
    method: draft.method.trim().length === 0,
    path: draft.path.trim().length === 0,
    auth: draft.auth.trim().length === 0,
    owner: draft.owner.trim().length === 0,
    status: draft.status.trim().length === 0,
  }

  const isInvalid = Object.values(missingFields).some(Boolean)

  return (
    <SpecPageLayout
      eyebrow="IDP PLATFORM"
      title="API 명세서 작성"
      description="엔드포인트와 정책 정보를 정리해 공유하세요."
    >
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          p: { xs: 2.5, sm: 3 },
          border: "1px solid rgba(148, 163, 184, 0.2)",
          backgroundColor: "rgba(12, 18, 28, 0.88)",
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
            <Button
              variant="contained"
              startIcon={<AddOutlinedIcon />}
              onClick={() => setSubmitAttempted(true)}
              disabled={isInvalid}
              sx={{
                backgroundColor: "#22c55e",
                color: "#f8fafc",
                fontWeight: 700,
                textTransform: "none",
                "&:hover": { backgroundColor: "#16a34a" },
              }}
            >
              명세서 생성
            </Button>
          </Stack>

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
              <Typography variant="h6" sx={{ color: "#f8fafc", fontWeight: 700 }}>
                기본 정보
              </Typography>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <TextField
                  label="API 이름"
                  value={draft.name}
                  onChange={handleChange("name")}
                  fullWidth
                  error={submitAttempted && missingFields.name}
                  helperText={submitAttempted && missingFields.name ? "API 이름을 입력해 주세요" : ""}
                  sx={fieldSx}
                />
                <TextField
                  label="메서드"
                  value={draft.method}
                  onChange={handleChange("method")}
                  fullWidth
                  select
                  error={submitAttempted && missingFields.method}
                  helperText={submitAttempted && missingFields.method ? "메서드를 선택해 주세요" : ""}
                  sx={fieldSx}
                >
                  {METHOD_OPTIONS.map(option => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <TextField
                  label="경로"
                  value={draft.path}
                  onChange={handleChange("path")}
                  fullWidth
                  error={submitAttempted && missingFields.path}
                  helperText={submitAttempted && missingFields.path ? "경로를 입력해 주세요" : ""}
                  sx={fieldSx}
                />
                <TextField
                  label="인증 방식"
                  value={draft.auth}
                  onChange={handleChange("auth")}
                  fullWidth
                  select
                  error={submitAttempted && missingFields.auth}
                  helperText={submitAttempted && missingFields.auth ? "인증 방식을 선택해 주세요" : ""}
                  sx={fieldSx}
                >
                  {AUTH_OPTIONS.map(option => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <TextField
                  label="담당자"
                  value={draft.owner}
                  onChange={handleChange("owner")}
                  fullWidth
                  select
                  error={submitAttempted && missingFields.owner}
                  helperText={submitAttempted && missingFields.owner ? "담당자를 선택해 주세요" : ""}
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
                  value={draft.status}
                  onChange={handleChange("status")}
                  fullWidth
                  select
                  error={submitAttempted && missingFields.status}
                  helperText={submitAttempted && missingFields.status ? "상태를 선택해 주세요" : ""}
                  sx={fieldSx}
                >
                  {STATUS_OPTIONS.map(option => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
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
              <Typography variant="h6" sx={{ color: "#f8fafc", fontWeight: 700 }}>
                상세 내용
              </Typography>
              <TextField
                label="요약"
                value={draft.description}
                onChange={handleChange("description")}
                fullWidth
                multiline
                minRows={4}
                sx={fieldSx}
              />
              <TextField
                label="태그 (쉼표로 구분)"
                value={draft.tags}
                onChange={handleChange("tags")}
                fullWidth
                sx={fieldSx}
              />
            </Stack>
          </Paper>
        </Stack>
      </Paper>
    </SpecPageLayout>
  )
}
