import { Alert, Button, Link as MuiLink, Stack } from "@mui/material"
import { Link } from "react-router-dom"
import AuthPageLayout from "../components/auth/AuthPageLayout"
import AuthTextField from "../components/auth/AuthTextField"
import useAuthForm from "../hooks/useAuthForm"
import { type LoginFormValues, validateLogin } from "../utils/authValidation"

export default function LoginPage() {
  const form = useAuthForm<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: validateLogin,
    onSubmit: async (values: LoginFormValues) => {
      // TODO: Replace with API integration.
      console.log("login submit", values)
    },
  })

  return (
    <AuthPageLayout
      title="Welcome Back"
      subtitle="Sign in to continue your session."
      footer={
        <Alert severity="info" sx={{ backgroundColor: "rgba(2, 8, 20, 0.72)", color: "#dce7f3" }}>
          Don&apos;t have an account?{" "}
          <MuiLink component={Link} to="/signup" underline="hover" color="#00EF8B">
            Create one
          </MuiLink>
        </Alert>
      }
    >
      <Stack component="form" onSubmit={form.handleSubmit} spacing={1}>
        <AuthTextField
          label="Email"
          name="email"
          type="email"
          value={form.values.email}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={Boolean(form.errors.email)}
          helperText={form.errors.email ?? " "}
        />
        <AuthTextField
          label="Password"
          name="password"
          type="password"
          value={form.values.password}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={Boolean(form.errors.password)}
          helperText={form.errors.password ?? " "}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={form.isSubmitting}
          sx={{
            mt: 1,
            backgroundColor: "#00EF8B",
            color: "#0b1016",
            fontWeight: 700,
            "&:hover": {
              backgroundColor: "#00d37b",
            },
          }}
        >
          {form.isSubmitting ? "Signing In..." : "Sign In"}
        </Button>
      </Stack>
    </AuthPageLayout>
  )
}
