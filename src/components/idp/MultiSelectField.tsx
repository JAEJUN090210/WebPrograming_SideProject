import { Checkbox, Chip, FormControl, InputLabel, MenuItem, Select, Stack } from "@mui/material"
import type { SelectChangeEvent } from "@mui/material/Select"

type MultiSelectOption = {
  label: string
  value: string
}

type MultiSelectFieldProps = {
  label: string
  value: string[]
  options: MultiSelectOption[]
  onChange: (value: string[]) => void
}

export default function MultiSelectField({ label, value, options, onChange }: MultiSelectFieldProps) {
  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const nextValue = event.target.value
    onChange(typeof nextValue === "string" ? nextValue.split(",") : nextValue)
  }

  return (
    <FormControl fullWidth>
      <InputLabel sx={{ color: "var(--idp-text-soft)" }}>{label}</InputLabel>
      <Select
        multiple
        value={value}
        label={label}
        onChange={handleChange}
        renderValue={selected => (
          <Stack direction="row" spacing={0.75} sx={{ flexWrap: "wrap", rowGap: 0.75 }}>
            {selected.map(id => {
              const option = options.find(item => item.value === id)
              return <Chip key={id} size="small" label={option?.label ?? id} />
            })}
          </Stack>
        )}
        sx={{
          color: "var(--idp-text)",
          backgroundColor: "var(--idp-field-bg)",
          borderRadius: 2,
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "var(--idp-border-strong)" },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "var(--idp-accent-blue)" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "var(--idp-accent-blue)" },
        }}
      >
        {options.map(option => (
          <MenuItem key={option.value} value={option.value}>
            <Checkbox checked={value.includes(option.value)} />
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
