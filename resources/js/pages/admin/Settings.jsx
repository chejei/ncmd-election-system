import React, { useEffect, useState } from "react";
import Tabs from "../../components/Tabs";
import axios from "../../api/axios";
import { UploadIcon } from "../../assets/icons/icon";
import Swal from "sweetalert2";

const tabItems = [
    { key: "settings", label: "General Settings" },
    { key: "account", label: "Account Settings" },
    { key: "election", label: "Election Settings" },
    // { key: "backup", label: "Backup" },
];
export default function Settings() {
    const [activeTab, setActiveTab] = useState("settings");
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [originalSettings, setOriginalSettings] = useState({});
    const [userFormData, setUserFormData] = useState({
        username: "",
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        axios.get("/api/settings").then((res) => {
            const data = res.data;
            if (data.site_logo) {
                data.site_logo = `/storage/${data.site_logo}`;
            }
            setLoading(false);
            setSettings(data);
            setOriginalSettings(data);
        });

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const currentUser = JSON.parse(storedUser);
            setUserFormData((prev) => ({
                ...prev,
                username: currentUser.username || "",
            }));
        }
    }, []);

    // Handle text/date inputs
    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;

        setSettings((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Handle file uploads (convert to base64)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSettings((prev) => ({
                    ...prev,
                    site_logo: reader.result, // base64 directly
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const hasChanges = Object.keys(settings).some(
            (key) => settings[key] !== (originalSettings[key] ?? "")
        );

        if (!hasChanges) {
            Swal.fire({
                icon: "info",
                title: "No Changes",
                text: "Nothing to save. Please make some changes first.",
            });
            return;
        }

        try {
            await axios.post("/api/settings", settings, {
                headers: { "Content-Type": "application/json" },
            });

            setOriginalSettings({ ...settings });

            Swal.fire({
                icon: "success",
                title: "Saved!",
                text: "Settings updated successfully",
                timer: 2000,
                showConfirmButton: false,
            });
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to save settings",
            });
        } finally {
            setLoading(true);
        }
    };

    const handleChangeUser = (e) => {
        const { name, value } = e.target;
        setUserFormData({ ...userFormData, [name]: value });
    };

    const handleSubmitUser = async (e) => {
        e.preventDefault();

        if (
            userFormData.password &&
            userFormData.password !== userFormData.password_confirmation
        ) {
            Swal.fire({
                icon: "error",
                title: "Password Mismatch",
                text: "Password and confirmation do not match.",
            });
            return;
        }

        try {
            await axios.post("/api/account/update", userFormData, {
                headers: { "Content-Type": "application/json" },
            });

            Swal.fire({
                icon: "success",
                title: "Updated!",
                text: "Your account has been updated successfully",
                timer: 2000,
                showConfirmButton: false,
            });

            setUserFormData({
                ...userFormData,
                password: "",
                password_confirmation: "",
            }); // reset only passwords
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.response?.data?.message || "Failed to update account",
            });
        }
    };

    const handleBackup = async () => {
        try {
            const response = await axios.get("/api/backup", {
                responseType: "blob", // important for file download
            });

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "election_backup.zip");
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Backup failed", error);
            alert("Backup failed. Check server logs.");
        }
    };

    const getPasswordStrength = (password) => {
        let score = 0;
        if (password.length >= 6) score++;
        if (password.length >= 10) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        if (score === 0) return { label: "", color: "" };
        if (score <= 2) return { label: "Weak", color: "bg-red-500" };
        if (score <= 4) return { label: "Moderate", color: "bg-yellow-500" };
        return { label: "Strong", color: "bg-green-500" };
    };

    return (
        <>
            <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md lg:col-span-2">
                <Tabs
                    tabs={tabItems}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />
                <div>
                    {activeTab === "settings" && (
                        <div className="p-4">
                            <form
                                onSubmit={handleSubmit}
                                className="grid grid-cols-1 sm:grid-cols-2 sm:gap-4"
                            >
                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Election Name
                                    </label>
                                    <input
                                        type="text"
                                        name="site_name"
                                        value={settings.site_name || ""}
                                        onChange={handleChange}
                                        required
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>
                                <div className="mb-3 sm:row-span-3">
                                    <div className="flex items-center justify-center w-full">
                                        <label
                                            htmlFor="site_logo"
                                            className="flex flex-col items-center justify-center w-full h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                                        >
                                            {settings.site_logo ? (
                                                <img
                                                    src={settings.site_logo}
                                                    alt="Preview"
                                                    className="h-[297px] w-full object-contain rounded"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <UploadIcon />
                                                    <p className="mb-2 text-sm text-gray-500">
                                                        <span className="font-semibold">
                                                            Click to upload
                                                        </span>
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        SVG, PNG, JPG or GIF
                                                    </p>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                id="site_logo"
                                                name="site_logo"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        name="start_date"
                                        value={settings.start_date || ""}
                                        onChange={handleChange}
                                        required
                                        max={settings.end_date || ""}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        name="end_date"
                                        value={settings.end_date || ""}
                                        onChange={handleChange}
                                        required
                                        min={settings.start_date || ""}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>
                                <div className="col-span-1 sm:col-span-2 flex justify-end">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-800 cursor-pointer"
                                    >
                                        Save Election
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                    {activeTab === "account" && (
                        <div className="p-4">
                            <form
                                onSubmit={handleSubmitUser}
                                className="space-y-4 max-w-md"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={userFormData.username}
                                        onChange={handleChangeUser}
                                        required
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>
                                <span className="text-sm text-red-600 italic">
                                    <span className="font-semibold">Note:</span>{" "}
                                    Leave the password field empty if you don’t
                                    want to make any changes.
                                </span>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={userFormData.password}
                                        onChange={handleChangeUser}
                                        placeholder="••••••••"
                                        className="w-full border rounded px-3 py-2"
                                    />
                                    {/* ✅ Password Strength Indicator */}
                                    {userFormData.password &&
                                        (() => {
                                            const strength =
                                                getPasswordStrength(
                                                    userFormData.password
                                                );
                                            return (
                                                <div className="mt-1">
                                                    <div className="w-full h-2 bg-gray-200 rounded">
                                                        <div
                                                            className={`h-2 rounded ${strength.color}`}
                                                            style={{
                                                                width: `${
                                                                    strength.label ===
                                                                    "Weak"
                                                                        ? 33
                                                                        : strength.label ===
                                                                          "Moderate"
                                                                        ? 66
                                                                        : 100
                                                                }%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <p
                                                        className={`text-sm mt-1 ${strength.color.replace(
                                                            "bg-",
                                                            "text-"
                                                        )}`}
                                                    >
                                                        {strength.label}
                                                    </p>
                                                </div>
                                            );
                                        })()}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        name="password_confirmation"
                                        placeholder="••••••••"
                                        value={
                                            userFormData.password_confirmation
                                        }
                                        onChange={handleChangeUser}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 cursor-pointer"
                                >
                                    Save Changes
                                </button>
                            </form>
                        </div>
                    )}
                    {activeTab === "backup" && (
                        <div className="p-4">
                            <button
                                onClick={handleBackup}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-800 cursor-pointer"
                            >
                                Backup Now
                            </button>
                        </div>
                    )}
                    {activeTab === "election" && (
                        <div className="p-4">
                            <form
                                onSubmit={handleSubmit}
                                className="grid grid-cols-1 sm:grid-cols-2 sm:gap-4"
                            >
                                <div className="flex items-center ">
                                    <label className="block text-md font-medium text-gray-700">
                                        Allow voters to proceed with voting
                                    </label>
                                </div>
                                <div className="">
                                    <input
                                        type="checkbox"
                                        className="toggle-switch"
                                        id="allow-voting-checkbox"
                                        name="is_voting_open"
                                        checked={!!settings.is_voting_open}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="allow-voting-checkbox">
                                        <span className="sw"></span>
                                    </label>
                                </div>
                                <div className="flex items-center ">
                                    <label className="block text-md font-medium text-gray-700">
                                        Show result on (percentage)
                                    </label>
                                </div>
                                <div className="">
                                    <input
                                        type="number"
                                        name="show_result"
                                        value={settings.show_result || ""}
                                        onChange={handleChange}
                                        placeholder="Enter percentage to show result"
                                        required
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>

                                <div className="col-span-1 sm:col-span-2 flex justify-end">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-800 cursor-pointer"
                                    >
                                        Save Election
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
