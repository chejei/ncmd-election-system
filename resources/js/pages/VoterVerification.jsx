import React, { useEffect, useState } from "react";
import { useSetting } from "../components/SettingContext";
import { formatDate } from "../utils/formatDate";
import InnerBanner from "../components/InnerBanner";
import axios from "../api/axios";
import ctaOverlay from "../assets/images/cta-img.jpg";
import Swal from "sweetalert2";

export default function VoterVerification() {
    const siteName = useSetting("site_name", "");
    const startDate = formatDate(useSetting("start_date", ""));
    const endDate = formatDate(useSetting("end_date", ""));
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [registrationNum, setRegistrationNum] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFieldErrors({});
        setError("");

        const errors = {};

        if (!lastName.trim()) errors.lastName = "Last name is required.";
        if (!firstName.trim()) errors.firstName = "First name is required.";
        if (!registrationNum.trim())
            errors.registrationNum = "Registration Number is required.";

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        try {
            const res = await axios.post("/api/voter/verify", {
                last_name: lastName,
                first_name: firstName,
                registration_num: registrationNum,
            });

            const pinCode = res.data.pin_code;

            // Show PIN with timer & progress bar
            Swal.fire({
                icon: "success",
                title: "Verification Successful",
                html: `
                <p><strong>Your Voter PIN Code:</strong></p>
                <h2 style="letter-spacing: 3px;">${pinCode}</h2>
                <p class="text-sm text-gray-500 mt-2">
                    This will automatically close for your security.
                </p>
            `,
                timer: 10000, // 10 seconds
                timerProgressBar: true,
                didClose: () => {
                    // ✅ Reset form values
                    setLastName("");
                    setFirstName("");
                    setRegistrationNum("");

                    // ✅ Clear field errors
                    setFieldErrors({
                        lastName: "",
                        firstName: "",
                        registrationNum: "",
                    });
                },
            });
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
                console.log(error);
                setError(error.response?.data?.message || "Login failed");
            }
        }
    };
    return (
        <>
            <InnerBanner title="Voter Verification" />
            <section id="" className="bg-white text-black gradiant-articles">
                <div className="max-w-screen-xl sm:px-7 px-4 py-10 lg:py-20 mx-auto">
                    <div className="bg-yellow-50 border border-yellow-400 text-yellow-900 p-4 rounded-md mb-4">
                        <span className="font-semibold">Important Notice:</span>{" "}
                        <p className="text-sm">
                            This page is provided to help registered voters
                            retrieve their own voter PIN code using their
                            personal registration details.
                        </p>
                        <div className="">
                            <p className="text-md font-semibold mb-2 mt-3">
                                Please be advised that:
                            </p>
                            <ul className="list-disc pl-4">
                                <li>
                                    Your voter PIN is confidential and must not
                                    be shared with anyone.
                                </li>
                                <li>
                                    Sharing your PIN may expose your personal
                                    data and may allow unauthorized access to
                                    your voter record.
                                </li>
                                <li>
                                    This page grants access only to your own
                                    voter information, based on the details you
                                    voluntarily provide.
                                </li>
                            </ul>
                            <p className="text-md font-semibold mb-2 mt-3">
                                By continuing, you confirm that:
                            </p>
                            <ul className="list-disc pl-4">
                                <li>
                                    You are retrieving your own voter
                                    information.
                                </li>
                                <li>
                                    You give full consent to access and use your
                                    data through this page.
                                </li>
                                <li>
                                    You accept full responsibility for keeping
                                    your voter PIN secure.
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="sm:max-w-md p-6  mx-auto">
                        {error && (
                            <div className="small-text text-red-500 mb-3">
                                <div
                                    dangerouslySetInnerHTML={{ __html: error }}
                                />
                            </div>
                        )}

                        <form
                            className="space-y-4 md:space-y-6"
                            onSubmit={handleSubmit}
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
                                className={`${
                                    fieldErrors.firstName ? "has-error" : ""
                                }`}
                            >
                                <label className="block mb-2 text-sm font-medium text-gray-900">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg p-2.5"
                                    placeholder="First Name"
                                    value={firstName}
                                    onChange={(e) => {
                                        setFirstName(e.target.value);
                                        if (fieldErrors.firstName) {
                                            setFieldErrors((prev) => ({
                                                ...prev,
                                                firstName: "",
                                            }));
                                        }
                                    }}
                                />
                                {fieldErrors.firstName && (
                                    <p className="text-red-500 error-notes">
                                        {fieldErrors.firstName}
                                    </p>
                                )}
                            </div>

                            <div
                                className={`${
                                    fieldErrors.registrationNum
                                        ? "has-error"
                                        : ""
                                }`}
                            >
                                <label className="block mb-2 text-sm font-medium text-gray-900">
                                    Registration Number
                                </label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg p-2.5"
                                    placeholder="Registration Number"
                                    value={registrationNum}
                                    onChange={(e) => {
                                        setRegistrationNum(e.target.value);
                                        if (fieldErrors.registrationNum) {
                                            setFieldErrors((prev) => ({
                                                ...prev,
                                                registrationNum: "",
                                            }));
                                        }
                                    }}
                                />
                                {fieldErrors.registrationNum && (
                                    <p className="text-red-500 error-notes">
                                        {fieldErrors.registrationNum}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white rounded-lg py-2.5 font-medium hover:bg-blue-800 cursor-pointer"
                            >
                                Verify Voter
                            </button>
                        </form>
                    </div>
                </div>
            </section>
            <section
                id="CTA"
                className="bg-gradient-to-b from-black to-slate-950 overlay-wrapper"
            >
                <div className="max-w-screen-xl sm:px-7 px-4 py-10 lg:py-20 mx-auto overlay-text">
                    <div className="p-10 lg:p-20 bg-gradient-to-b from-white to-gray-300 rounded-lg">
                        <div className="lg:grid lg:grid-cols-12 items-center">
                            <div className="text-black lg:col-span-8 flex flex-col">
                                <h2 className="font-semibold text-gray-400 lg:col-span-12">
                                    Be Part of Choosing Servant Leaders.
                                </h2>
                                <h2 className="font-medium text-3xl md:text-4xl lg:text-7xl">
                                    Don't wait,
                                    <br /> your{" "}
                                    <span className="text-red-500 font-bold">
                                        vote
                                    </span>{" "}
                                    matters!
                                </h2>
                                <span className="text-gray-600 pt-4 text-[18px] leading-[24px] md:text-[20px] md:leading-[26px]">
                                    Every vote is a step toward raising leaders
                                    who serve first, lead with compassion, and
                                    guide with faith.
                                </span>
                            </div>
                            <div className="mt-10 lg:mt-0 lg:col-start-9 lg:col-span-4 flex">
                                <a
                                    href="/vote"
                                    className="ml-0 lg:ml-auto bg-red-500 text-white font-bold py-2 px-8 rounded-3xl text-xl sm:text-2xl hover:bg-blue-500"
                                >
                                    Vote Now
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="overlay-img h-[100%]">
                    <img
                        className="opacity-75 object-cover sm:w-full h-[100%]"
                        src={ctaOverlay}
                    />
                </div>
            </section>
        </>
    );
}
