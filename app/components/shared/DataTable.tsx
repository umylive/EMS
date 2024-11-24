"use client";

import { useState } from "react";

// ! INTERFACES
// Defines the structure for table columns with a key and display label
interface Column {
  key: string;
  label: string;
}

// ! Base interface for table data - requires an id field
interface TableData {
  id: number | string;
}

// ! Props interface for the DataTable component
// Generic type T extends TableData to ensure all data items have an id
interface DataTableProps<T extends TableData> {
  columns: Column[];
  data: T[];
  onRowClick?: (row: T) => void;
  rowsPerPage?: number;
}

// ! MAIN COMPONENT
// Generic DataTable component that accepts any data type extending TableData
export default function DataTable<T extends TableData>({
  columns,
  data,
  onRowClick,
  rowsPerPage = 10,
}: DataTableProps<T>) {
  // ! STATE MANAGEMENT
  // Controls for sorting, pagination, and search functionality
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // ! SORTING HANDLER
  // Manages column sorting logic - toggles order if same column, resets if new column
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  // ! CELL VALUE FORMATTER
  // Converts any cell value to a string representation, handling null/undefined
  const formatCellValue = (value: unknown): string => {
    if (value === undefined || value === null) return "";
    return String(value);
  };

  // ! DATA PROCESSING
  // Applies filtering and sorting to the data array
  const filteredAndSortedData = [...data]
    .filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (!sortKey) return 0;

      const aValue = String((a as Record<string, unknown>)[sortKey] ?? "");
      const bValue = String((b as Record<string, unknown>)[sortKey] ?? "");

      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

  // ! PAGINATION LOGIC
  // Calculates total pages and current page's data slice
  const totalPages = Math.ceil(filteredAndSortedData.length / rowsPerPage);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // ! PAGINATION HELPER
  // Generates array of visible page numbers with smart truncation
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  // ! COMPONENT RENDER
  return (
    <div className="space-y-4">
      {/* ! SEARCH AND INFO SECTION */}
      <div className="flex justify-between items-center">
        <div className="relative">
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 
                     rounded-md leading-5 bg-white dark:bg-gray-700 
                     text-gray-900 dark:text-white 
                     placeholder-gray-500 dark:placeholder-gray-400 
                     focus:outline-none focus:ring-1 focus:ring-primary-500 
                     focus:border-primary-500 sm:text-sm"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Total entries: {filteredAndSortedData.length}
        </div>
      </div>

      {/* ! MAIN TABLE SECTION */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          {/* ! TABLE HEADER */}
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => handleSort(column.key)}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 
                           uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {sortKey === column.key && (
                      <span className="ml-1">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          {/* ! TABLE BODY */}
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  className={`${
                    onRowClick ? "cursor-pointer" : ""
                  } hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300"
                    >
                      {formatCellValue(
                        (row as Record<string, unknown>)[column.key]
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ! PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                     text-sm font-medium text-gray-700 dark:text-gray-200 
                     bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <div className="flex space-x-2">
            {getPageNumbers().map((number) => (
              <button
                key={number}
                onClick={() => setCurrentPage(number)}
                className={`px-4 py-2 border text-sm font-medium rounded-md
                         ${
                           currentPage === number
                             ? "bg-primary-50 dark:bg-primary-900 border-primary-500 text-primary-600 dark:text-primary-200"
                             : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                         }`}
              >
                {number}
              </button>
            ))}
          </div>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                     text-sm font-medium text-gray-700 dark:text-gray-200 
                     bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
