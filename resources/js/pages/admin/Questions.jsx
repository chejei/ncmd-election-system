import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import axios from "../../api/axios";
import Swal from "sweetalert2";

export default function Questions() {
    const [questions, setQuestions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);

    const fetchQuestions = (page = 1, search = "") => {
        setQuestions([]);
        axios
            .get(`/api/questions?page=${page}&search=${search}`)
            .then((response) => {
                setQuestions(response.data.data);
                setCurrentPage(response.data.current_page);
                setTotalPages(response.data.last_page);
            })
            .catch((error) =>
                console.error("Error fetching questions:", error)
            );
    };

    useEffect(() => {
        fetchQuestions(currentPage, searchTerm);
    }, [currentPage, searchTerm]);

    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This question will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e7000b",
            cancelButtonColor: "#2b7fff",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`/api/questions/${id}`);
                    fetchQuestions(1, searchTerm);
                    setCurrentPage(1);

                    Swal.fire({
                        title: "Deleted!",
                        text: "Question has been deleted.",
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
                "Please select at least one question.",
                "info"
            );
            return;
        }

        Swal.fire({
            title: "Are you sure?",
            text: `Delete ${selectedIds.length} question(s)?`,
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
                            axios.delete(`/api/questions/${id}`)
                        )
                    );
                    fetchQuestions(1, searchTerm);
                    setCurrentPage(1);
                    setSelectedIds([]);

                    Swal.fire({
                        title: "Deleted!",
                        text: "Selected questions have been deleted.",
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

    const handleToggleEnable = async (item, newValue) => {
        const actionText = newValue ? "Enable" : "Disable";

        // Show confirmation first
        const result = await Swal.fire({
            title: `Are you sure?`,
            text: `Do you want to ${actionText.toLowerCase()} this question?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: `Yes, ${actionText}`,
            cancelButtonText: "Cancel",
        });

        if (!result.isConfirmed) return; // Stop if user cancels

        try {
            await axios.put(`/api/questions/${item.id}`, {
                question_text: item.question_text,
                enable: newValue,
            });

            setQuestions((prev) =>
                prev.map((q) =>
                    q.id === item.id ? { ...q, enable: newValue } : q
                )
            ); // ✅ Update UI

            Swal.fire({
                icon: "success",
                title: `${actionText}d!`,
                text: `The question has been ${actionText.toLowerCase()}d.`,
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Failed!",
                text: "Something went wrong while updating. Please try again.",
            });
            console.error("Failed to update:", err);
        }
    };
    const tableHeaders = {
        question_text: "Question",
        enable: "Enable",
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
                    name="question"
                    items={questions}
                    header={tableHeaders}
                    tableName="Question"
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    onSearchChange={setSearchTerm}
                    onDelete={handleDelete}
                    selectedIds={selectedIds}
                    onToggleSelect={toggleSelect}
                    onDeleteSelected={handleDeleteSelected}
                    link="/admin/candidate/questions"
                    actions={actions}
                    onToggleEnable={handleToggleEnable}
                    bulkActions={bulkActions}
                />
            </div>
        </div>
    );
}
