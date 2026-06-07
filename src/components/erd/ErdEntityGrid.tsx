import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material"
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"
import { panelSx } from "../idp/formStyles"
import type { ErdEntity } from "../../types/specs"

type ErdEntityGridProps = {
  entities: ErdEntity[]
  onEdit: (entity: ErdEntity) => void
  onDelete: (entityId: string) => void
}

export default function ErdEntityGrid({ entities, onEdit, onDelete }: ErdEntityGridProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))", xl: "repeat(3, minmax(0, 1fr))" },
        gap: 2,
      }}
    >
      {entities.map(entity => (
        <Paper key={entity.id} elevation={0} sx={panelSx}>
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
              <Stack spacing={0.5}>
                <Typography variant="h6" sx={{ color: "var(--idp-text)", fontWeight: 800 }}>
                  {entity.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "var(--idp-text-muted)" }}>
                  {entity.description}
                </Typography>
              </Stack>
              <Chip label={`${entity.fields.length}개`} />
            </Stack>
            <Stack spacing={0.75}>
              {entity.fields.map(field => (
                <Stack
                  key={`${entity.id}-${field.name}`}
                  direction="row"
                  spacing={1}
                  sx={{ justifyContent: "space-between" }}
                >
                  <Typography variant="body2" sx={{ color: "var(--idp-text-muted)", fontWeight: 700 }}>
                    {field.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "var(--idp-text-muted)" }}>
                    {field.type} · {field.required ? "필수" : "선택"} · {field.note}
                  </Typography>
                </Stack>
              ))}
            </Stack>
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                startIcon={<EditOutlinedIcon />}
                onClick={() => onEdit(entity)}
                sx={{ color: "#7dd3fc", fontWeight: 700 }}
              >
                수정
              </Button>
              <Button
                size="small"
                startIcon={<DeleteOutlineOutlinedIcon />}
                onClick={() => onDelete(entity.id)}
                sx={{ color: "#fca5a5", fontWeight: 700 }}
              >
                삭제
              </Button>
            </Stack>
          </Stack>
        </Paper>
      ))}
    </Box>
  )
}
