import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "../../../api/axios";
import FormFields from "../../../components/FormFields";
import Swal from "sweetalert2";

export default function AddElectoralGroup() {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        trigger,
        clearErrors,
        formState: { errors },
        control,
    } = useForm();
    const navigate = useNavigate();
    const [photoPreview, setPhotoPreview] = useState({
        logo: null,
        banner_image: null,
    });

    const fields = [
        {
            name: "name",
            label: "Name",
            type: "text",
            className: "w-full border rounded px-3 py-2",
            wrapperClass: "mb-3",
            required: true,
        },
        {
            name: "color",
            label: "Political Color",
            type: "color",
            className: "h-10 w-10 border rounded px-2 py-2",
            wrapperClass: "mb-3",
        },
        {
            name: "logo",
            label: "Logo",
            type: "file",
            className: "h-[297px] w-full object-contain rounded",
            wrapperClass: "row-span-5",
            required: true,
        },
        {
            name: "banner_image",
            label: "Banner Image",
            type: "file",
            className: "h-[297px] w-full object-contain rounded",
            wrapperClass: "row-span-5",
            required: true,
        },
    ];

    const handleFileChange = async (e, fieldName) => {
        const file = e.target.files[0];

        if (!file) {
            setValue(fieldName, "", {
                shouldValidate: true,
                shouldDirty: true,
            });
            await trigger(fieldName);
            setPhotoPreview((prev) => ({
                ...prev,
                [fieldName]: null,
            }));
            return;
        }

        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result;
                setValue(fieldName, base64String, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                });
                clearErrors(fieldName);
                await trigger(fieldName);
                setPhotoPreview((prev) => ({
                    ...prev,
                    [fieldName]: base64String,
                }));
            };
            reader.readAsDataURL(file);
        } else {
            setValue(fieldName, "", { shouldValidate: true }); // clear if no file
        }
    };

    const onSubmit = async (data) => {
        try {
            const res = await axios.post("/api/electoral-groups", data);

            if (res.status === 200 || res.status === 201) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Political Group saved successfully!",
                }).then(() => {
                    navigate("/admin/candidate/electoral-group");
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Error saving Political Group.",
                });
            }
        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text:
                    error.response?.data?.message ||
                    "Failed to save Political Group.",
            });
        }
    };

    return (
        <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md lg:col-span-2">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4"
            >
                <FormFields
                    fields={fields}
                    register={register}
                    errors={errors}
                    watch={watch}
                    handleFileChange={handleFileChange}
                    control={control}
                    photoPreview={photoPreview}
                />
                <div className="col-span-1 md:col-span-2 lg:col-span-2 flex justify-end items-center">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-800 text-white px-4 py-2 rounded cursor-pointer"
                    >
                        Save Political Group
                    </button>
                </div>
            </form>
        </div>
    );
}
