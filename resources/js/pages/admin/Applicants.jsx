import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import axios from "../../api/axios";
import Swal from "sweetalert2";

export default function Candidate() {
    const [candidates, setCandidates] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);

    const fetchCandidates = (page = 1, search = "") => {
        setCandidates([]);
        axios
            .get(`/api/candidates?page=${page}&search=${search}&status=pending`)
            .then((response) => {
                setCandidates(response.data.data);
                setCurrentPage(response.data.current_page);
                setTotalPages(response.data.last_page);
            })
            .catch((error) =>
                console.error("Error fetching candidates:", error)
            );
    };

    useEffect(() => {
        fetchCandidates(currentPage, searchTerm);
    }, [currentPage, searchTerm]);

    const toggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

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
                    await axios.delete(`/api/candidates/${id}`);
                    fetchCandidates(1, searchTerm);
                    setCurrentPage(1);

                    Swal.fire({
                        title: "Deleted!",
                        text: "Candidate has been deleted.",
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

    const handleDeleteSelected = () => {
        if (selectedIds.length === 0) {
            Swal.fire(
                "No Selection",
                "Please select at least one candidate.",
                "info"
            );
            return;
        }

        Swal.fire({
            title: "Are you sure?",
            text: `Delete ${selectedIds.length} candidate(s)?`,
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
                            axios.delete(`/api/candidates/${id}`)
                        )
                    );
                    fetchCandidates(1, searchTerm);
                    setCurrentPage(1);
                    setSelectedIds([]);

                    Swal.fire({
                        title: "Deleted!",
                        text: "Selected candidates have been deleted.",
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

    const handleStatusChange = async (id, action) => {
        const actionText = action === "approve" ? "Approve" : "Reject";
        const confirmColor = action === "approve" ? "#28a745" : "#e7000b";
        const actionUrl = `/api/candidates/${id}/${action}`;

        // Ask for confirmation first
        const result = await Swal.fire({
            title: `Are you sure?`,
            text: `Do you want to ${actionText.toLowerCase()} this candidate?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: `Yes, ${actionText}`,
            cancelButtonText: "Cancel",
            confirmButtonColor: confirmColor,
            cancelButtonColor: "#2b7fff",
        });

        if (!result.isConfirmed) return; // Stop if cancelled

        try {
            await axios.post(actionUrl);
            fetchCandidates(currentPage, searchTerm);

            Swal.fire({
                title: `${actionText}d!`,
                text: `Candidate has been ${actionText.toLowerCase()}d.`,
                icon: action === "approve" ? "success" : "info",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire(
                "Error!",
                `Something went wrong while trying to ${action} candidate.`,
                "error"
            );
        }
    };

    const handleBulkAction = (action) => {
        if (selectedIds.length === 0) {
            Swal.fire(
                "No Selection",
                "Please select at least one candidate.",
                "info"
            );
            return;
        }

        const actionText = action === "approve" ? "Approve" : "Reject";
        const confirmColor = action === "approve" ? "#28a745" : "#e7000b";

        Swal.fire({
            title: "Are you sure?",
            text: `${actionText} ${selectedIds.length} candidate(s)?`,
            icon: action === "approve" ? "question" : "warning",
            showCancelButton: true,
            confirmButtonColor: confirmColor,
            cancelButtonColor: "#2b7fff",
            confirmButtonText: `Yes, ${actionText.toLowerCase()} them!`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await Promise.all(
                        selectedIds.map((id) =>
                            axios.post(`/api/candidates/${id}/${action}`)
                        )
                    );

                    fetchCandidates(1, searchTerm);
                    setCurrentPage(1);
                    setSelectedIds([]);

                    Swal.fire({
                        title: `${actionText}d!`,
                        text: `Selected candidates have been ${actionText.toLowerCase()}d.`,
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                } catch (error) {
                    Swal.fire(
                        "Error!",
                        `Something went wrong while trying to ${actionText.toLowerCase()}.`,
                        "error"
                    );
                }
            }
        });
    };

    const bulkActions = {
        add: false,
        delete: false,
        approve: true,
        reject: true,
    };

    const actions = {
        approve: true,
        reject: true,
        view: true,
        delete: true,
    };
    const tableHeaders = {
        full_name: "Name",
        church_name: "Church",
        position_title: "Position",
        action: "Action",
    };
    return (
        <>
            <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md lg:col-span-2">
                <div className="bg-white relative overflow-x-auto">
                    <Table
                        name="applicants"
                        items={candidates}
                        header={tableHeaders}
                        tableName="Applicants"
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        onSearchChange={setSearchTerm}
                        onDelete={handleDelete}
                        selectedIds={selectedIds}
                        onToggleSelect={toggleSelect}
                        onDeleteSelected={handleDeleteSelected}
                        link="/admin/candidate"
                        actions={actions}
                        onStatusChange={handleStatusChange}
                        bulkActions={bulkActions}
                        handleBulkAction={handleBulkAction}
                    />
                </div>
            </div>
        </>
    );
}
