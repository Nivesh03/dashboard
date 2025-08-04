"use client";

import { useState, useMemo } from "react";
import { TableRow } from "@/lib/types";

export function useTablePagination(
  data: TableRow[],
  initialPageSize: number = 10
) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    // Reset to first page when page size changes
    setCurrentPage(1);
  };

  // Reset to first page when data changes (e.g., after filtering)
  const resetPagination = () => {
    setCurrentPage(1);
  };

  // Auto-adjust current page if it exceeds total pages
  useMemo(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return {
    paginatedData,
    currentPage,
    totalPages,
    pageSize,
    totalItems,
    handlePageChange,
    handlePageSizeChange,
    resetPagination,
  };
}
