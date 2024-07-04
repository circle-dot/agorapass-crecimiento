// components/data-table-pagination.tsx

import React from "react";

interface DataTablePaginationProps {
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  totalPages: number;
}

export function DataTablePagination({
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  totalPages,
}: DataTablePaginationProps) {
  return (
    <div className="flex items-center justify-between p-4">
      {/* <select
        value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
        className="border p-1 rounded"
      >
        {[10, 20, 50, 100].map(size => (
          <option key={size} value={size}>{size} per page</option>
        ))}
      </select> */}
      <div className="flex items-center space-x-2">
        <button
          disabled={page === 0}
          onClick={() => onPageChange(page - 1)}
          className="border p-1 rounded"
        >
          Previous
        </button>
        <span>Page {page + 1} of {totalPages}</span>
        <button
          disabled={page >= totalPages - 1}
          onClick={() => onPageChange(page + 1)}
          className="border p-1 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
