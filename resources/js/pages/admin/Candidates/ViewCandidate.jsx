import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../../api/axios";
import CandidateQuestions from "./CandidateQuestions";
import Tabs from "../../../components/Tabs";
import { EyeIcon } from "../../../assets/icons/icon";

export default function ViewCandidate() {
    const { candidateId } = useParams();
    const navigate = useNavigate();
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("profile");

    useEffect(() => {
        axios
            .get(`/candidates/${candidateId}`)
            .then((res) => {
                setCandidate(res.data);
            })
            .catch((err) => {
                console.error("Error fetching candidate:", err);
            })
            .finally(() => setLoading(false));
    }, [candidateId]);

    if (loading) {
        return (
            <div className="bg-white border border-gray-100 shadow-md p-6 rounded-md">
                <p>Loading candidate details...</p>
            </div>
        );
    }

    if (!candidate) {
        return (
            <div className="bg-white border border-gray-100 shadow-md p-6 rounded-md">
                <p>No candidate found.</p>
            </div>
        );
    }

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
                        <div className="flex">
                            <div className="p-4 flex-none">
                                <img
                                    src={
                                        candidate.photo
                                            ? `/storage/${candidate.photo}`
                                            : "/images/user-placeholder.png"
                                    }
                                    alt={candidate.first_name}
                                    className="h-[300px] w-[300px] object-cover object-top rounded-md border"
                                />
                            </div>
                            <div className="flex-1 p-4">
                                <div className="mb-2 flex items-center">
                                    <h2 className="text-xl font-bold leading-none text-gray-900 sm:text-2xl">
                                        {candidate.full_name || "-"}
                                    </h2>
                                    {candidate.status === "approved" && (
                                        <a
                                            class="bg-transparent action action-preview  hover:bg-blue-500 text-black-50 hover:text-white ml-2 py-1 px-1 border border-black-50 hover:border-transparent rounded"
                                            href={`/candidate/${candidate.slug}`}
                                            target="_blank"
                                            title="Preview"
                                        >
                                            <EyeIcon />
                                        </a>
                                    )}
                                </div>

                                <div className="flex">
                                    <div className="py-4 flex-1">
                                        <dl className="mb-2">
                                            <dt className="font-semibold text-gray-900  ">
                                                Age
                                            </dt>
                                            <dd className="text-gray-500">
                                                {candidate.age || "-"} years old
                                            </dd>
                                        </dl>
                                        <dl className="mb-2">
                                            <dt className="font-semibold text-gray-900  ">
                                                Email
                                            </dt>
                                            <dd className="text-gray-500">
                                                {candidate.email || "-"}
                                            </dd>
                                        </dl>
                                        <dl className="mb-2">
                                            <dt className="font-semibold text-gray-900  ">
                                                Phone Number
                                            </dt>
                                            <dd className="text-gray-500">
                                                {candidate.phone_number || "-"}
                                            </dd>
                                        </dl>
                                        <dl className="mb-2">
                                            <dt className="font-semibold text-gray-900  ">
                                                Address
                                            </dt>
                                            <dd className="flex text-gray-500">
                                                <svg
                                                    className="hidden h-5 w-5 shrink-0 text-gray-400 lg:inline"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        stroke="currentColor"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"
                                                    />
                                                </svg>
                                                {candidate.address || "-"}
                                            </dd>
                                        </dl>
                                    </div>
                                    <div className="py-4 flex-1">
                                        <dl className="mb-2">
                                            <dt className="font-semibold text-gray-900">
                                                Grade/Year
                                            </dt>
                                            <dd className="text-gray-500">
                                                {candidate.grade_year || "-"}
                                            </dd>
                                        </dl>
                                        <dl className="mb-2">
                                            <dt className="font-semibold text-gray-900">
                                                Strand/Course
                                            </dt>
                                            <dd className="text-gray-500">
                                                {candidate.course_strand || "-"}
                                            </dd>
                                        </dl>
                                        <dl className="mb-2">
                                            <dt className="font-semibold text-gray-900">
                                                School
                                            </dt>
                                            <dd className="text-gray-500">
                                                {candidate.school || "-"}
                                            </dd>
                                        </dl>
                                        <dl className="mb-2">
                                            <dt className="font-semibold text-gray-900">
                                                Occupation
                                            </dt>
                                            <dd className="text-gray-500">
                                                {candidate.occupation || "-"}
                                            </dd>
                                        </dl>
                                        <dl className="mb-2">
                                            <dt className="font-semibold text-gray-900">
                                                Company
                                            </dt>
                                            <dd className="text-gray-500">
                                                {candidate.company || "-"}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr className="my-6 border-gray-200" />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Election Details
                            </h3>
                            <p>
                                <span className="font-medium font-semibold">
                                    Position:
                                </span>{" "}
                                {candidate.position?.title || "-"}
                            </p>
                            <p>
                                <span className="font-medium font-semibold">
                                    Endorsed:
                                </span>{" "}
                                {candidate.endorsed || "-"}
                            </p>
                        </div>
                        <hr className="my-6 border-gray-200" />
                        <div className>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Ministry / Church Affiliation
                            </h3>
                            <p>
                                <span className="font-medium font-semibold">
                                    Church:
                                </span>{" "}
                                {candidate.church?.name || "-"}
                            </p>
                            <p>
                                <span className="font-medium font-semibold">
                                    Ministry Involvement:
                                </span>
                            </p>
                            <div
                                className="py-3 editor-html"
                                dangerouslySetInnerHTML={{
                                    __html: candidate.ministry_involvement,
                                }}
                            ></div>
                        </div>
                    </div>
                )}
                {activeTab === "qa" && (
                    <div className="p-4">
                        <CandidateQuestions
                            candidateId={candidateId}
                            readOnly={true}
                        />
                    </div>
                )}
            </div>
            <div className="flex justify-end mt-6">
                <button
                    onClick={() => navigate(-1)}
                    className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                >
                    {" "}
                    Back{" "}
                </button>
                {!candidate.restrict && candidate.status === "approved" && (
                    <button
                        onClick={() =>
                            navigate(`/admin/candidate/edit/${candidateId}`)
                        }
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        {" "}
                        Edit
                    </button>
                )}
            </div>
        </div>
    );
}
