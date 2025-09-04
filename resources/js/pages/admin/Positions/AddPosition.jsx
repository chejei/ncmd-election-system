import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "../../../api/axios";
import FormFields from "../../../components/FormFields";
import Swal from "sweetalert2";

export default function AddPosition() {
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
            label: "Position Details",
            type: "heading",
            wrapperClass: "col-span-3",
        },
        {
            name: "title",
            label: "Title",
            type: "text",
            className: "w-full border rounded px-3 py-2",
            wrapperClass: "mb-3",
            required: true,
        },
        {
            name: "max_winners",
            label: "Max Winners",
            type: "number",
            className: "w-full border rounded px-3 py-2",
            wrapperClass: "mb-3",
            required: true,
        },
    ];

    const onSubmit = async (data) => {
        try {
            const res = await axios.post("/positions", data);

            if (res.status === 200 || res.status === 201) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Position saved successfully!",
                }).then(() => {
                    navigate("/admin/candidate/positions");
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Error saving position.",
                });
            }
        } catch (error) {
            console.error("Error:", error);
            if (error.response) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text:
                        error.response.data.message ||
                        "Failed to save position.",
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Unexpected Error",
                    text: "An unexpected error occurred.",
                });
            }
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
                        Save Position
                    </button>
                </div>
            </form>
        </div>
    );
}
