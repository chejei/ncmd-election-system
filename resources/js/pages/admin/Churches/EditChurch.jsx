import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../../api/axios";
import FormFields from "../../../components/FormFields";
import Swal from "sweetalert2";

export default function EditChurch() {
    const { churchId } = useParams();
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
        control,
    } = useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const fields = [
        {
            name: "heading-1",
            label: "Church Details",
            type: "heading",
            wrapperClass: "col-span-1 md:col-span-2 lg:col-span-3",
        },
        {
            name: "name",
            label: "Church Name",
            type: "text",
            className: "w-full border rounded px-3 py-2",
            wrapperClass: "mb-3",
            required: true,
        },
        {
            name: "senior_ptr",
            label: "Senior Pastor",
            type: "text",
            className: "w-full border rounded px-3 py-2",
            wrapperClass: "mb-3",
        },
        {
            name: "zone",
            label: "Zone",
            type: "number",
            className: "w-full border rounded px-3 py-2",
            wrapperClass: "mb-3",
        },
        {
            name: "circuit",
            label: "Circuit",
            type: "number",
            className: "w-full border rounded px-3 py-2",
            wrapperClass: "mb-3",
        },
        {
            name: "address",
            label: "Address",
            type: "text",
            className: "w-full border rounded px-3 py-2",
            wrapperClass: "mb-3",
        },
    ];

    useEffect(() => {
        const fetchChurch = async () => {
            try {
                const res = await axios.get(`/api/churches/${churchId}`);
                reset(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching church:", error);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Failed to load church data.",
                });
            }
        };
        fetchChurch();
    }, [churchId, reset]);

    const onSubmit = async (data) => {
        try {
            const res = await axios.put(`/api/churches/${churchId}`, data);
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Church updated successfully!",
            }).then(() => navigate("/admin/candidate/churches"));
        } catch (error) {
            console.error("Error updating church:", error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text:
                    error.response?.data?.message || "Failed to update church.",
            });
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md lg:col-span-2">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
                <FormFields
                    fields={fields}
                    register={register}
                    errors={errors}
                    watch={watch}
                    control={control}
                />
                <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end items-center">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-800 text-white px-4 py-2 rounded cursor-pointer"
                    >
                        Update Church
                    </button>
                </div>
            </form>
        </div>
    );
}
