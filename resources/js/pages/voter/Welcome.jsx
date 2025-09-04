import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import Swal from "sweetalert2";

export default function WelcomePage() {
    const [agree, setAgree] = useState(false);
    const [loading, setLoading] = useState(true);
    const [voter, setVoter] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const voterLocal = JSON.parse(localStorage.getItem("user"));
        const voterId = voterLocal?.id;

        if (!voterId) {
            navigate("/voter"); // or login page
            return;
        }

        const fetchVoter = async (voterId) => {
            try {
                const res = await axios.get(`/voters/${voterId}`);
                setVoter(res.data.data);
            } catch (error) {
                Swal.fire(
                    "Error",
                    "Failed to load voter details",
                    "error"
                ).then(() => {
                    navigate("/voter");
                });
            } finally {
                setLoading(false);
            }
        };
        fetchVoter(voterId);
    }, []);

    const handleStartVoting = () => {
        if (agree) {
            navigate("/vote/ballot");
        } else {
            Swal.fire({
                icon: "warning",
                title: "Agreement Required",
                text: "You must agree to the guidelines and terms before proceeding.",
                confirmButtonText: "OK",
            });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/voter");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
                <p>Loading voter info...</p>
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

    return (
        <>
            {!voter.restrict ? (
                <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
                    <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8">
                        {/* Welcome Message */}
                        <h2 className="text-3xl font-bold text-gray-800">
                            Welcome, {voter?.full_name || "Voter"}!
                        </h2>
                        <p className="text-gray-600 mb-6">
                            You are now logged in as a registered voter. Please
                            read the following carefully before proceeding.
                        </p>

                        {/* Warning */}
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-2 mb-6 rounded">
                            <p className="text-xs">
                                <span className="font-semibold">Warning:</span>{" "}
                                If you are not the rightful owner of this
                                account, please{" "}
                                <a
                                    onClick={handleLogout}
                                    className="cursor-pointer text-blue-600 hover:underline"
                                >
                                    logout
                                </a>{" "}
                                immediately.
                            </p>
                        </div>

                        {/* Agreement */}
                        <div className="bg-blue-50 p-4 rounded mb-6">
                            <p className="text-gray-700 mb-2">
                                By participating in this election, you agree to:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 space-y-1">
                                <li>
                                    Fill out the ballot prayerfully and wisely.
                                </li>
                                <li>
                                    Vote personally and freely, without anyone
                                    forcing you.
                                </li>
                                <li>
                                    Respect the integrity and confidentiality of
                                    the election process.
                                </li>
                            </ul>
                        </div>

                        {/* Checkbox Agreement */}
                        <div className="flex items-start mb-6">
                            <input
                                type="checkbox"
                                id="agree"
                                checked={agree}
                                onChange={() => setAgree(!agree)}
                                className="mt-1 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                            <label
                                htmlFor="agree"
                                className="ml-3 text-gray-700"
                            >
                                I have read and agree to the{" "}
                                <a
                                    href="/guidelines"
                                    className="text-blue-600 hover:underline"
                                >
                                    Election Guidelines
                                </a>{" "}
                                and{" "}
                                <a
                                    href="/terms-and-conditions"
                                    className="text-blue-600 hover:underline"
                                >
                                    Terms & Conditions
                                </a>
                                .
                            </label>
                        </div>

                        {/* Start Voting Button */}
                        <button
                            onClick={handleStartVoting}
                            className={`w-full py-3 px-6 rounded-lg font-semibold shadow-md 
              ${
                  agree
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-400 text-gray-200 cursor-not-allowed"
              }`}
                            disabled={!agree}
                        >
                            Start Voting
                        </button>
                    </div>
                </div>
            ) : (
                <section
                    id="guidelines"
                    className="bg-white text-black gradiant-articles"
                >
                    <div className="max-w-screen-xl sm:px-7 px-4 py-10 lg:py-20 mx-auto">
                        <div>
                            <h2 className="text-xl font-bold  mb-3 sm:text-2xl">
                                Voter Information
                            </h2>
                            <h3 className="text-xl font-bold leading-none text-gray-900">
                                {voter.full_name || "-"}
                            </h3>
                            <div className="py-4 flex-1">
                                <dl className="mb-2">
                                    <dt className="font-semibold text-gray-900 ">
                                        Email
                                    </dt>
                                    <dd className="text-gray-500 ">
                                        {voter.email || "-"}
                                    </dd>
                                </dl>
                                <dl className="mb-2">
                                    <dt className="font-semibold text-gray-900 ">
                                        Phone Number
                                    </dt>
                                    <dd className="text-gray-500 ">
                                        {voter.phone_number || "-"}
                                    </dd>
                                </dl>
                                <dl className="mb-2">
                                    <dt className="font-semibold text-gray-900 ">
                                        Church
                                    </dt>
                                    <dd className="text-gray-500 ">
                                        {voter.church_name || "-"}
                                    </dd>
                                </dl>
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
                                            {Object.entries(
                                                groupedPositions
                                            ).map(
                                                (
                                                    [position, candidates],
                                                    index
                                                ) => (
                                                    <tr key={index}>
                                                        <td className="px-4 py-2 border-b">
                                                            {position}
                                                        </td>
                                                        <td className="px-4 py-2 border-b">
                                                            {candidates.map(
                                                                (c, i) => (
                                                                    <p key={i}>
                                                                        {c}
                                                                    </p>
                                                                )
                                                            )}
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
                        <div className="flex justify-start mt-6">
                            <button
                                onClick={handleLogout}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                {" "}
                                Logout
                            </button>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
