import React from "react";

interface PaginationControlsProps {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  setPageSize: (size: number) => void;
  previousPage: () => void;
  nextPage: () => void;
  canPreviousPage: boolean;
  canNextPage: boolean;
  selectedRowCount: number;
  totalDataCount: number;
  gotoPage: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  pageIndex,
  pageSize,
  pageCount,
  setPageSize,
  previousPage,
  nextPage,
  canPreviousPage,
  canNextPage,
  selectedRowCount,
  totalDataCount,
  gotoPage,
}) => {
  const renderPageNumbers = () => {
    const pages = [];

    // Tambahkan halaman pertama
    pages.push(0);

    // Tambahkan halaman aktif
    if (pageIndex > 0 && pageIndex < pageCount - 1) {
      pages.push(pageIndex);
    }

    // Tambahkan halaman terakhir
    if (pageCount > 1) {
      pages.push(pageCount - 1);
    }

    return pages.map((page, i) =>
      typeof page === "number" ? (
        <button
          key={i}
          onClick={() => gotoPage(page)}
          className={`px-2 py-1 border rounded ${
            pageIndex === page ? "bg-blue-500 text-white" : ""
          }`}
        >
          {page + 1}
        </button>
      ) : (
        <span key={i} className="px-2 py-1">
          ...
        </span>
      )
    );
  };

  return (
    <div className="flex justify-between items-center mt-4">
      {selectedRowCount > 0 && (
        <div className="text-sm">Selected: {selectedRowCount}</div>
      )}

      <div className="text-sm">
        Page {pageIndex + 1} of {pageCount}
      </div>

      <div className="flex items-center space-x-4">
        <div className="space-x-2">
          <button
            onClick={previousPage}
            disabled={!canPreviousPage}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          {renderPageNumbers()}
          <button
            onClick={nextPage}
            disabled={!canNextPage}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaginationControls;
