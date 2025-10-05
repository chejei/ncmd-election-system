import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "../../../api/axios";
import FormFields from "../../../components/FormFields";
import Swal from "sweetalert2";

export default function AddCandidate() {
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
    const [churches, setChurches] = useState([]);
    const [positions, setPositions] = useState([]);
    const [photoPreview, setPhotoPreview] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        axios.get("/api/churches").then((res) => setChurches(res.data));
        axios.get("/api/positions").then((res) => setPositions(res.data));
    }, []);

    const handleFileChange = async (e, fieldName) => {
        const file = e.target.files[0];

        if (!file) {
            setValue(fieldName, "", {
                shouldValidate: true,
                shouldDirty: true,
            });
            await trigger(fieldName);
            setPhotoPreview(null);
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
                setPhotoPreview(base64String);
            };
            reader.readAsDataURL(file);
        } else {
            setValue(fieldName, "", { shouldValidate: true }); // clear if no file
        }
    };

    const fields = [
        {
            name: "heading-1",
            label: "Personal Information",
            type: "heading",
            wrapperClass: "col-span-1 md:col-span-2 lg:col-span-3",
        },
        {
            name: "photo",
            label: "Photo",
            type: "file",
            className: "h-[297px] w-full object-contain rounded",
            wrapperClass: "row-span-5",
            required: true,
        },
        {
            name: "last_name",
            label: "Last Name",
            type: "text",
            className: "w-full border rounded px-3 py-2",
            wrapperClass: "mb-3",
            required: true,
        },
        {
            name: "first_name",
            label: "First Name",
            type: "text",
            className: "w-full border rounded px-3 py-2",
            wrapperClass: "mb-3",
            required: true,
        },
        {
            name: "middle_name",
            label: "Middle Name",
            type: "text",
            className: "w-full border rounded px-3 py-2",
            wrapperClass: "mb-3",
        },
        {
            name: "suffix_name",
            label: "Suffix Name",
            type: "text",
            className: "w-full border rounded px-3 py-2",
            wrapperClass: "mb-3",
        },
        {
            name: "age",
            label: "Age",
            type: "number",
            className: "w-full border rounded px-3 py-2",
            wrapperClass: "mb-3",
            required: true,
        },
        {
            name: "email",
            label: "Email",
            type: "text",
            className: "w-full border rounded px-3 py-2",
            wrapperClass: "mb-3",
            required: true,
        },
        {
            name: "phone_number",
            label: "Phone Number",
            type: "text",
            className: "w-full border rounded px-3 py-2",
            wrapperClass: "mb-3",
            required: true,
        },
        {
            name: "address",
            label: "Address",
            type: "text",
            className: "w-full border rounded px-3 py-2",
            wrapperClass: "mb-3",
        },
        {
            name: "heading-2",
            label: "Education Background",
            type: "heading",
            wrapperClass: "col-span-1 md:col-span-2 lg:col-span-3",
        },
        {
            name: "grade_year",
            label: "Grade/Year",
            type: "text",
            className: "w-full border rounded px-3 py-2",
            wrapperClass: "mb-3",
        },
        {
            name: "course_strand",
            label: "Course/Strand",
            type: "text",
            className: "w-full border rounded px-3 py-2",
            wrapperClass: "mb-3",
        },
        {
            name: "school",
            label: "School",
            type: "text",
            className: "w-full border rounded px-3 py-2",
            wrapperClass: "mb-3",
        },
        {
            name: "heading-3",
            label: "Professional Background",
            type: "heading",
            wrapperClass: "col-span-1 md:col-span-2 lg:col-span-3",
        },
        {
            name: "occupation",
            label: "Occupation",
            type: "text",
            className: "w-full border rounded px-3 py-2",
            wrapperClass: "mb-3",
        },
        {
            name: "company",
            label: "Company",
            type: "text",
            className: "w-full border rounded px-3 py-2",
            wrapperClass: "mb-3",
        },
        {
            name: "heading-4",
            label: "Ministry / Church Affiliation",
            type: "heading",
            wrapperClass: "col-span-1 md:col-span-2 lg:col-span-3",
        },
        {
            name: "church_id",
            label: "Church",
            type: "select",
            options: churches.map((c) => ({ value: c.id, label: c.name })),
            className: "w-full border rounded px-3 py-2",
            wrapperClass: "mb-3",
            required: true,
        },
        {
            name: "ministry_involvement",
            label: "Ministry Involvement",
            type: "wysiwyg",
            className: "w-full h-[400px] border rounded px-3 py-2",
            wrapperClass: "col-span-1 md:col-span-2 lg:col-span-3",
        },
        {
            name: "heading-5",
            label: "Election Details",
            type: "heading",
            wrapperClass: "col-span-1 md:col-span-2 lg:col-span-3",
        },
        {
            name: "position_id",
            label: "Candidacy Position",
            type: "select",
            options: positions.map((p) => ({ value: p.id, label: p.title })),
            className: "w-full border rounded px-3 py-2",
            wrapperClass: "mb-3",
            required: true,
        },
        {
            name: "endorsed",
            label: "Endorsed by",
            type: "text",
            className: "w-full border rounded px-3 py-2",
            wrapperClass: "mb-3",
        },
        {
            name: "political_color",
            label: "Political Color",
            type: "color",
            className: " h-10 w-10 border rounded px-2 py-2",
            wrapperClass: "mb-3",
        },
    ];

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            Object.keys(data).forEach((key) => {
                const value = data[key] === undefined ? "" : data[key];
                formData.append(key, value);
            });
            formData.append("status", "approved");
            const res = await axios.post("/api/candidates", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (res.status === 200 || res.status === 201) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Candidate saved successfully!",
                }).then(() => {
                    navigate("/admin/candidate");
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Error saving candidate.",
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
                        "Failed to save candidate.",
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
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
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
                <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end items-center">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Save Candidate
                    </button>
                </div>
            </form>
        </div>
    );
}
