import { Box, Button, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import { getAuthSession, login } from "../../utils/authClient"

type AuthState = "checking" | "authed" | "locked"

export default function PromptAuthGate() {
  const [authState, setAuthState] = useState<AuthState>("checking")

  const requestLogin = useCallback(async () => {
    let success = false

    while (!success) {
      const username = window.prompt("아이디를 입력하세요")
      if (username === null) {
        break
      }

      const password = window.prompt("비밀번호를 입력하세요")
      if (password === null) {
        break
      }

      try {
        await login(username, password)
        success = true
        setAuthState("authed")
        return
      } catch (error) {
        window.alert(error instanceof Error ? error.message : "아이디 또는 비밀번호가 올바르지 않습니다.")
      }
    }

    setAuthState("locked")
  }, [])

  useEffect(() => {
    let isMounted = true

    async function checkSession() {
      try {
        const session = await getAuthSession()
        if (!isMounted) {
          return
        }

        if (session.authenticated) {
          setAuthState("authed")
          return
        }

        await requestLogin()
      } catch {
        if (isMounted) {
          setAuthState("locked")
        }
      }
    }

    void checkSession()

    return () => {
      isMounted = false
    }
  }, [requestLogin])

  if (authState === "checking") {
    return null
  }

  if (authState === "locked") {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          background: "radial-gradient(900px 420px at 50% -15%, rgba(0, 239, 139, 0.18), transparent 65%), #090c11",
        }}
      >
        <Stack spacing={2} sx={{ textAlign: "center", maxWidth: 360 }}>
          <Typography variant="h5" sx={{ color: "#f0f6fc", fontWeight: 700 }}>
            로그인이 필요합니다
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(240, 246, 252, 0.72)" }}>
            계속하려면 아이디와 비밀번호를 입력해 주세요.
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              setAuthState("checking")
              void requestLogin()
            }}
            sx={{
              backgroundColor: "#00EF8B",
              color: "#0b1016",
              fontWeight: 700,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#00d37b",
              },
            }}
          >
            다시 로그인
          </Button>
        </Stack>
      </Box>
    )
  }

  return <Outlet />
}
