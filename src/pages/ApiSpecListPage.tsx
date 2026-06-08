import { Box, Button, Divider, Stack, TableCell, TableRow, Typography } from "@mui/material"
import AddOutlinedIcon from "@mui/icons-material/AddOutlined"
import { useEffect, useMemo, useState } from "react"
import { Link as RouterLink } from "react-router-dom"
import SpecPageLayout from "../components/specs/SpecPageLayout"
import SpecToolbar, { type FilterOption } from "../components/specs/SpecToolbar"
import SpecTable from "../components/specs/SpecTable"
import SpecTitleCell from "../components/specs/SpecTitleCell"
import SpecOwnerCell from "../components/specs/SpecOwnerCell"
import SpecMethodPathCell from "../components/specs/SpecMethodPathCell"
import SpecPagination from "../components/specs/SpecPagination"
import SpecStatusChip from "../components/specs/SpecStatusChip"
import SpecSummary from "../components/specs/SpecSummary"
import usePagination from "../hooks/usePagination"
import useIdpStore from "../hooks/useIdpStore"
import { STATUS_LABELS, STATUS_OPTIONS } from "../data/idpOptions"

const PAGE_SIZE = 10

const statusOptions: FilterOption[] = [
  { label: "전체", value: "All" },
  ...STATUS_OPTIONS.map(status => ({ label: STATUS_LABELS[status], value: status })),
]

export default function ApiSpecListPage() {
  const { state, owners } = useIdpStore()
  const specs = state.apiSpecs
  const [searchValue, setSearchValue] = useState("")
  const [statusValue, setStatusValue] = useState("All")
  const [ownerValue, setOwnerValue] = useState("All")

  const ownerOptions = useMemo<FilterOption[]>(
    () => [{ label: "전체", value: "All" }, ...owners.map(owner => ({ label: owner, value: owner }))],
    [owners]
  )

  const filteredSpecs = useMemo(() => {
    const query = searchValue.trim().toLowerCase()
    return specs.filter(spec => {
      const matchesStatus = statusValue === "All" || spec.status === statusValue
      const matchesOwner = ownerValue === "All" || spec.owner === ownerValue
      const matchesQuery =
        query.length === 0 ||
        [spec.name, spec.description, spec.owner, spec.method, spec.path, spec.auth, spec.tags.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(query)

      return matchesStatus && matchesOwner && matchesQuery
    })
  }, [ownerValue, searchValue, specs, statusValue])

  const summaryItems = useMemo(
    () => [
      { label: "전체 API 명세", value: specs.length, helper: "엔드포인트와 요청/응답" },
      { label: "승인됨", value: specs.filter(spec => spec.status === "Approved").length, helper: "개발 기준으로 확정" },
      {
        label: "기능 연결",
        value: specs.reduce((total, spec) => total + spec.linkedFunctionalIds.length, 0),
        helper: "API와 연결된 기능 수",
      },
    ],
    [specs]
  )

  const { page, setPage, pageCount, pageItems, pageSize } = usePagination(filteredSpecs, PAGE_SIZE)

  useEffect(() => {
    setPage(1)
  }, [searchValue, statusValue, ownerValue, setPage])

  return (
    <SpecPageLayout eyebrow="IDP SERVICE" title="API 명세서 관리">
      <SpecSummary items={summaryItems} />

      <SpecToolbar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        statusValue={statusValue}
        onStatusChange={setStatusValue}
        ownerValue={ownerValue}
        onOwnerChange={setOwnerValue}
        statusOptions={statusOptions}
        ownerOptions={ownerOptions}
        primaryAction={
          <Button
            variant="contained"
            startIcon={<AddOutlinedIcon />}
            component={RouterLink}
            to="/specs/api/new"
            sx={{
              backgroundColor: "#22c55e",
              color: "#07120d",
              fontWeight: 800,
              textTransform: "none",
              "&:hover": { backgroundColor: "#16a34a" },
            }}
          >
            API 명세 작성
          </Button>
        }
      />

      <Box sx={{ mt: 2 }}>
        <SpecTable
          columns={[
            { key: "id", label: "ID", width: 120 },
            { key: "endpoint", label: "엔드포인트" },
            { key: "owner", label: "담당", width: 170 },
            { key: "links", label: "연결", width: 120 },
            { key: "status", label: "상태", width: 130 },
            { key: "action", label: "", width: 120 },
          ]}
        >
          {pageItems.map(spec => (
            <TableRow key={spec.id} hover sx={{ "& td": { borderBottomColor: "var(--idp-border)" } }}>
              <TableCell sx={{ color: "var(--idp-text-muted)", fontWeight: 700 }}>{spec.id}</TableCell>
              <TableCell>
                <Stack spacing={1}>
                  <SpecTitleCell title={spec.name} tags={spec.tags} />
                  <SpecMethodPathCell method={spec.method} path={spec.path} />
                  <Typography variant="caption" sx={{ color: "var(--idp-text-soft)" }}>
                    v{spec.version} · {spec.auth} · {spec.reviewState}
                  </Typography>
                </Stack>
              </TableCell>
              <TableCell>
                <SpecOwnerCell owner={spec.owner} updatedAt={spec.updatedAt} />
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ color: "#dbeafe", fontWeight: 700 }}>
                  기능 {spec.linkedFunctionalIds.length}
                </Typography>
                <Typography variant="caption" sx={{ color: "var(--idp-text-soft)" }}>
                  ERD {spec.linkedEntityIds.length}
                </Typography>
              </TableCell>
              <TableCell>
                <SpecStatusChip status={spec.status} />
              </TableCell>
              <TableCell align="right">
                <Button
                  variant="text"
                  size="small"
                  component={RouterLink}
                  to={`/specs/api/${spec.id}`}
                  sx={{
                    color: "#38bdf8",
                    textTransform: "none",
                    fontWeight: 700,
                    "&:hover": { backgroundColor: "rgba(56, 189, 248, 0.08)" },
                  }}
                >
                  상세 보기
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </SpecTable>
      </Box>

      <Divider sx={{ borderColor: "var(--idp-border)" }} />

      <SpecPagination
        page={page}
        pageCount={pageCount}
        pageSize={pageSize}
        totalCount={filteredSpecs.length}
        onChange={setPage}
      />
    </SpecPageLayout>
  )
}
