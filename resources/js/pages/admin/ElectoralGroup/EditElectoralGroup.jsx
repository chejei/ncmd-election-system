import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../../api/axios";
import FormFields from "../../../components/FormFields";
import Swal from "sweetalert2";

export default function EditElectoralGroup() {
    const { electoralGroupId } = useParams();
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        trigger,
        clearErrors,
        formState: { errors },
        reset,
        control,
    } = useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
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

    useEffect(() => {
        const fetchChurch = async () => {
            try {
                const res = await axios.get(
                    `/api/electoral-groups/${electoralGroupId}`
                );
                const data = res.data;

                const logoUrl = data.logo ? `/storage/${data.logo}` : "";
                const bannerImageUrl = data.banner_image
                    ? `/storage/${data.banner_image}`
                    : "";
                reset({
                    ...data,
                    logo: logoUrl,
                    banner_image: bannerImageUrl,
                });

                setPhotoPreview((prev) => ({
                    ...prev,
                    logo: logoUrl,
                    banner_image: bannerImageUrl,
                }));
                setLoading(false);
            } catch (error) {
                console.error("Error fetching Electoral group:", error);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Failed to load Electoral group data.",
                });
            }
        };
        fetchChurch();
    }, [electoralGroupId, reset]);

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
                setValue(fieldName, reader.result, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                });
                clearErrors(fieldName);
                await trigger(fieldName);
                setPhotoPreview((prev) => ({
                    ...prev,
                    [fieldName]: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        } else {
            setValue(fieldName, "", { shouldValidate: true }); // clear if no file
        }
    };

    const onSubmit = async (data) => {
        try {
            const res = await axios.put(
                `/api/electoral-groups/${electoralGroupId}`,
                data
            );
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Electoral group updated successfully!",
            }).then(() => navigate("/admin/candidate/electoral-group"));
        } catch (error) {
            console.error("Error updating Electoral group:", error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text:
                    error.response?.data?.message ||
                    "Failed to update Electoral group.",
            });
        }
    };

    if (loading) return <div>Loading...</div>;

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
                        Update Electoral Group
                    </button>
                </div>
            </form>
        </div>
    );
}
