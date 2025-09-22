import React from "react";
import { Link } from "react-router-dom";
import {
    SearchIcon,
    ViewIcon,
    EditIcon,
    DeleteIcon,
} from "../assets/icons/icon";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function TableDrag({
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
    onDragEnd,
    actions,
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
                </div>
                <div className="flex flex-column justify-end">
                    <Link
                        to={`${link}/add`}
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 mx-1 rounded"
                    >
                        Add
                    </Link>
                    <button
                        onClick={onDeleteSelected}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 mx-1 rounded"
                    >
                        {" "}
                        Delete{" "}
                    </button>
                </div>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="table-body" direction="vertical">
                    {(provided) => (
                        <table
                            id={`${name}-tbl`}
                            className="w-full text-sm text-left rtl:text-right text-gray-500"
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
                                                    selectedIds.length ===
                                                        items.length
                                                }
                                                onChange={() => {
                                                    if (
                                                        selectedIds.length ===
                                                        items.length
                                                    ) {
                                                        selectedIds.forEach(
                                                            (id) =>
                                                                onToggleSelect(
                                                                    id
                                                                )
                                                        ); // clear all
                                                    } else {
                                                        items.forEach(
                                                            (item) => {
                                                                if (
                                                                    !selectedIds.includes(
                                                                        item.id
                                                                    )
                                                                )
                                                                    onToggleSelect(
                                                                        item.id
                                                                    );
                                                            }
                                                        );
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
                                        Object.entries(header).map(
                                            ([key, label]) => (
                                                <th
                                                    key={key}
                                                    className="px-6 py-3"
                                                >
                                                    {label}
                                                </th>
                                            )
                                        )}
                                </tr>
                            </thead>
                            <tbody
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {items &&
                                    items.map((item, index) => (
                                        <Draggable
                                            key={item.id}
                                            draggableId={item.id.toString()}
                                            index={index}
                                        >
                                            {(provided, snapshot) => (
                                                <tr
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`bg-white border-b border-gray-200 hover:bg-gray-50  
                                ${snapshot.isDragging ? "bg-blue-50" : ""}`}
                                                    onClick={(e) => {
                                                        if (
                                                            !e.target.closest(
                                                                "button"
                                                            ) &&
                                                            !e.target.closest(
                                                                "a"
                                                            )
                                                        ) {
                                                            onToggleSelect(
                                                                item.id
                                                            );
                                                        }
                                                    }}
                                                >
                                                    <td className="w-4 p-4">
                                                        <div className="flex items-center">
                                                            <input
                                                                id={`checkbox-table-search-${item.id}`}
                                                                type="checkbox"
                                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2 "
                                                                checked={selectedIds.includes(
                                                                    item.id
                                                                )}
                                                                onChange={() =>
                                                                    onToggleSelect(
                                                                        item.id
                                                                    )
                                                                }
                                                                onClick={(e) =>
                                                                    e.stopPropagation()
                                                                }
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
                                                        Object.entries(
                                                            header
                                                        ).map(([key]) => (
                                                            <td
                                                                key={key}
                                                                className="px-6 py-4"
                                                            >
                                                                {key ===
                                                                    "photo" &&
                                                                item[key] ? (
                                                                    <img
                                                                        src={`/storage/${item[key]}`}
                                                                        alt="photo"
                                                                        className="h-10 w-10 object-cover rounded-full"
                                                                    />
                                                                ) : key ===
                                                                  "action" ? (
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
                                                                    </div>
                                                                ) : (
                                                                    item[key] ??
                                                                    ""
                                                                )}
                                                            </td>
                                                        ))}
                                                </tr>
                                            )}
                                        </Draggable>
                                    ))}
                                {provided.placeholder}
                            </tbody>
                        </table>
                    )}
                </Droppable>
            </DragDropContext>
        </>
    );
}
