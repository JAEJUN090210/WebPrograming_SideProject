import {
  Alert,
  Box,
  Button,
  Divider,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material"
import { useEffect, useState } from "react"
import { fieldSx, panelSx } from "../components/idp/formStyles"
import SpecPageLayout from "../components/specs/SpecPageLayout"
import useIdpStore from "../hooks/useIdpStore"
import { addAccount, getAccounts, removeAccount, type AccountSummary } from "../utils/authClient"

const ROLE_OPTIONS = ["개발", "기획", "디자인", "QA", "운영", "관리자"]

export default function AccountManagementPage() {
  const { addAuditEntry } = useIdpStore()
  const [accounts, setAccounts] = useState<AccountSummary[]>([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadAccounts() {
      try {
        const result = await getAccounts()
        if (isMounted) {
          setAccounts(result.accounts)
        }
      } catch (error) {
        if (isMounted) {
          setMessage({
            type: "error",
            text: error instanceof Error ? error.message : "계정 목록을 불러오지 못했습니다.",
          })
        }
      }
    }

    void loadAccounts()

    return () => {
      isMounted = false
    }
  }, [])

  const handleAddAccount = async () => {
    try {
      const result = await addAccount(username, password, name, role)
      setAccounts(result.accounts)
      setUsername("")
      setPassword("")
      setName("")
      setRole("")
      setMessage({ type: "success", text: "계정이 추가되었습니다." })
      addAuditEntry("계정 추가", "account", username, name, "프론트엔드 로컬 계정이 추가되었습니다.", {
        username,
        name,
        role,
      })
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "계정을 추가하지 못했습니다." })
    }
  }

  const handleRemove = async (targetUsername: string) => {
    try {
      const result = await removeAccount(targetUsername)
      setAccounts(result.accounts)
      setMessage({ type: "success", text: "계정이 삭제되었습니다." })
      addAuditEntry("계정 삭제", "account", targetUsername, targetUsername, "프론트엔드 로컬 계정이 삭제되었습니다.", {
        username: targetUsername,
      })
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "계정을 삭제하지 못했습니다." })
    }
  }

  return (
    <SpecPageLayout eyebrow="IDP PLATFORM" title="계정 관리">
      <Stack spacing={3}>
        <Paper
          variant="outlined"
          sx={{
            ...panelSx,
            px: { xs: 2, sm: 3 },
            py: { xs: 2, sm: 3 },
          }}
        >
          <Stack spacing={2}>
            <Typography variant="h6" sx={{ color: "var(--idp-text)", fontWeight: 700 }}>
              새 계정 추가
            </Typography>
            {message ? (
              <Alert
                severity={message.type}
                sx={{
                  backgroundColor: message.type === "success" ? "rgba(16, 185, 129, 0.16)" : "rgba(220, 38, 38, 0.15)",
                  color: message.type === "success" ? "#a7f3d0" : "#fecaca",
                }}
              >
                {message.text}
              </Alert>
            ) : null}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="아이디"
                value={username}
                onChange={event => setUsername(event.target.value)}
                fullWidth
                sx={fieldSx}
              />
              <TextField
                label="이름"
                value={name}
                onChange={event => setName(event.target.value)}
                fullWidth
                sx={fieldSx}
              />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="비밀번호"
                type="password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                fullWidth
                sx={fieldSx}
              />
              <TextField
                label="직군"
                value={role}
                onChange={event => setRole(event.target.value)}
                fullWidth
                select
                sx={fieldSx}
              >
                {ROLE_OPTIONS.map(option => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                variant="contained"
                onClick={handleAddAccount}
                sx={{
                  backgroundColor: "#00EF8B",
                  color: "#0b1016",
                  fontWeight: 700,
                  textTransform: "none",
                  whiteSpace: "nowrap",
                  "&:hover": { backgroundColor: "#00d37b" },
                }}
              >
                추가
              </Button>
            </Stack>
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={panelSx}>
          <Box sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
            <Typography variant="h6" sx={{ color: "var(--idp-text)", fontWeight: 700 }}>
              계정 목록
            </Typography>
          </Box>
          <Divider sx={{ borderColor: "var(--idp-border)" }} />
          <Table sx={{ "& td, & th": { borderColor: "var(--idp-border)" } }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "var(--idp-text-muted)" }}>아이디</TableCell>
                <TableCell sx={{ color: "var(--idp-text-muted)" }}>이름</TableCell>
                <TableCell sx={{ color: "var(--idp-text-muted)" }}>직군</TableCell>
                <TableCell sx={{ color: "var(--idp-text-muted)" }}>등록일</TableCell>
                <TableCell align="right" sx={{ color: "var(--idp-text-muted)" }}>
                  관리
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts.map(account => (
                <TableRow key={account.username}>
                  <TableCell sx={{ color: "var(--idp-text)", fontWeight: 600 }}>{account.username}</TableCell>
                  <TableCell sx={{ color: "var(--idp-text-muted)" }}>{account.name}</TableCell>
                  <TableCell sx={{ color: "var(--idp-text-muted)" }}>{account.role}</TableCell>
                  <TableCell sx={{ color: "var(--idp-text-muted)" }}>
                    {new Date(account.createdAt).toLocaleDateString("ko-KR")}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="text"
                      disabled={account.username === "admin"}
                      onClick={() => handleRemove(account.username)}
                      sx={{
                        color: account.username === "admin" ? "var(--idp-text-soft)" : "#fca5a5",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: account.username === "admin" ? "transparent" : "rgba(248, 113, 113, 0.12)",
                        },
                      }}
                    >
                      삭제
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Stack>
    </SpecPageLayout>
  )
}
