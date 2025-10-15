import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../../api/axios";
import FormFields from "../../../components/FormFields";
import Swal from "sweetalert2";

export default function EditVoter() {
    const { voterId } = useParams();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        watch,
        control,
    } = useForm();

    const [churches, setChurches] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch churches for dropdown
                const churchRes = await axios.get("/api/churches");
                setChurches(churchRes.data);

                // Fetch voter data
                const voterRes = await axios.get(`/api/voters/${voterId}`);
                const voter = voterRes.data.data;

                if (voter.restrict) {
                    Swal.fire({
                        icon: "warning",
                        title: "Already Voted",
                        text: "You cannot edit voter details because this voter has already voted.",
                        backdrop: `
                                rgba(0,0,0,0.6)
                                blur(5px)
                                `,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                    }).then(() => {
                        navigate("/admin/voters"); // redirect back to voter list
                    });
                    return; // stop execution
                }

                // Prefill normal fields
                Object.keys(voter).forEach((key) => {
                    if (key !== "church_name") {
                        setValue(key, voter[key]);
                    }
                });

                // Match church_name → church_id
                if (voter.church_name) {
                    const church = churchRes.data.find(
                        (c) =>
                            c.name.toLowerCase() ===
                            voter.church_name.toLowerCase()
                    );
                    if (church) {
                        setValue("church_id", church.id);
                    }
                }
            } catch (error) {
                Swal.fire("Error", "Failed to load voter details", "error");
            }
        };

        fetchData();
    }, [voterId, setValue, navigate]);

    const fields = [
        {
            name: "heading-1",
            label: "Voter Information",
            type: "heading",
            wrapperClass: "col-span-1 md:col-span-2 lg:col-span-3",
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
            name: "last_name",
            label: "Last Name",
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
            name: "email",
            label: "Email",
            type: "email",
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
            name: "church_id",
            label: "Church",
            type: "select",
            options: churches.map((c) => ({ value: c.id, label: c.name })),
            className: "w-full border rounded px-3 py-2",
            wrapperClass: "mb-3",
        },
    ];

    const onSubmit = async (data) => {
        try {
            const res = await axios.put(`/api/voters/${voterId}`, data);
            if (res.status === 200) {
                Swal.fire(
                    "Success",
                    "Voter updated successfully!",
                    "success"
                ).then(() => {
                    navigate("/admin/voters");
                });
            }
        } catch (error) {
            console.error("Error:", error);
            Swal.fire(
                "Error",
                error.response?.data?.message || "Failed to update voter.",
                "error"
            );
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
                    control={control}
                />
                <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end items-center">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-800 text-white px-4 py-2 rounded cursor-pointer"
                    >
                        Update Voter
                    </button>
                </div>
            </form>
        </div>
    );
}
