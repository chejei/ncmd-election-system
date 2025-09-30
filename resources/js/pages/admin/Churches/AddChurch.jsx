import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "../../../api/axios";
import FormFields from "../../../components/FormFields";
import Swal from "sweetalert2";

export default function AddChurch() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        control,
    } = useForm();
    const navigate = useNavigate();

    const fields = [
        {
            name: "heading-1",
            label: "Church Details",
            type: "heading",
            wrapperClass: "col-span-3",
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

    const onSubmit = async (data) => {
        try {
            const res = await axios.post("/api/churches", data);

            if (res.status === 200 || res.status === 201) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Church saved successfully!",
                }).then(() => {
                    navigate("/admin/candidate/churches");
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Error saving church.",
                });
            }
        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.response?.data?.message || "Failed to save church.",
            });
        }
    };

    return (
        <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md lg:col-span-2">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-3 gap-4"
            >
                <FormFields
                    fields={fields}
                    register={register}
                    errors={errors}
                    watch={watch}
                    control={control}
                />
                <div className="col-span-3 flex justify-end items-center">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Save Church
                    </button>
                </div>
            </form>
        </div>
    );
}
