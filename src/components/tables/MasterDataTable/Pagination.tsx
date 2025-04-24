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
}) => {
    return (
        <div className="flex justify-between items-center mt-4">
            <div className="text-sm">Selected: {selectedRowCount}</div>

            <div className="text-sm">
                Page {pageIndex + 1} of {pageCount}
            </div>

            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    <span className="text-sm">Rows per page:</span>
                    <select
                        className="border rounded px-2 py-1 text-sm"
                        value={pageSize}
                        onChange={(e) => {
                            const selected = e.target.value;
                            const newSize = selected === "all" ? totalDataCount : Number(selected);
                            setPageSize(newSize);
                        }}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value="all">All</option>
                    </select>
                </div>

                <div className="space-x-2">
                    <button
                        onClick={previousPage}
                        disabled={!canPreviousPage}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Prev
                    </button>
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
