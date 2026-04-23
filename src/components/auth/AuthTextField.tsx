import { TextField } from "@mui/material"
import type { TextFieldProps } from "@mui/material"

export default function AuthTextField(props: TextFieldProps) {
  return (
    <TextField
      fullWidth
      variant="outlined"
      margin="normal"
      slotProps={{
        inputLabel: { shrink: true },
      }}
      sx={{
        "& .MuiInputLabel-root": {
          color: "rgba(240, 246, 252, 0.82)",
        },
        "& .MuiInputBase-input": {
          color: "#f0f6fc",
        },
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "rgba(240, 246, 252, 0.22)",
          },
          "&:hover fieldset": {
            borderColor: "rgba(0, 239, 139, 0.56)",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#00EF8B",
          },
        },
        "& .MuiFormHelperText-root": {
          color: "#ffb4ab",
        },
      }}
      {...props}
    />
  )
}
