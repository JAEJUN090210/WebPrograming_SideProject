import { TextField } from "@mui/material"
import { fieldSx } from "../formStyles"

type TextListFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  helperText?: string
}

export default function TextListField({ label, value, onChange, helperText }: TextListFieldProps) {
  return (
    <TextField
      label={label}
      value={value}
      onChange={event => onChange(event.target.value)}
      helperText={helperText ?? "쉼표로 여러 값을 구분합니다."}
      fullWidth
      sx={fieldSx}
    />
  )
}
