import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "../../../api/axios";
import FormFields from "../../../components/FormFields";
import Swal from "sweetalert2";

export default function EditPosition() {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset,
        control,
    } = useForm();
    const { positionId } = useParams();
    const [originalData, setOriginalData] = useState({});

    useEffect(() => {
        const fetchPosition = async () => {
            try {
                const res = await axios.get(`/api/positions/${positionId}`);
                const data = res.data;

                setOriginalData(data);

                reset({
                    ...data,
                });
            } catch (error) {
                console.error("Error fetching position:", error);
            }
        };
        fetchPosition();
    }, [positionId, reset]);

    const fields = [
        {
            name: "title",
            label: "Title",
            type: "text",
            className: "w-full border rounded px-3 py-2",
            wrapperClass: "mb-3 col-span-2",
            required: true,
        },
        {
            name: "max_winners",
            label: "Max Winner",
            type: "number",
            className: "w-full border rounded px-3 py-2",
            wrapperClass: "mb-3",
            required: true,
        },
    ];

    const onSubmit = async (data) => {
        try {
            const changedFields = {};

            Object.keys(data).forEach((key) => {
                if (data[key] == null) {
                    return;
                }

                if (data[key] !== (originalData[key] ?? "")) {
                    changedFields[key] = data[key];
                }
            });

            if (Object.keys(changedFields).length === 0) {
                Swal.fire({
                    title: "No Changes",
                    text: "No fields were updated.",
                    icon: "info",
                    confirmButtonText: "OK",
                });
                return;
            }

            const formData = new FormData();
            Object.keys(data).forEach((key) => {
                if (data[key] === null) {
                    data[key] = "";
                }
                formData.append(key, data[key]);
            });
            formData.append("_method", "PUT");

            const res = await axios.post(
                `/api/positions/${positionId}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (res.status === 200 || res.status === 201) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Position saved successfully!",
                }).then(() => {
                    reset();
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
                className="grid grid-cols-2 gap-4"
            >
                <FormFields
                    fields={fields}
                    register={register}
                    errors={errors}
                    watch={watch}
                    handleFileChange={() => {}}
                    control={control}
                />
                <div className="col-span-2 flex justify-end">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
