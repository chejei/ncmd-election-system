import React, { useEffect, useState } from "react";
import { useSetting } from "../components/SettingContext";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { UploadIcon } from "../assets/icons/icon";
import axios from "../api/axios";
import Swal from "sweetalert2";
import Stepper from "../components/Stepper";
import TiptapEditor from "../components/TiptapEditor";
import ctaOverlay1 from "../assets/images/leaders.jpg";

const steps = [
    { number: 1, label: "Personal Information" },
    { number: 2, label: "Education & Professional" },
    { number: 3, label: "Ministry / Church Affiliation" },
    { number: 4, label: "Question & Answers" },
    { number: 5, label: "Candidacy Details" },
    { number: 6, label: "Review" },
];
export default function CandidacyApplication() {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        trigger,
        clearErrors,
        formState: { errors },
        control,
        reset,
    } = useForm({
        mode: "onChange",
        defaultValues: {
            ministry_involvement: null,
        },
    });
    const [churches, setChurches] = useState([]);
    const [positions, setPositions] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [currentStep, setCurrentStep] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [electoralGroups, setElectoralGroups] = useState([]);
    const siteName = useSetting("site_name", "");
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("/api/churches").then((res) => setChurches(res.data));
        axios.get("/api/positions").then((res) => setPositions(res.data));
        axios
            .get("/api/questions-active")
            .then((res) => setQuestions(res.data));
        axios
            .get("/api/electoral-groups")
            .then((res) => setElectoralGroups(res.data));
    }, []);

    // Handle file uploads
    const handleFileChange = async (e, fieldName) => {
        const file = e.target.files[0];

        if (!file) {
            // user cleared file or cancelled — clear value and run validation
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

    const handleNext = async () => {
        let fieldsToValidate = [];
        switch (currentStep) {
            case 1: // Personal Info
                fieldsToValidate = [
                    "photo",
                    "first_name",
                    "middle_name",
                    "last_name",
                    "suffix_name",
                    "age",
                    "email",
                    "phone_number",
                    "address",
                ];
                break;
            case 2: // Education
                fieldsToValidate = [
                    "grade_year",
                    "course_strand",
                    "school",
                    "occupation",
                    "company",
                ];
                break;
            case 3: // Church & Ministry
                fieldsToValidate = ["church_id", "ministry_involvement"];
                break;
            case 5: // Questions & Candidacy
                fieldsToValidate = [
                    "position_id",
                    "endorsed",
                    "electoral_group_id",
                ];
                break;
            case 6: // Review
                fieldsToValidate = ["confirm_correct", "agree_terms"];
                break;
            default:
                break;
        }

        const isValid = await trigger(fieldsToValidate);

        if (!isValid) {
            // stop and let react-hook-form show validation errors
            return;
        }
        if (currentStep === 6) {
            handleSubmit(onSubmit)();
        } else {
            setCurrentStep(currentStep + 1);
            window.scrollTo({ behavior: "smooth" });
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                // Convert undefined to null
                const normalizedValue = value === undefined ? null : value;

                if (normalizedValue === null) {
                    formData.append(key, ""); // Laravel treats empty string as null (if nullable)
                    return;
                }

                if (typeof normalizedValue === "boolean") {
                    formData.append(key, normalizedValue ? 1 : 0);
                    return;
                }

                formData.append(key, normalizedValue);
            });

            formData.append(
                "questions",
                JSON.stringify(
                    questions.map((q) => ({
                        id: q.id,
                        answer: q.answer,
                    }))
                )
            );

            const res = await axios.post("/api/apply-candidacy", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.status === 200 || res.status === 201) {
                sessionStorage.setItem("fromCandidacyForm", "true");
                setTimeout(() => {
                    navigate("/candidacy-acknowledgement");
                }, 50);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to submit application.",
                });
            }
        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text:
                    error.response?.data?.message ||
                    "Failed to submit application.",
            });
        }
    };
    return (
        <>
            <section
                id="image"
                className="h-[500px] bg-gradient-to-b from-black to-slate-950  bg-black overlay-wrapper"
            >
                <div className="overlay-img h-[100%]">
                    <img
                        className="object-cover sm:w-full h-[100%]"
                        src={ctaOverlay1}
                    />
                </div>
            </section>
            <div className="min-h-screen">
                <div className="max-w-screen-xl mx-auto p-8">
                    {!showForm ? (
                        <section className="py-10 lg:py-20">
                            <div className="mx-auto flex flex-col text-center text-black">
                                <h2 className="text-4xl font-medium lg:text-6xl">
                                    Are You the
                                    <br />
                                    <span className="text-red-500 font-bold">
                                        Servant Leader
                                    </span>
                                    <br />
                                    We Are Looking For?
                                </h2>
                                <span className="max-w-screen-md mx-auto mb-10 text-gray-600 pt-5 text-[18px] leading-[24px] md:text-[20px] md:leading-[26px]">
                                    The {siteName} is in search of new leaders
                                    who embody humility, integrity, and
                                    Christ-like service. It is our mission to
                                    raise leaders who serve first, lead with
                                    compassion, and guide with faith.
                                </span>
                                <div className="pb-10 lg:pb-20">
                                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                                        <div>
                                            <h2 className="mt-4 text-xl font-semibold text-gray-800">
                                                Serve First
                                            </h2>
                                            <p className="mt-2 text-gray-500">
                                                True leadership begins with
                                                humility. Putting the needs of
                                                others above personal ambition.
                                                A servant leader listens,
                                                supports, and uplifts the
                                                community, following Christ's
                                                example of washing His
                                                disciples' feet. Service is not
                                                secondary to leadership—it is
                                                the foundation of it.
                                            </p>
                                        </div>

                                        <div>
                                            <h2 className="mt-4 text-xl font-semibold text-gray-800">
                                                Lead with Compassion
                                            </h2>
                                            <p className="mt-2 text-gray-500">
                                                Guiding others with empathy,
                                                kindness, and understanding. A
                                                compassionate leader values
                                                people over power, showing
                                                patience and love in
                                                decision-making and ensuring
                                                that every voice is heard.
                                            </p>
                                        </div>

                                        <div>
                                            <h2 className="mt-4 text-xl font-semibold text-gray-800">
                                                Guide with Faith
                                            </h2>
                                            <p className="mt-2 text-gray-500">
                                                Faith is the compass of a
                                                servant leader. Leading in
                                                alignment with God’s Word,
                                                trusting His wisdom above all.
                                                It is about inspiring others to
                                                remain steadfast in their
                                                spiritual journey, ensuring that
                                                every action and decision
                                                reflects Christ-centered values.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="mx-auto bg-red-500 text-white font-bold py-2 px-8 rounded-3xl text-xl sm:text-2xl hover:bg-blue-500"
                                >
                                    Get started
                                </button>
                            </div>
                        </section>
                    ) : (
                        <>
                            <section className="py-10">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                                    Welcome to {siteName} Candidacy Application
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    We thank you for your bravery in stepping
                                    forward to serve. True leadership begins
                                    with the courage to see the needs of the
                                    community and answer the call to lead.
                                </p>
                                <p className="text-gray-600 mb-6">
                                    The form you are about to complete is
                                    detailed, as it seeks to present a true
                                    picture of who you are to the voters. We ask
                                    that you fill it out with sincerity,
                                    integrity, and honesty—qualities of a
                                    servant leader. Your willingness to complete
                                    this process reflects not only your
                                    commitment to serve but also your desire to
                                    lead with humility, compassion, and faith.
                                </p>
                                {/* General Reminders */}
                                <div className="bg-blue-50 border border-blue-100 p-4 rounded-md">
                                    <div className="flex items-center mb-2">
                                        <span className="font-medium text-blue-700">
                                            General Reminders
                                        </span>
                                    </div>
                                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                                        <li>
                                            All fields marked with * are
                                            required.
                                        </li>
                                        <li>
                                            Ensure that all information you
                                            provide is true and accurate.
                                        </li>
                                        <li>
                                            Upload a recent photo that clearly
                                            shows your face.
                                        </li>
                                        <li>
                                            Once submitted, your application
                                            will be subject to review and
                                            approval.
                                        </li>
                                        <li>
                                            False or misleading information may
                                            result in disqualification.
                                        </li>
                                    </ul>
                                </div>
                            </section>
                            <Stepper steps={steps} currentStep={currentStep} />

                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="py-10"
                            >
                                {currentStep === 1 && (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Photo */}
                                            <div
                                                className={`row-span-8 ${
                                                    errors.photo
                                                        ? "has-error"
                                                        : ""
                                                }`}
                                            >
                                                <label className="block font-medium mb-1">
                                                    Photo{" "}
                                                    <span className="text-red-500 error-notes">
                                                        *
                                                    </span>
                                                </label>
                                                <label
                                                    htmlFor="profile"
                                                    className="flex flex-col items-center justify-center w-full h-[650px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                                                >
                                                    {photoPreview ? (
                                                        <img
                                                            src={photoPreview}
                                                            alt="Preview"
                                                            className="h-full w-full object-cover object-top rounded"
                                                        />
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                            <UploadIcon />
                                                            <p className="mb-2 text-sm text-gray-500">
                                                                <span className="font-semibold">
                                                                    Click to
                                                                    upload
                                                                </span>
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                SVG, PNG, JPG or
                                                                GIF
                                                            </p>
                                                        </div>
                                                    )}
                                                </label>
                                                <input
                                                    id="profile"
                                                    type="file"
                                                    accept="image/*"
                                                    {...register("photo", {
                                                        validate: (value) => {
                                                            if (
                                                                value instanceof
                                                                FileList
                                                            ) {
                                                                if (
                                                                    value.length ===
                                                                    0
                                                                ) {
                                                                    return "Photo is required";
                                                                }
                                                                return true;
                                                            }

                                                            if (
                                                                typeof value ===
                                                                    "string" &&
                                                                value.trim() !==
                                                                    ""
                                                            ) {
                                                                return true;
                                                            }

                                                            return "Photo is required";
                                                        },
                                                    })}
                                                    onChange={(e) =>
                                                        handleFileChange(
                                                            e,
                                                            "photo"
                                                        )
                                                    }
                                                    className="hidden"
                                                />
                                                {errors.photo && (
                                                    <p className="text-red-500 error-notes">
                                                        {errors.photo.message}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Last Name */}
                                            <div
                                                className={`${
                                                    errors.last_name
                                                        ? "has-error"
                                                        : ""
                                                }`}
                                            >
                                                <label className="block font-medium mb-1">
                                                    Last Name{" "}
                                                    <span className="text-red-500 error-notes">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    {...register("last_name", {
                                                        required:
                                                            "Last name is required",
                                                    })}
                                                    className="w-full border rounded px-3 py-2"
                                                    placeholder="Enter Last Name"
                                                />
                                                {errors.last_name && (
                                                    <p className="text-red-500 error-notes">
                                                        {
                                                            errors.last_name
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            {/* First Name */}
                                            <div
                                                className={`${
                                                    errors.first_name
                                                        ? "has-error"
                                                        : ""
                                                }`}
                                            >
                                                <label className="block font-medium mb-1">
                                                    First Name{" "}
                                                    <span className="text-red-500 error-notes">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    {...register("first_name", {
                                                        required:
                                                            "First name is required",
                                                    })}
                                                    className="w-full border rounded px-3 py-2"
                                                    placeholder="Enter First Name"
                                                />
                                                {errors.first_name && (
                                                    <p className="text-red-500 error-notes">
                                                        {
                                                            errors.first_name
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            {/* Middle Name */}
                                            <div>
                                                <label className="block font-medium mb-1">
                                                    Middle Name
                                                </label>
                                                <input
                                                    {...register("middle_name")}
                                                    className="w-full border rounded px-3 py-2"
                                                    placeholder="Enter Middle Name"
                                                />
                                            </div>

                                            {/* Suffix */}
                                            <div>
                                                <label className="block font-medium mb-1">
                                                    Suffix
                                                </label>
                                                <input
                                                    {...register("suffix_name")}
                                                    className="w-full border rounded px-3 py-2"
                                                    placeholder="Enter Suffix"
                                                />
                                            </div>

                                            {/* Age */}
                                            <div
                                                className={`${
                                                    errors.age
                                                        ? "has-error"
                                                        : ""
                                                }`}
                                            >
                                                <label className="block font-medium mb-1">
                                                    Age{" "}
                                                    <span className="text-red-500 error-notes">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    type="number"
                                                    {...register("age", {
                                                        required:
                                                            "Age is required",
                                                    })}
                                                    className="w-full border rounded px-3 py-2"
                                                    placeholder="Enter Age"
                                                />
                                                {errors.age && (
                                                    <p className="text-red-500 error-notes">
                                                        {errors.age.message}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Email */}
                                            <div
                                                className={`${
                                                    errors.email
                                                        ? "has-error"
                                                        : ""
                                                }`}
                                            >
                                                <label className="block font-medium mb-1">
                                                    Email
                                                    <span className="text-red-500 error-notes">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    {...register("email", {
                                                        required:
                                                            "Email is required",
                                                        pattern: {
                                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                            message:
                                                                "Please enter a valid email address",
                                                        },
                                                    })}
                                                    className="w-full border rounded px-3 py-2"
                                                    placeholder="Enter Email"
                                                />
                                                {errors.email && (
                                                    <p className="text-red-500 error-notes">
                                                        {errors.email.message}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Phone Number */}
                                            <div
                                                className={`${
                                                    errors.phone_number
                                                        ? "has-error"
                                                        : ""
                                                }`}
                                            >
                                                <label className="block font-medium mb-1">
                                                    Phone Number
                                                    <span className="text-red-500 error-notes">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    {...register(
                                                        "phone_number",
                                                        {
                                                            required:
                                                                "Phone Number is required",
                                                            pattern: {
                                                                value: /^(09|\+639)\d{9}$/,
                                                                message:
                                                                    "Please enter a valid Philippine phone number (e.g., 09123456789 or +639123456789)",
                                                            },
                                                        }
                                                    )}
                                                    onInput={(e) =>
                                                        (e.target.value =
                                                            e.target.value.replace(
                                                                /[^0-9+]/g,
                                                                ""
                                                            ))
                                                    }
                                                    className="w-full border rounded px-3 py-2"
                                                    placeholder="Enter Phone Number"
                                                />
                                                {errors.phone_number && (
                                                    <p className="text-red-500 error-notes">
                                                        {
                                                            errors.phone_number
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            {/* Address */}
                                            <div>
                                                <label className="block font-medium mb-1">
                                                    Address
                                                </label>
                                                <input
                                                    {...register("address")}
                                                    className="w-full border rounded px-3 py-2"
                                                    placeholder="Enter Address"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                                {currentStep === 2 && (
                                    <>
                                        <div className="grid  grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2">
                                                <h2 className="text-lg font-bold">
                                                    Education Background
                                                </h2>
                                            </div>
                                            {/* --- Education Background --- */}
                                            <div>
                                                <label className="block font-medium mb-1">
                                                    Grade/Year
                                                </label>
                                                <input
                                                    {...register("grade_year")}
                                                    className="w-full border rounded px-3 py-2"
                                                    placeholder="Enter Grade/Year"
                                                />
                                            </div>

                                            <div>
                                                <label className="block font-medium mb-1">
                                                    Course/Strand
                                                </label>
                                                <input
                                                    {...register(
                                                        "course_strand"
                                                    )}
                                                    className="w-full border rounded px-3 py-2"
                                                    placeholder="Enter Course/Strand"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block font-medium mb-1">
                                                    School
                                                </label>
                                                <input
                                                    {...register("school")}
                                                    className="w-full border rounded px-3 py-2"
                                                    placeholder="Enter School"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <h2 className="text-lg font-bold">
                                                    Professional Background
                                                </h2>
                                            </div>

                                            {/* --- Professional Background --- */}
                                            <div>
                                                <label className="block font-medium mb-1">
                                                    Occupation
                                                </label>
                                                <input
                                                    {...register("occupation")}
                                                    className="w-full border rounded px-3 py-2"
                                                    placeholder="Enter Occupation"
                                                />
                                            </div>

                                            <div>
                                                <label className="block font-medium mb-1">
                                                    Company
                                                </label>
                                                <input
                                                    {...register("company")}
                                                    className="w-full border rounded px-3 py-2"
                                                    placeholder="Enter Company"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                                {currentStep === 3 && (
                                    <>
                                        <div className="grid grid-cols-1 gap-4">
                                            {/* Church */}
                                            <div
                                                className={`${
                                                    errors.church_id
                                                        ? "has-error"
                                                        : ""
                                                }`}
                                            >
                                                <label className="block font-medium mb-1">
                                                    Church{" "}
                                                    <span className="text-red-500 error-notes">
                                                        *
                                                    </span>
                                                </label>
                                                <select
                                                    {...register("church_id", {
                                                        required:
                                                            "Church is required",
                                                    })}
                                                    className="w-full border rounded px-3 py-2"
                                                    defaultValue=""
                                                >
                                                    <option value="">
                                                        Select Church
                                                    </option>
                                                    {churches.map((c) => (
                                                        <option
                                                            key={c.id}
                                                            value={c.id}
                                                        >
                                                            {c.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.church_id && (
                                                    <p className="text-red-500 error-notes">
                                                        {
                                                            errors.church_id
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            {/* Ministry Involvement */}
                                            <div>
                                                <label className="block font-medium mb-1">
                                                    Ministry Involvement
                                                </label>
                                                <Controller
                                                    control={control}
                                                    name="ministry_involvement"
                                                    render={({ field }) => (
                                                        <TiptapEditor
                                                            value={
                                                                field.value ||
                                                                ""
                                                            }
                                                            onChange={(value) =>
                                                                field.onChange(
                                                                    value?.trim()
                                                                        ? value
                                                                        : null
                                                                )
                                                            }
                                                            placeholder="Enter Ministry Involvement"
                                                            className="w-full h-[400px] border rounded px-3 py-2"
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                                {currentStep === 4 && (
                                    <>
                                        <div className="grid grid-cols-1 gap-4">
                                            {questions.map((q, idx) => (
                                                <div key={q.id} className="">
                                                    <label className="block font-medium mb-1">
                                                        Q{idx + 1}.{" "}
                                                        {q.question_text}
                                                    </label>

                                                    <TiptapEditor
                                                        value={q.answer}
                                                        placeholder="Type your answer here..."
                                                        onChange={(val) =>
                                                            setQuestions(
                                                                (prev) =>
                                                                    prev.map(
                                                                        (
                                                                            item
                                                                        ) =>
                                                                            item.id ===
                                                                            q.id
                                                                                ? {
                                                                                      ...item,
                                                                                      answer: val,
                                                                                  }
                                                                                : item
                                                                    )
                                                            )
                                                        }
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                                {currentStep === 5 && (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {/* Position */}
                                            <div
                                                className={`${
                                                    errors.position_id
                                                        ? "has-error"
                                                        : ""
                                                }`}
                                            >
                                                <label className="block font-medium mb-1">
                                                    Position{" "}
                                                    <span className="text-red-500 error-notes">
                                                        *
                                                    </span>
                                                </label>
                                                <select
                                                    {...register(
                                                        "position_id",
                                                        {
                                                            required:
                                                                "Position is required",
                                                        }
                                                    )}
                                                    className="w-full border rounded px-3 py-2"
                                                    defaultValue=""
                                                >
                                                    <option value="">
                                                        Select Position
                                                    </option>
                                                    {positions.map((p) => (
                                                        <option
                                                            key={p.id}
                                                            value={p.id}
                                                        >
                                                            {p.title}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.position_id && (
                                                    <p className="text-red-500 error-notes">
                                                        {
                                                            errors.position_id
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            {/* Endorsed By */}
                                            <div>
                                                <label className="block font-medium mb-1">
                                                    Endorsed by
                                                </label>
                                                <input
                                                    {...register("endorsed")}
                                                    className="w-full border rounded px-3 py-2"
                                                    placeholder="Enter Endorsed By"
                                                />
                                            </div>

                                            {/* Electoral Group */}
                                            <div
                                                className={`${
                                                    errors.electoral_group_id
                                                        ? "has-error"
                                                        : ""
                                                }`}
                                            >
                                                <label className="block font-medium mb-1">
                                                    Electoral Group{" "}
                                                    <span className="text-red-500 error-notes">
                                                        *
                                                    </span>
                                                </label>
                                                <select
                                                    {...register(
                                                        "electoral_group_id",
                                                        {
                                                            required:
                                                                "Electoral Group is required",
                                                        }
                                                    )}
                                                    className="w-full border rounded px-3 py-2"
                                                    defaultValue=""
                                                >
                                                    <option value="">
                                                        Select Electoral Group
                                                    </option>
                                                    {electoralGroups.map(
                                                        (c) => (
                                                            <option
                                                                key={c.id}
                                                                value={c.id}
                                                            >
                                                                {c.name}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                                {errors.electoral_group_id && (
                                                    <p className="text-red-500 error-notes">
                                                        {
                                                            errors
                                                                .electoral_group_id
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                                {currentStep === 6 && (
                                    <>
                                        <p className="text-gray-600 mb-6">
                                            Please review the details below
                                            before submitting. Ensure all
                                            information is accurate, as this
                                            will be used for your candidacy.
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="">
                                                {watch("photo") && (
                                                    <img
                                                        src={watch("photo")}
                                                        alt="Uploaded"
                                                        className="h-150 w-full h-[708px] rounded object-cover object-top border"
                                                    />
                                                )}
                                            </div>
                                            <div className="">
                                                <table className="w-full mt-5 md:mt-0">
                                                    <tbody>
                                                        <tr className="border-b">
                                                            <td
                                                                className="text-lg font-semibold pt-0 p-3"
                                                                colSpan="2"
                                                            >
                                                                Personal
                                                                Information
                                                            </td>
                                                        </tr>
                                                        {/* Name */}
                                                        <tr className="border-b">
                                                            <td className="font-medium p-3">
                                                                Full Name
                                                            </td>
                                                            <td className="p-3">
                                                                {watch(
                                                                    "first_name"
                                                                )}{" "}
                                                                {watch(
                                                                    "middle_name"
                                                                )}{" "}
                                                                {watch(
                                                                    "last_name"
                                                                )}{" "}
                                                                {watch(
                                                                    "suffix_name"
                                                                )}
                                                            </td>
                                                        </tr>

                                                        {/* Age */}
                                                        <tr className="border-b">
                                                            <td className="font-medium p-3">
                                                                Age
                                                            </td>
                                                            <td className="p-3">
                                                                {watch("age")}
                                                            </td>
                                                        </tr>

                                                        {/* Contact */}
                                                        <tr className="border-b">
                                                            <td className="font-medium p-3">
                                                                Email
                                                            </td>
                                                            <td className="p-3">
                                                                {watch("email")}
                                                            </td>
                                                        </tr>
                                                        <tr className="border-b">
                                                            <td className="font-medium p-3">
                                                                Phone Number
                                                            </td>
                                                            <td className="p-3">
                                                                {watch(
                                                                    "phone_number"
                                                                )}
                                                            </td>
                                                        </tr>
                                                        <tr className="border-b">
                                                            <td className="font-medium p-3">
                                                                Address
                                                            </td>
                                                            <td className="p-3">
                                                                {watch(
                                                                    "address"
                                                                )}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <table className="w-full mt-5">
                                                    <tbody>
                                                        <tr className="border-b ">
                                                            <td
                                                                className="text-lg font-semibold p-3"
                                                                colSpan="2"
                                                            >
                                                                Education &
                                                                Professional
                                                                Background
                                                            </td>
                                                        </tr>

                                                        {/* Education */}
                                                        <tr className="border-b">
                                                            <td className="font-medium p-3">
                                                                Education
                                                            </td>
                                                            <td className="p-3">
                                                                {watch(
                                                                    "grade_year"
                                                                )}{" "}
                                                                -{" "}
                                                                {watch(
                                                                    "course_strand"
                                                                )}{" "}
                                                                <br />
                                                                {watch(
                                                                    "school"
                                                                )}
                                                            </td>
                                                        </tr>

                                                        {/* Professional */}
                                                        <tr className="border-b">
                                                            <td className="font-medium p-3">
                                                                Occupation
                                                            </td>
                                                            <td className="p-3">
                                                                {watch(
                                                                    "occupation"
                                                                )}{" "}
                                                                {watch(
                                                                    "company"
                                                                ) && (
                                                                    <>
                                                                        at{" "}
                                                                        {watch(
                                                                            "company"
                                                                        )}
                                                                    </>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <table className="w-full mt-5">
                                                    <tbody>
                                                        <tr className="border-b ">
                                                            <td
                                                                className="text-lg font-semibold p-3"
                                                                colSpan="2"
                                                            >
                                                                Ministry /
                                                                Church
                                                                Affiliation
                                                            </td>
                                                        </tr>

                                                        {/* Church */}
                                                        <tr className="border-b">
                                                            <td className="font-medium p-3">
                                                                Church
                                                            </td>
                                                            <td className="p-3">
                                                                {
                                                                    churches.find(
                                                                        (c) =>
                                                                            c.id ===
                                                                            Number(
                                                                                watch(
                                                                                    "church_id"
                                                                                )
                                                                            )
                                                                    )?.name
                                                                }
                                                            </td>
                                                        </tr>

                                                        {/* Ministry Involvement */}
                                                        <tr className="border-b">
                                                            <td
                                                                className="font-medium p-3"
                                                                colSpan="2"
                                                            >
                                                                Ministry
                                                                Involvement
                                                                <div
                                                                    className="mt-5 font-normal"
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: watch(
                                                                            "ministry_involvement"
                                                                        ),
                                                                    }}
                                                                />
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <table className="w-full mt-5">
                                            <tbody>
                                                <tr className="border-b ">
                                                    <td
                                                        className="text-lg font-semibold p-3"
                                                        colSpan="2"
                                                    >
                                                        Questions and Answers
                                                    </td>
                                                </tr>
                                                {/* Questions */}
                                                {questions.map((q, idx) => (
                                                    <tr
                                                        key={q.id}
                                                        className="border-b"
                                                    >
                                                        <td
                                                            className="font-medium p-3"
                                                            colSpan="2"
                                                        >
                                                            Q{idx + 1}.{" "}
                                                            {q.question_text}
                                                            <div
                                                                className="mt-5 font-normal"
                                                                dangerouslySetInnerHTML={{
                                                                    __html:
                                                                        q.answer ||
                                                                        "<i>No answer provided</i>",
                                                                }}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <table className="w-full my-5">
                                            <tbody>
                                                <tr className="border-b">
                                                    <td
                                                        className="text-lg font-semibold p-3"
                                                        colSpan="2"
                                                    >
                                                        Candidacy Details
                                                    </td>
                                                </tr>

                                                {/* Position */}
                                                <tr className="border-b">
                                                    <td className="font-medium p-3">
                                                        Position
                                                    </td>
                                                    <td className="p-3">
                                                        {
                                                            positions.find(
                                                                (p) =>
                                                                    p.id ===
                                                                    Number(
                                                                        watch(
                                                                            "position_id"
                                                                        )
                                                                    )
                                                            )?.title
                                                        }
                                                    </td>
                                                </tr>

                                                {/* Endorsed By */}
                                                <tr className="border-b">
                                                    <td className="font-medium p-3">
                                                        Endorsed By
                                                    </td>
                                                    <td className="p-3">
                                                        {watch("endorsed")}
                                                    </td>
                                                </tr>

                                                {/* Electoral Group */}
                                                <tr>
                                                    <td className="font-medium p-3">
                                                        Electoral Group
                                                    </td>
                                                    <td className="p-3">
                                                        {
                                                            electoralGroups.find(
                                                                (c) =>
                                                                    c.id ===
                                                                    Number(
                                                                        watch(
                                                                            "electoral_group_id"
                                                                        )
                                                                    )
                                                            )?.name
                                                        }
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        {/* Confirmation Checkboxes */}
                                        <div className="space-y-3 my-6">
                                            <label className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    {...register(
                                                        "confirm_correct",
                                                        {
                                                            required:
                                                                "You must confirm your information is correct",
                                                        }
                                                    )}
                                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                                />
                                                <span className="text-gray-700 text-sm">
                                                    I confirm that all the
                                                    information provided above
                                                    is true and correct.
                                                </span>
                                            </label>
                                            {errors.confirm_correct && (
                                                <p className="text-red-500 has-error text-sm mb-2">
                                                    {
                                                        errors.confirm_correct
                                                            .message
                                                    }
                                                </p>
                                            )}
                                            <label className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    {...register(
                                                        "agree_terms",
                                                        {
                                                            required:
                                                                "You must agree to the terms and conditions",
                                                        }
                                                    )}
                                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                                />
                                                <span className="text-gray-700  text-sm">
                                                    I have read and agree to the{" "}
                                                    <a
                                                        href="/terms-and-conditions"
                                                        className="text-blue-600 hover:underline"
                                                        target="_blank"
                                                    >
                                                        Terms & Conditions
                                                    </a>{" "}
                                                    of the {siteName}.
                                                </span>
                                            </label>

                                            {errors.agree_terms && (
                                                <p className="text-red-500 has-error text-sm mb-2">
                                                    {errors.agree_terms.message}
                                                </p>
                                            )}
                                        </div>
                                    </>
                                )}
                            </form>
                            {/* Navigation Buttons */}
                            <div className="flex justify-end mt-8">
                                {currentStep > 1 && (
                                    <button
                                        onClick={() => handleBack()}
                                        className="px-6 py-3 mx-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100"
                                    >
                                        Back
                                    </button>
                                )}
                                <button
                                    onClick={() => handleNext()}
                                    className="px-6 py-3 mx-2 rounded-xl bg-blue-600 text-white hover:bg-blue-800 cursor-pointer"
                                >
                                    {currentStep === 6 ? "Submit" : "Next"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
