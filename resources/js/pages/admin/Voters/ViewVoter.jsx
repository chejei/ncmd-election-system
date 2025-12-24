import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    EmailIcon,
    PhoneIcon,
    ResetIcon,
    Visibility,
    VisibilityOff,
} from "../../../assets/icons/icon";
import axios from "../../../api/axios";
import Swal from "sweetalert2";

export default function ViewVoter() {
    const { voterId } = useParams();
    const navigate = useNavigate();
    const [voter, setVoter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPin, setShowPin] = useState(false);
    useEffect(() => {
        const fetchVoter = async () => {
            try {
                const res = await axios.get(`/api/voters/${voterId}`);
                setVoter(res.data.data);
            } catch (error) {
                Swal.fire(
                    "Error",
                    "Failed to load voter details",
                    "error"
                ).then(() => {
                    navigate("/admin/voter");
                });
            } finally {
                setLoading(false);
            }
        };
        fetchVoter();
    }, [voterId, navigate]);

    const handleSend = async (method) => {
        try {
            const res = await axios.post(`/api/voters/${voterId}/send-pin`, {
                method,
            });
            Swal.fire(
                "Success",
                res.data.message || `PIN sent via ${method}`,
                "success"
            );
        } catch (error) {
            Swal.fire(
                "Error",
                error.response?.data?.message ||
                    `Failed to send PIN via ${method}`,
                "error"
            );
        }
    };

    const handleReset = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`/api/voters/${voterId}/reset-pin`);
            Swal.fire({
                title: "PIN Reset!",
                text: `New PIN: ${res.data.new_pin}`,
                icon: "success",
            });
        } catch (error) {
            Swal.fire(
                "Error",
                error.response?.data?.message || `Failed to reset PIN`,
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    if (!voter) {
        return (
            <div className="bg-white border border-gray-100 shadow-md p-6 rounded-md">
                <p>No candidate found.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="bg-white border border-gray-100 shadow-md p-6 rounded-md">
                <p>Loading voter details...</p>
            </div>
        );
    }

    const groupedPositions = voter.voted_positions.reduce((acc, item) => {
        if (!acc[item.position]) {
            acc[item.position] = [];
        }
        acc[item.position].push(item.candidate);
        return acc;
    }, {});

    const pin = voter?.pin_code;
    const maskedPin = pin ? "*".repeat(pin.length) : "-";

    return (
        <div className="bg-white border border-gray-100 shadow-md p-6 rounded-md lg:col-span-2">
            <div>
                <h2 className="text-xl font-bold  mb-3 sm:text-2xl">
                    Voter Information
                </h2>
                <h3 className="text-xl font-bold leading-none text-gray-900">
                    {voter.full_name || "-"}
                </h3>
                <div className="flex flex-1 pb-4">
                    <div className="py-4 flex-1">
                        <dl className="mb-2">
                            <dt className="font-semibold text-gray-900">
                                Registration Number
                            </dt>
                            <dd className="text-gray-500">
                                {voter.registration_num || "-"}
                            </dd>
                        </dl>
                        <dl className="mb-2">
                            <dt className="font-semibold text-gray-900">
                                Email
                            </dt>
                            <dd className="text-gray-500">
                                {voter.email || "-"}
                            </dd>
                        </dl>
                        <dl className="mb-2">
                            <dt className="font-semibold text-gray-900">
                                Phone Number
                            </dt>
                            <dd className="text-gray-500">
                                {voter.phone_number || "-"}
                            </dd>
                        </dl>
                        <dl className="mb-2">
                            <dt className="font-semibold text-gray-900">
                                Church
                            </dt>
                            <dd className="text-gray-500">
                                {voter.church_name || "-"}
                            </dd>
                        </dl>
                    </div>
                    <div className="py-4 flex-1">
                        <dl className="mb-2">
                            <div className="font-semibold text-gray-900  ">
                                Pin Code
                            </div>
                            <div className="flex flex-row items-center gap-2 mb-2 pin-notif">
                                <p className="text-sm italic">
                                    Request for pin code:{" "}
                                </p>
                                <button
                                    onClick={() => handleSend("sms")}
                                    type="button"
                                    className="text-gray-700 border border-gray-700 hover:bg-gray-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center"
                                >
                                    <PhoneIcon />
                                    <span className="sr-only">Send Email</span>
                                </button>
                                <button
                                    onClick={() => handleSend("email")}
                                    type="button"
                                    className="text-gray-700 border border-gray-700 hover:bg-gray-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center"
                                >
                                    <EmailIcon />
                                    <span className="sr-only">Send Email</span>
                                </button>
                            </div>
                            <div className="flex flex-row items-center gap-2 mb-2 pin-notif">
                                <p className="text-sm italic">
                                    Request for reset pin code:{" "}
                                </p>
                                <button
                                    onClick={() => handleReset("sms")}
                                    type="button"
                                    className="text-gray-700 border border-gray-700 hover:bg-gray-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center"
                                >
                                    <ResetIcon />
                                    <span className="sr-only">Send Email</span>
                                </button>
                            </div>
                            <div className="flex flex-row items-center gap-2 mb-2 pin-notif pin-notif-visibility">
                                <p className="text-sm italic">Pin code: </p>
                                {showPin ? pin || "-" : maskedPin}
                                {pin && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPin((prev) => !prev)
                                        }
                                        className="text-gray-700 border border-gray-700 hover:bg-gray-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 inline-flex items-center"
                                    >
                                        {showPin ? (
                                            <Visibility />
                                        ) : (
                                            <VisibilityOff />
                                        )}
                                        <span className="sr-only">
                                            {showPin
                                                ? "Hide pin code"
                                                : "Show pin code"}
                                        </span>
                                    </button>
                                )}
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
            {voter.voted_photo && (
                <>
                    <hr className="my-6 border-gray-200" />
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            My Ballot
                        </h3>
                        <table className="w-full border border-gray-300 rounded-md">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="text-left px-4 py-2 border-b">
                                        Position
                                    </th>
                                    <th className="text-left px-4 py-2 border-b">
                                        Candidate
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(groupedPositions).map(
                                    ([position, candidates], index) => (
                                        <tr key={index}>
                                            <td className="px-4 py-2 border-b">
                                                {position}
                                            </td>
                                            <td className="px-4 py-2 border-b">
                                                {candidates.map((c, i) => (
                                                    <p key={i}>{c}</p>
                                                ))}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                    <hr className="my-6 border-gray-200" />
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Photo Verification
                        </h3>
                        <img
                            src={
                                voter.voted_photo
                                    ? `/storage/${voter.voted_photo}`
                                    : "/images/user-placeholder.png"
                            }
                            alt={voter.first_name}
                            className="h-[300px] w-[300px] object-cover rounded-md border"
                        />
                    </div>
                </>
            )}
            <hr className="my-6 border-gray-200" />
            <div className="flex justify-end mt-6">
                <button
                    onClick={() => navigate("/admin/voters")}
                    className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                >
                    {" "}
                    Back{" "}
                </button>

                {!voter.voted_photo && (
                    <button
                        onClick={() =>
                            navigate(`/admin/voters/edit/${voterId}`)
                        }
                        className="bg-blue-500 hover:bg-blue-800 text-white px-4 py-2 rounded cursor-pointer"
                    >
                        {" "}
                        Edit
                    </button>
                )}
            </div>
        </div>
    );
}
