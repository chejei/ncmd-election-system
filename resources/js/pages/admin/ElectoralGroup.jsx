import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import axios from "../../api/axios";
import Swal from "sweetalert2";

export default function ElectoralGroup() {
    const [electoralGroups, setElectoralGroups] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);

    const fetchElectoralGroups = (page = 1, search = "") => {
        setElectoralGroups([]);
        axios
            .get(`/api/electoral-groups?page=${page}&search=${search}`)
            .then((response) => {
                setElectoralGroups(response.data.data);
                setCurrentPage(response.data.current_page);
                setTotalPages(response.data.last_page);
            })
            .catch((error) =>
                console.error("Error fetching electoral groups:", error)
            );
    };

    useEffect(() => {
        fetchElectoralGroups(currentPage, searchTerm);
    }, [currentPage, searchTerm]);

    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this action!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e7000b",
            cancelButtonColor: "#2b7fff",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`/api/electoral-groups/${id}`);
                    fetchElectoralGroups(1, searchTerm);
                    setCurrentPage(1);

                    Swal.fire({
                        title: "Deleted!",
                        text: "Electoral group has been deleted.",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                } catch (error) {
                    Swal.fire(
                        "Error!",
                        "Something went wrong while deleting.",
                        "error"
                    );
                }
            }
        });
    };

    const toggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleDeleteSelected = () => {
        if (selectedIds.length === 0) {
            Swal.fire(
                "No Selection",
                "Please select at least one electoral group.",
                "info"
            );
            return;
        }

        Swal.fire({
            title: "Are you sure?",
            text: `Delete ${selectedIds.length} electoral group(s)?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e7000b",
            cancelButtonColor: "#2b7fff",
            confirmButtonText: "Yes, delete them!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await Promise.all(
                        selectedIds.map((id) =>
                            axios.delete(`/api/electoral-groups/${id}`)
                        )
                    );
                    fetchElectoralGroups(1, searchTerm);
                    setCurrentPage(1);
                    setSelectedIds([]);

                    Swal.fire({
                        title: "Deleted!",
                        text: "Selected electoral groups have been deleted.",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                } catch (error) {
                    Swal.fire(
                        "Error!",
                        "Something went wrong while deleting.",
                        "error"
                    );
                }
            }
        });
    };

    // Table headers based on electoral_groups table
    const tableHeaders = {
        name: "Name",
        action: "Action",
    };

    const bulkActions = {
        add: true,
        delete: true,
    };

    const actions = {
        view: false,
        edit: true,
        delete: true,
    };

    return (
        <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md lg:col-span-2">
            <div className="bg-white relative overflow-x-auto">
                <Table
                    name="electoral-group"
                    items={electoralGroups}
                    header={tableHeaders}
                    tableName="Electoral Group"
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    onSearchChange={setSearchTerm}
                    onDelete={handleDelete}
                    selectedIds={selectedIds}
                    onToggleSelect={toggleSelect}
                    onDeleteSelected={handleDeleteSelected}
                    link="/admin/candidate/electoral-group"
                    actions={actions}
                    bulkActions={bulkActions}
                />
            </div>
        </div>
    );
}
