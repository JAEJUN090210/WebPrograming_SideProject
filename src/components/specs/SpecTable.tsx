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
        border: "1px solid rgba(148, 163, 184, 0.2)",
        backgroundColor: "rgba(10, 15, 23, 0.9)",
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: "rgba(15, 23, 42, 0.8)" }}>
            {columns.map(column => (
              <TableCell
                key={column.key}
                align={column.align ?? "left"}
                sx={{
                  fontSize: 12,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "rgba(226, 232, 240, 0.72)",
                  borderBottomColor: "rgba(148, 163, 184, 0.24)",
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
