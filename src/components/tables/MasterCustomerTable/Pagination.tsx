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
    const maxVisiblePages = 4; // Jumlah maksimal halaman yang terlihat
    const pages = [];

    if (pageCount <= maxVisiblePages) {
      // Jika jumlah halaman lebih kecil atau sama dengan maxVisiblePages, tampilkan semua
      for (let i = 0; i < pageCount; i++) {
        pages.push(i);
      }
    } else {
      // Tambahkan halaman pertama
      pages.push(0);

      // Tambahkan halaman sebelum halaman aktif
      if (pageIndex > 2) {
        pages.push("...");
      }

      // Tambahkan halaman aktif dan sekitarnya
      const start = Math.max(1, pageIndex - 1);
      const end = Math.min(pageCount - 2, pageIndex + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Tambahkan halaman setelah halaman aktif
      if (pageIndex < pageCount - 3) {
        pages.push("...");
      }

      // Tambahkan halaman terakhir
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
      {/* <div className="text-sm">Selected: {selectedRowCount}</div> */}

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
