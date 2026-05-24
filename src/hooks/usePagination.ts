import { useEffect, useMemo, useState } from "react"

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

  useEffect(() => {
    setPage(current => Math.min(current, pageCount))
  }, [pageCount])

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize
    return items.slice(start, start + pageSize)
  }, [items, page, pageSize])

  return { page, setPage, pageCount, pageItems, pageSize }
}
