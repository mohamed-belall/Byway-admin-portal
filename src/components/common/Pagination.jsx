import React, { useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Pagination = ({ filters, setFilters, totalCount }) => {
  const totalPages = Math.ceil(totalCount / filters.pageSize);

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-4">
      {/* Previous */}
      <button
        onClick={() =>
          setFilters((prev) => ({ ...prev, pageIndex: prev.pageIndex - 1 }))
        }
        disabled={filters.pageIndex === 1}
        className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50"
      >
        <FiChevronLeft size={20} />
      </button>

      {/* Page numbers */}
      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => setFilters((prev) => ({ ...prev, pageIndex: page }))}
          className={`px-3 py-1 border rounded-lg ${
            filters.pageIndex === page
              ? "bg-blue-600 text-white border-blue-600"
              : "border-gray-300 hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() =>
          setFilters((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 }))
        }
        disabled={filters.pageIndex === totalPages}
        className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50"
      >
        <FiChevronRight size={20} />
      </button>
    </div>
  );
};

export default Pagination;
