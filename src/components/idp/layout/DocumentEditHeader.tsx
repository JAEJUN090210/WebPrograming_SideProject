import { Divider, Stack, TextField, Typography } from "@mui/material"

type DocumentEditHeaderProps = {
  id: string
  version: string
  updatedAt: string
  value: string
  onChange: (value: string) => void
}

export default function DocumentEditHeader({ id, version, updatedAt, value, onChange }: DocumentEditHeaderProps) {
  return (
    <>
      <Stack spacing={0.75}>
        <Typography variant="overline" sx={{ color: "var(--idp-text-soft)" }}>
          {id} · v{version} · {updatedAt}
        </Typography>
        <TextField
          variant="standard"
          value={value}
          onChange={event => onChange(event.target.value)}
          slotProps={{ input: { sx: { fontSize: 28, fontWeight: 800, color: "var(--idp-text)" } } }}
          sx={{ "& .MuiInputBase-input": { color: "var(--idp-text)" } }}
        />
      </Stack>
      <Divider sx={{ borderColor: "var(--idp-border)" }} />
    </>
  )
}
