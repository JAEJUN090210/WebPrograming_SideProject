import { Button, Chip, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material"
import AddCommentOutlinedIcon from "@mui/icons-material/AddCommentOutlined"
import { useState } from "react"
import { fieldSx, panelSx } from "./formStyles"
import type { SpecComment } from "../../types/specs"

type CommentPanelProps = {
  comments: SpecComment[]
  onAdd: (message: string, kind: SpecComment["kind"]) => void
}

const KIND_LABELS: Record<SpecComment["kind"], string> = {
  comment: "댓글",
  review: "리뷰",
  "change-request": "수정 요청",
}

export default function CommentPanel({ comments, onAdd }: CommentPanelProps) {
  const [message, setMessage] = useState("")
  const [kind, setKind] = useState<SpecComment["kind"]>("comment")

  return (
    <Paper elevation={0} sx={panelSx}>
      <Stack spacing={2}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
          <Stack spacing={0.5}>
            <Typography variant="h6" sx={{ color: "var(--idp-text)", fontWeight: 700 }}>
              댓글 및 리뷰
            </Typography>
            <Typography variant="body2" sx={{ color: "var(--idp-text-muted)" }}>
              문서 단위 피드백과 수정 요청을 기록합니다.
            </Typography>
          </Stack>
          <Chip label={`${comments.length}개`} sx={{ width: "fit-content", color: "var(--idp-text-muted)" }} />
        </Stack>

        <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
          <TextField
            label="종류"
            value={kind}
            onChange={event => setKind(event.target.value as SpecComment["kind"])}
            select
            sx={{ ...fieldSx, minWidth: 150 }}
          >
            {Object.entries(KIND_LABELS).map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="의견"
            value={message}
            onChange={event => setMessage(event.target.value)}
            fullWidth
            sx={fieldSx}
          />
          <Button
            variant="contained"
            startIcon={<AddCommentOutlinedIcon />}
            onClick={() => {
              onAdd(message, kind)
              setMessage("")
            }}
            sx={{
              backgroundColor: "#22c55e",
              color: "#07120d",
              fontWeight: 800,
              whiteSpace: "nowrap",
              "&:hover": { backgroundColor: "#16a34a" },
            }}
          >
            등록
          </Button>
        </Stack>

        <Stack spacing={1.25}>
          {comments.length === 0 ? (
            <Typography variant="body2" sx={{ color: "var(--idp-text-soft)" }}>
              아직 등록된 댓글이 없습니다.
            </Typography>
          ) : (
            comments.map(comment => (
              <Paper
                key={comment.id}
                elevation={0}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: "rgba(2, 6, 23, 0.46)",
                  border: "1px solid var(--idp-border)",
                }}
              >
                <Stack spacing={0.75}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
                    <Chip size="small" label={KIND_LABELS[comment.kind]} />
                    <Typography variant="body2" sx={{ color: "var(--idp-text)", fontWeight: 700 }}>
                      {comment.author}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "var(--idp-text-soft)" }}>
                      {comment.role} · {comment.createdAt}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ color: "var(--idp-text-muted)" }}>
                    {comment.message}
                  </Typography>
                </Stack>
              </Paper>
            ))
          )}
        </Stack>
      </Stack>
    </Paper>
  )
}
