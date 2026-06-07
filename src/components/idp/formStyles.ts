export const fieldSx = {
  "& .MuiInputBase-input, & .MuiInputBase-textarea": { color: "var(--idp-text)" },
  "& .MuiInputBase-input::placeholder": { color: "var(--idp-text-soft)", opacity: 1 },
  "& .MuiInputLabel-root": { color: "var(--idp-text-soft)" },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "var(--idp-field-bg)",
    borderRadius: 2,
    "& fieldset": { borderColor: "var(--idp-border-strong)" },
    "&:hover fieldset": { borderColor: "var(--idp-accent-blue)" },
    "&.Mui-focused fieldset": { borderColor: "var(--idp-accent-blue)" },
  },
  "& .MuiFormHelperText-root": { color: "var(--idp-text-soft)" },
}

export const panelSx = {
  borderRadius: 2,
  p: { xs: 2, sm: 2.5 },
  border: "1px solid var(--idp-border)",
  backgroundColor: "var(--idp-surface)",
  color: "var(--idp-text)",
}

export const pageCardSx = {
  borderRadius: 3,
  p: { xs: 2.5, sm: 3 },
  border: "1px solid var(--idp-border)",
  backgroundColor: "var(--idp-surface)",
  color: "var(--idp-text)",
}
