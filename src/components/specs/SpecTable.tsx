import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import type { ReactNode } from "react"

type SpecTableColumn = {
  key: string
  label: string
  width?: number
  align?: "left" | "center" | "right"
}

type SpecTableProps = {
  columns: SpecTableColumn[]
  children: ReactNode
}

export default function SpecTable({ columns, children }: SpecTableProps) {
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid var(--idp-border)",
        backgroundColor: "var(--idp-surface)",
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: "var(--idp-surface-strong)" }}>
            {columns.map(column => (
              <TableCell
                key={column.key}
                align={column.align ?? "left"}
                sx={{
                  fontSize: 12,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--idp-text-soft)",
                  borderBottomColor: "var(--idp-border)",
                  width: column.width,
                  py: 1.5,
                  px: 2,
                }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody
          sx={{
            "& .MuiTableCell-root": {
              py: 2,
              px: 2,
            },
          }}
        >
          {children}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
