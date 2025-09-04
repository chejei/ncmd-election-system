import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "../../../api/axios";
import FormFields from "../../../components/FormFields";
import Tabs from "../../../components/Tabs";
import CandidateQuestions from "./CandidateQuestions";
import Swal from "sweetalert2";

export default function EditCandidate() {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset,
        control,
    } = useForm();
    const [churches, setChurches] = useState([]);
    const [positions, setPositions] = useState([]);
    const [originalData, setOriginalData] = useState({});
    const { candidateId } = useParams();
    const [activeTab, setActiveTab] = useState("profile");
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("/churches").then((res) => setChurches(res.data));
        axios.get("/positions").then((res) => setPositions(res.data));
    }, []);

    useEffect(() => {
        const fetchCandidate = async () => {
            try {
                const res = await axios.get(`/candidates/${candidateId}`);
                const data = res.data;

                if (data.restrict) {
                    Swal.fire({
                        icon: "warning",
                        title: "Election Ongoing",
                        text: "You cannot edit candidate details while the election is in progress.",
                        background: "#fff", // optional: clean white bg
                        backdrop: `
              rgba(0,0,0,0.6)
              blur(5px)
            `,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        showConfirmButton: false,
                        timer: 3000, // 3 seconds
                        timerProgressBar: true,
                    }).then(() => {
                        navigate(-1); // go back after swal closes
                    });
                    return;
                }
                setOriginalData(data);

                reset({
                    ...data,
                    photo: data.photo
                        ? `${import.meta.env.VITE_STORAGE_BASE}/${data.photo}`
                        : "",
                });
            } catch (error) {
                console.error("Error fetching candidate:", error);
            }
        };
        fetchCandidate();
    }, [candidateId, reset]);

    const handleFileChange = (e, fieldName, clearErrors) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setValue(fieldName, reader.result, {
                    shouldValidate: true,
                    shouldDirty: true,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data) => {
        try {
            const changedFields = {};

            Object.keys(data).forEach((key) => {
                if (key === "church" || key === "position") {
                    return;
                }

                if (data[key] == null) {
                    return;
                }

                if (key === "photo") {
                    const newfile = data[key].split("/").pop();
                    if (
                        data[key] !== "" &&
                        originalData.photo !== `candidates/${newfile}`
                    ) {
                        changedFields[key] = data[key];
                    }
                } else if (data[key] !== (originalData[key] ?? "")) {
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
                `/candidates/${candidateId}`,
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
                    text: "Candidate saved successfully!",
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

    const fields = [
        {
            name: "heading-1",
            label: "Personal Information",
            type: "heading",
            wrapperClass: "col-span-3",
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
        },
        {
            name: "phone_number",
            label: "Phone Number",
            type: "text",
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
        {
            name: "heading-2",
            label: "Education Background",
            type: "heading",
            wrapperClass: "col-span-3",
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
            wrapperClass: "col-span-3",
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
            wrapperClass: "col-span-3",
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
            wrapperClass: "col-span-3",
        },
        {
            name: "heading-5",
            label: "Election Details",
            type: "heading",
            wrapperClass: "col-span-3",
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
            label: "Endorsed",
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

    const tabItems = [
        { key: "profile", label: "Profile" },
        { key: "qa", label: "Questions & Answers" },
    ];

    return (
        <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md lg:col-span-2">
            <Tabs
                tabs={tabItems}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />
            <div>
                {activeTab === "profile" && (
                    <div className="p-4">
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="grid grid-cols-3 gap-4"
                        >
                            <FormFields
                                fields={fields}
                                register={register}
                                errors={errors}
                                watch={watch}
                                handleFileChange={handleFileChange}
                                control={control}
                            />
                            <div className="col-span-3 flex justify-end">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {activeTab === "qa" && (
                    <div className="p-4">
                        <CandidateQuestions candidateId={candidateId} />
                    </div>
                )}
            </div>
        </div>
    );
}
