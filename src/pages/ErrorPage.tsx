import { Box, Button, Stack, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { ERROR_STATUS_CODE, ERROR_STATUS_MESSAGE, type ErrorCode } from "../constant/errorPage"

type ErrorPageProps = {
  errorCode?: ErrorCode
}

export default function ErrorPage({ errorCode = ERROR_STATUS_CODE.NOT_FOUND }: ErrorPageProps) {
  const navigate = useNavigate()
  const resolvedCode = ERROR_STATUS_MESSAGE[errorCode] ? errorCode : ERROR_STATUS_CODE.NOT_FOUND
  const errorMessage = ERROR_STATUS_MESSAGE[resolvedCode]

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(900px 420px at 50% -15%, rgba(0, 239, 139, 0.18), transparent 65%), #090c11",
        px: 2,
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "4rem", sm: "6rem" },
            fontWeight: 800,
            letterSpacing: "0.02em",
            color: "#00EF8B",
            lineHeight: 1,
          }}
        >
          {resolvedCode}
        </Typography>

        <Typography
          variant="h4"
          sx={{
            mt: 1,
            fontWeight: 300,
            color: "rgba(240, 246, 252, 0.86)",
          }}
        >
          {errorMessage}
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 4, justifyContent: "center" }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/")}
            sx={{
              backgroundColor: "#00EF8B",
              color: "#0b1016",
              fontWeight: 700,
              "&:hover": {
                backgroundColor: "#00d37b",
              },
            }}
          >
            Go Home
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate(-1)}
            sx={{
              color: "#dce7f3",
              borderColor: "rgba(220, 231, 243, 0.4)",
              "&:hover": {
                borderColor: "#dce7f3",
                backgroundColor: "rgba(220, 231, 243, 0.08)",
              },
            }}
          >
            Go Back
          </Button>
        </Stack>
      </Box>
    </Box>
  )
}
