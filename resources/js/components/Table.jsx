import React from "react";
import { Link } from "react-router-dom";
import {
    SearchIcon,
    ViewIcon,
    EditIcon,
    DeleteIcon,
    CheckIcon,
    CloseIcon,
} from "../assets/icons/icon";

export default function Table({
    name,
    items,
    header,
    tableName,
    currentPage,
    totalPages,
    onPageChange,
    onSearchChange,
    onDelete,
    selectedIds,
    onToggleSelect,
    onDeleteSelected,
    link,
    actions,
    onToggleEnable,
    onStatusChange,
    bulkActions,
    handleBulkAction,
    filters,
    onFilterChange,
}) {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    return (
        <>
            <div className="flex flex-column items-center justify-between pb-4">
                <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 ">
                    <label htmlFor="table-search" className="sr-only">
                        Search
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
                            <SearchIcon />
                        </div>
                        <input
                            type="text"
                            id="table-search"
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                            placeholder={`Search for ${tableName}`}
                        />
                    </div>

                    {/* Filters */}
                    {filters &&
                        filters.map((filter) => (
                            <div key={filter.name} className="ms-4">
                                <label
                                    htmlFor={filter.name}
                                    className="sr-only"
                                >
                                    {filter.label}
                                </label>
                                <select
                                    onChange={(e) =>
                                        onFilterChange(
                                            filter.name,
                                            e.target.value
                                        )
                                    }
                                    className="block p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {filter.options.map((opt) => (
                                        <option
                                            key={opt.value}
                                            value={opt.value}
                                        >
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}
                </div>

                <div className="flex flex-column justify-end">
                    {bulkActions?.add && (
                        <Link
                            to={`${link}/add`}
                            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 mx-1 rounded cursor-pointer"
                        >
                            Add
                        </Link>
                    )}
                    {bulkActions?.delete && (
                        <button
                            onClick={onDeleteSelected}
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 mx-1 rounded cursor-pointer"
                        >
                            {" "}
                            Delete{" "}
                        </button>
                    )}
                    {bulkActions?.approve && (
                        <button
                            className="bg-green-500  disabled:bg-gray-400 hover:bg-green-600 text-white px-2 py-1 mx-1 rounded cursor-pointer"
                            onClick={() => handleBulkAction("approve")}
                            disabled={selectedIds.length === 0}
                        >
                            Approve
                        </button>
                    )}
                    {bulkActions?.reject && (
                        <button
                            className="bg-red-500  disabled:bg-gray-400  hover:bg-red-600 text-white px-2 py-1 mx-1 rounded cursor-pointer"
                            onClick={() => handleBulkAction("reject")}
                            disabled={selectedIds.length === 0}
                        >
                            Reject
                        </button>
                    )}
                </div>
            </div>
            <table
                id={`${name}-tbl`}
                className="w-full text-sm text-left rtl:text-right text-gray-500 "
            >
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="p-4">
                            <div className="flex items-center">
                                <input
                                    id="checkbox-all-search"
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
                                    checked={
                                        items.length > 0 &&
                                        selectedIds.length === items.length
                                    }
                                    onChange={() => {
                                        if (
                                            selectedIds.length === items.length
                                        ) {
                                            selectedIds.forEach((id) =>
                                                onToggleSelect(id)
                                            ); // clear all
                                        } else {
                                            items.forEach((item) => {
                                                if (
                                                    !selectedIds.includes(
                                                        item.id
                                                    )
                                                )
                                                    onToggleSelect(item.id);
                                            });
                                        }
                                    }}
                                />
                                <label
                                    htmlFor="checkbox-all-search"
                                    className="sr-only"
                                >
                                    checkbox
                                </label>
                            </div>
                        </th>
                        {header &&
                            Object.entries(header).map(([key, label]) => (
                                <th key={key} className="px-6 py-3">
                                    {label}
                                </th>
                            ))}
                    </tr>
                </thead>
                <tbody>
                    {items && items.length > 0 ? (
                        items.map((item) => (
                            <tr
                                key={item.id}
                                className="bg-white border-b border-gray-200 hover:bg-gray-50"
                                onClick={(e) => {
                                    if (
                                        !e.target.closest("button") &&
                                        !e.target.closest("a")
                                    ) {
                                        onToggleSelect(item.id);
                                    }
                                }}
                            >
                                <td className="w-4 p-4">
                                    <div className="flex items-center">
                                        <input
                                            id={`checkbox-table-search-${item.id}`}
                                            type="checkbox"
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500"
                                            checked={selectedIds.includes(
                                                item.id
                                            )}
                                            onChange={() =>
                                                onToggleSelect(item.id)
                                            }
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <label
                                            htmlFor={`checkbox-table-search-${item.id}`}
                                            className="sr-only"
                                        >
                                            checkbox
                                        </label>
                                    </div>
                                </td>
                                {header &&
                                    Object.entries(header).map(([key]) => (
                                        <td key={key} className="px-6 py-4">
                                            {key === "photo" && item[key] ? (
                                                <img
                                                    src={`/storage/${item[key]}`}
                                                    alt="photo"
                                                    className="h-10 w-10 object-cover object-top rounded-full"
                                                />
                                            ) : key === "enable" ? (
                                                <div className="">
                                                    <input
                                                        type="checkbox"
                                                        className="toggle-switch"
                                                        id={`${item.id}-checkbox`}
                                                        checked={!!item[key]}
                                                        onChange={(e) =>
                                                            onToggleEnable(
                                                                item,
                                                                e.target.checked
                                                            )
                                                        }
                                                    />
                                                    <label
                                                        htmlFor={`${item.id}-checkbox`}
                                                    >
                                                        <span className="sw"></span>
                                                    </label>
                                                </div>
                                            ) : key === "action" ? (
                                                <div className="flex actions">
                                                    {actions?.view && (
                                                        <Link
                                                            to={`${link}/view/${item.id}`}
                                                            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 mx-1 rounded action action-view"
                                                            title="View"
                                                        >
                                                            <ViewIcon />
                                                        </Link>
                                                    )}
                                                    {!item.restrict && (
                                                        <>
                                                            {actions?.edit && (
                                                                <Link
                                                                    to={`${link}/edit/${item.id}`}
                                                                    className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 mx-1 rounded inline-block action action-edit"
                                                                    title="Edit"
                                                                >
                                                                    <EditIcon />
                                                                </Link>
                                                            )}
                                                            {actions?.delete && (
                                                                <button
                                                                    onClick={() =>
                                                                        onDelete(
                                                                            item.id
                                                                        )
                                                                    }
                                                                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 mx-1 rounded action action-delete"
                                                                    title="Delete"
                                                                >
                                                                    <DeleteIcon />
                                                                </button>
                                                            )}
                                                        </>
                                                    )}
                                                    {actions?.approve && (
                                                        <button
                                                            onClick={() =>
                                                                onStatusChange(
                                                                    item.id,
                                                                    "approve"
                                                                )
                                                            }
                                                            className="bg-green-500 hover:bg-green-600 text-white px-1 py-1 mx-1 rounded action action-approve cursor-pointer"
                                                            title="Approve"
                                                        >
                                                            <CheckIcon />
                                                        </button>
                                                    )}
                                                    {actions?.reject && (
                                                        <button
                                                            onClick={() =>
                                                                onStatusChange(
                                                                    item.id,
                                                                    "reject"
                                                                )
                                                            }
                                                            className="bg-red-500 hover:bg-red-600 text-white px-1 py-1 mx-1 rounded action action-reject cursor-pointer"
                                                            title="Reject"
                                                        >
                                                            <CloseIcon />
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                item[key] ?? ""
                                            )}
                                        </td>
                                    ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={
                                    header ? Object.keys(header).length + 1 : 1
                                }
                                className="border border-gray-100 px-6 py-10 text-center text-gray-500"
                            >
                                No data available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <nav aria-label="Page navigation" className="pt-6">
                <ul className="inline-flex -space-x-px text-sm">
                    <li>
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700"
                        >
                            Previous
                        </button>
                    </li>
                    {pages.map((page) => (
                        <li key={page}>
                            <button
                                onClick={() => onPageChange(page)}
                                className={`flex items-center justify-center px-3 h-8 border border-gray-300 hover:bg-blue-100 hover:text-blue-700  ${
                                    page === currentPage
                                        ? "text-blue-600 bg-blue-50"
                                        : "leading-tight text-gray-500 bg-white"
                                }`}
                            >
                                {page}
                            </button>
                        </li>
                    ))}
                    <li>
                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700"
                        >
                            Next
                        </button>
                    </li>
                </ul>
            </nav>
        </>
    );
}
