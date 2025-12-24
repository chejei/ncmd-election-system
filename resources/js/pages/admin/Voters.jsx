import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import axios from "../../api/axios";
import Swal from "sweetalert2";

export default function Voters() {
    const [voters, setVoters] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);
    const [churches, setChurches] = useState([]);
    const [filterValues, setFilterValues] = useState({
        church: "",
    });

    const churchFilterOptions = [
        { label: "All Churches", value: "" },
        ...churches.map((c) => ({ label: c.name, value: c.id })),
    ];
    const fetchVoters = (page = 1, search = "", filters = {}) => {
        setVoters([]);
        let query = `?page=${page}&search=${search}`;
        Object.entries(filters).forEach(([key, val]) => {
            if (val) query += `&${key}=${val}`;
        });

        axios
            .get(`/api/voters${query}`)
            .then((response) => {
                setVoters(response.data.data);
                setCurrentPage(response.data.current_page);
                setTotalPages(response.data.last_page);
            })
            .catch((error) => console.error("Error fetching voters:", error));
    };

    useEffect(() => {
        axios.get("/api/churches").then((res) => {
            const filtered = res.data.map((church) => ({
                id: church.id,
                name: church.name,
            }));
            setChurches(filtered);
        });
    }, []);

    useEffect(() => {
        fetchVoters(currentPage, searchTerm, filterValues);
    }, [currentPage, searchTerm, filterValues]);

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
                    await axios.delete(`/api/voters/${id}`);
                    fetchVoters(1, searchTerm);
                    setCurrentPage(1);

                    Swal.fire({
                        title: "Deleted!",
                        text: "Voter has been deleted.",
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
                "Please select at least one voter.",
                "info"
            );
            return;
        }

        Swal.fire({
            title: "Are you sure?",
            text: `Delete ${selectedIds.length} voter(s)?`,
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
                            axios.delete(`/api/voters/${id}`)
                        )
                    );
                    fetchVoters(1, searchTerm);
                    setCurrentPage(1);
                    setSelectedIds([]);

                    Swal.fire({
                        title: "Deleted!",
                        text: "Selected voters have been deleted.",
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

    const handleFilterChange = (filterName, value) => {
        setFilterValues((prev) => ({
            ...prev,
            [filterName]: value,
        }));
        // Reset to page 1
        setCurrentPage(1);
    };

    const bulkActions = {
        add: true,
        delete: true,
    };

    const actions = {
        view: true,
        edit: true,
        delete: true,
    };

    // headers
    const tableHeaders = {
        registration_num: "Registration #",
        full_name: "Name",
        email: "Email",
        church_name: "Church",
        action: "Action",
    };

    return (
        <>
            <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md lg:col-span-2">
                <div className="bg-white relative overflow-x-auto">
                    <Table
                        name="voter"
                        items={voters}
                        header={tableHeaders}
                        tableName="Voter"
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        onSearchChange={setSearchTerm}
                        onDelete={handleDelete}
                        selectedIds={selectedIds}
                        onToggleSelect={toggleSelect}
                        onDeleteSelected={handleDeleteSelected}
                        link="/admin/voters"
                        actions={actions}
                        bulkActions={bulkActions}
                        filters={[
                            {
                                label: "Church",
                                name: "church",
                                options: churchFilterOptions,
                            },
                        ]}
                        onFilterChange={handleFilterChange}
                    />
                </div>
            </div>
        </>
    );
}
