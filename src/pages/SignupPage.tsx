import { Alert, Button, Link as MuiLink, Stack } from "@mui/material"
import { Link } from "react-router-dom"
import AuthPageLayout from "../components/auth/AuthPageLayout"
import AuthTextField from "../components/auth/AuthTextField"
import useAuthForm from "../hooks/useAuthForm"
import { type SignupFormValues, validateSignup } from "../utils/authValidation"

export default function SignupPage() {
  const form = useAuthForm<SignupFormValues>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: validateSignup,
    onSubmit: async (values: SignupFormValues) => {
      // TODO: Replace with API integration.
      console.log("signup submit", values)
    },
  })

  return (
    <AuthPageLayout
      title="Create Account"
      subtitle="Start with a secure account in a few steps."
      footer={
        <Alert severity="info" sx={{ backgroundColor: "rgba(2, 8, 20, 0.72)", color: "#dce7f3" }}>
          Already have an account?{" "}
          <MuiLink component={Link} to="/login" underline="hover" color="#00EF8B">
            Sign in
          </MuiLink>
        </Alert>
      }
    >
      <Stack component="form" onSubmit={form.handleSubmit} spacing={1}>
        <AuthTextField
          label="Name"
          name="name"
          value={form.values.name}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={Boolean(form.errors.name)}
          helperText={form.errors.name ?? " "}
        />
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
        <AuthTextField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={form.values.confirmPassword}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={Boolean(form.errors.confirmPassword)}
          helperText={form.errors.confirmPassword ?? " "}
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
          {form.isSubmitting ? "Creating..." : "Create Account"}
        </Button>
      </Stack>
    </AuthPageLayout>
  )
}
