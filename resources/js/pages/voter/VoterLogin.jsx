import { useState, useRef } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { useSetting } from "../../components/SettingContext";
import { formatDate } from "../../utils/formatDate";
export default function VoterLogin() {
    const inputRefs = useRef([]);
    const [lastName, setLastName] = useState("");
    const [pinDigits, setPinDigits] = useState(["", "", "", "", "", ""]); // 6-digit PIN
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const navigate = useNavigate();
    const startDateRaw = useSetting("start_date", null);
    const endDateRaw = useSetting("end_date", null);
    const today = new Date();
    const startDateObj = startDateRaw ? new Date(startDateRaw) : null;
    const endDateObj = endDateRaw ? new Date(endDateRaw) : null;

    // Determine voting status
    const hasVotingStarted = startDateObj ? today >= startDateObj : false;
    const hasVotingEnded = endDateObj ? today > endDateObj : false;

    if (!hasVotingStarted || hasVotingEnded) {
        return (
            <section className="bg-white flex flex-col items-center text-center justify-center px-4 min-h-[80vh] md:min-h-screen">
                <h2 className="text-3xl font-bold text-gray-800">
                    {!hasVotingStarted
                        ? "Voting Not Yet Open"
                        : "Voting Period Has Ended"}
                </h2>
                <p className="text-gray-500 mt-3 mb-4">
                    {!hasVotingStarted && (
                        <>
                            Voting will begin on{" "}
                            <span className="font-medium text-gray-700">
                                {formatDate(startDateObj)}
                            </span>
                            . Please check back later.
                        </>
                    )}
                    {hasVotingEnded && (
                        <>
                            The election period was from{" "}
                            <span className="font-medium text-gray-700">
                                {formatDate(startDateObj)}
                            </span>{" "}
                            to{" "}
                            <span className="font-medium text-gray-700">
                                {formatDate(endDateObj)}
                            </span>
                            . Voting is now closed.
                        </>
                    )}
                </p>
                <div className="flex flex-row gap-4 items-center text-center">
                    <a
                        className="btn font-medium inline-block bg-blue-500 text-white py-2 px-4 rounded-3xl hover:bg-blue-800 cursor-pointer"
                        href="/"
                    >
                        Back to Home
                    </a>
                    <a
                        className="btn font-medium inline-block bg-red-500 text-white py-2 px-4 rounded-3xl hover:bg-blue-800 cursor-pointer"
                        href="/candidates"
                    >
                        Meet the Candidates
                    </a>
                </div>
            </section>
        );
    }

    const handleChange = (value, index) => {
        if (/^\d?$/.test(value)) {
            const newDigits = [...pinDigits];
            newDigits[index] = value;
            setPinDigits(newDigits);

            if (fieldErrors.pin) {
                setFieldErrors((prev) => ({ ...prev, pin: "" }));
            }

            if (value && index < pinDigits.length - 1) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !pinDigits[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setFieldErrors({});
        setError("");

        const pin = pinDigits.join("");
        const errors = {};

        if (!lastName.trim()) errors.lastName = "Last name is required.";
        if (pin.length !== 6) errors.pin = "PIN must be 6 digits.";

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        try {
            const res = await axios.post("/api/voter/login", {
                last_name: lastName,
                pin_code: pin,
            });

            if (res.status === 200) {
                localStorage.setItem("user", JSON.stringify(res.data.voter));
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("role", res.data.role);
                navigate("/vote");
            }
        } catch (error) {
            if (error.response?.data?.errors) {
                const allErrors = Object.values(
                    error.response.data.errors
                ).flat();
                const errorList = `<ul style="text-align: left;">${allErrors
                    .map((err) => `<li>${err}</li>`)
                    .join("")}</ul>`;
                setError(errorList);
            } else {
                setError(error.response?.data?.message || "Login failed");
            }
        }
    };

    return (
        <section className="bg-gray-50">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-[80vh] md:h-screen">
                <div className="w-full bg-white rounded-lg shadow sm:max-w-md p-6">
                    <h1 className="text-xl font-bold text-gray-900 mb-4">
                        Voter Login
                    </h1>

                    {error && (
                        <div className="small-text text-red-500 mb-3">
                            <div dangerouslySetInnerHTML={{ __html: error }} />
                        </div>
                    )}

                    <form
                        className="space-y-4 md:space-y-6"
                        onSubmit={handleLogin}
                    >
                        <div
                            className={`${
                                fieldErrors.lastName ? "has-error" : ""
                            }`}
                        >
                            <label className="block mb-2 text-sm font-medium text-gray-900">
                                Last Name
                            </label>
                            <input
                                type="text"
                                className="w-full border rounded-lg p-2.5"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => {
                                    setLastName(e.target.value);
                                    if (fieldErrors.lastName) {
                                        setFieldErrors((prev) => ({
                                            ...prev,
                                            lastName: "",
                                        }));
                                    }
                                }}
                            />
                            {fieldErrors.lastName && (
                                <p className="text-red-500 error-notes">
                                    {fieldErrors.lastName}
                                </p>
                            )}
                        </div>

                        <div
                            className={`${fieldErrors.pin ? "has-error" : ""}`}
                        >
                            <label className="block mb-2 text-sm font-medium text-gray-900">
                                6-Digit PIN
                            </label>
                            <div className="flex gap-3">
                                {pinDigits.map((digit, index) => (
                                    <input
                                        key={index}
                                        type="password"
                                        placeholder="⚬"
                                        maxLength="1"
                                        value={digit}
                                        ref={(el) =>
                                            (inputRefs.current[index] = el)
                                        }
                                        onChange={(e) =>
                                            handleChange(e.target.value, index)
                                        }
                                        onKeyDown={(e) =>
                                            handleKeyDown(e, index)
                                        }
                                        className="w-10 sm:w-12 h-12 text-center border rounded-lg text-lg focus:ring-blue-500 focus:border-blue-500"
                                    />
                                ))}
                            </div>
                            {fieldErrors.pin && (
                                <p className="text-red-500 error-notes">
                                    {fieldErrors.pin}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white rounded-lg py-2.5 font-medium hover:bg-blue-800 cursor-pointer"
                        >
                            Sign in
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
