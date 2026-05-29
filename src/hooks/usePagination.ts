import { useMemo, useState } from "react"

type PaginationResult<T> = {
  page: number
  setPage: (page: number) => void
  pageCount: number
  pageItems: T[]
  pageSize: number
}

export default function usePagination<T>(items: T[], pageSize: number): PaginationResult<T> {
  const [page, setPage] = useState(1)
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize))
  const resolvedPage = Math.min(page, pageCount)

  const pageItems = useMemo(() => {
    const start = (resolvedPage - 1) * pageSize
    return items.slice(start, start + pageSize)
  }, [items, resolvedPage, pageSize])

  return { page: resolvedPage, setPage, pageCount, pageItems, pageSize }
}
