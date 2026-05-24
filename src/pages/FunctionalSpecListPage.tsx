import { Box, Button, Divider, Stack, TableCell, TableRow, Typography } from "@mui/material"
import AddOutlinedIcon from "@mui/icons-material/AddOutlined"
import { useEffect, useMemo, useState } from "react"
import SpecPageLayout from "../components/specs/SpecPageLayout"
import SpecToolbar, { type FilterOption } from "../components/specs/SpecToolbar"
import SpecTable from "../components/specs/SpecTable"
import SpecTitleCell from "../components/specs/SpecTitleCell"
import SpecOwnerCell from "../components/specs/SpecOwnerCell"
import SpecPagination from "../components/specs/SpecPagination"
import usePagination from "../hooks/usePagination"
import functionalSpecsData from "../data/functionalSpecs.json"
import type { FunctionalSpec } from "../types/specs"

const STATUS_OPTIONS: FilterOption[] = [
  { label: "All", value: "All" },
  { label: "Draft", value: "Draft" },
  { label: "In Review", value: "In Review" },
  { label: "Approved", value: "Approved" },
  { label: "Deprecated", value: "Deprecated" },
]

const PAGE_SIZE = 10

export default function FunctionalSpecListPage() {
  const specs = functionalSpecsData as FunctionalSpec[]
  const [searchValue, setSearchValue] = useState("")
  const [statusValue, setStatusValue] = useState("All")
  const [ownerValue, setOwnerValue] = useState("All")

  const ownerOptions = useMemo<FilterOption[]>(() => {
    const owners = Array.from(new Set(specs.map(spec => spec.owner))).sort()
    return [{ label: "All", value: "All" }, ...owners.map(owner => ({ label: owner, value: owner }))]
  }, [specs])

  const filteredSpecs = useMemo(() => {
    const query = searchValue.trim().toLowerCase()
    return specs.filter(spec => {
      const matchesStatus = statusValue === "All" || spec.status === statusValue
      const matchesOwner = ownerValue === "All" || spec.owner === ownerValue
      const matchesQuery =
        query.length === 0 ||
        [spec.title, spec.description, spec.owner, spec.category, spec.tags.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(query)

      return matchesStatus && matchesOwner && matchesQuery
    })
  }, [ownerValue, searchValue, specs, statusValue])

  const { page, setPage, pageCount, pageItems, pageSize } = usePagination(filteredSpecs, PAGE_SIZE)

  useEffect(() => {
    setPage(1)
  }, [searchValue, statusValue, ownerValue, setPage])

  return (
    <SpecPageLayout
      eyebrow="IDP PLATFORM"
      title="기능 명세서"
      description="기능 요구사항과 승인 상태를 한 곳에서 관리합니다."
    >
      <SpecToolbar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        statusValue={statusValue}
        onStatusChange={setStatusValue}
        ownerValue={ownerValue}
        onOwnerChange={setOwnerValue}
        statusOptions={STATUS_OPTIONS}
        ownerOptions={ownerOptions}
        primaryAction={
          <Button
            variant="contained"
            startIcon={<AddOutlinedIcon />}
            sx={{
              backgroundColor: "#22c55e",
              color: "#08150d",
              fontWeight: 700,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#16a34a",
              },
            }}
          >
            기능 명세서 추가
          </Button>
        }
      />

      <Box sx={{ mt: 2 }}>
        <SpecTable
          columns={[
            { key: "id", label: "ID", width: 120 },
            { key: "title", label: "명세서" },
            { key: "owner", label: "담당", width: 180 },
            { key: "status", label: "상태", width: 140 },
            { key: "action", label: "", width: 120 },
          ]}
        >
          {pageItems.map(spec => (
            <TableRow key={spec.id} hover sx={{ "& td": { borderBottomColor: "rgba(148, 163, 184, 0.2)" } }}>
              <TableCell sx={{ color: "rgba(226, 232, 240, 0.8)", fontWeight: 600 }}>{spec.id}</TableCell>
              <TableCell>
                <SpecTitleCell title={spec.title} tags={spec.tags} />
              </TableCell>
              <TableCell>
                <SpecOwnerCell owner={spec.owner} updatedAt={spec.updatedAt} />
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ color: "rgba(226, 232, 240, 0.86)", fontWeight: 600 }}>
                  {spec.status}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Button
                  variant="text"
                  size="small"
                  sx={{
                    color: "#38bdf8",
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: "rgba(56, 189, 248, 0.08)",
                    },
                  }}
                >
                  상세 보기
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </SpecTable>
      </Box>

      <Divider sx={{ borderColor: "rgba(148, 163, 184, 0.24)" }} />

      <SpecPagination
        page={page}
        pageCount={pageCount}
        pageSize={pageSize}
        totalCount={filteredSpecs.length}
        onChange={setPage}
      />

      {filteredSpecs.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <Typography variant="h6" sx={{ color: "#e2e8f0" }}>
            결과가 없습니다.
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(226, 232, 240, 0.7)" }}>
            필터를 초기화하거나 다른 키워드로 검색해 주세요.
          </Typography>
        </Box>
      ) : null}
    </SpecPageLayout>
  )
}
