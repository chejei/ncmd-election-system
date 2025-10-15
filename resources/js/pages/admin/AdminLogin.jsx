import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [generalError, setGeneralError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Separate field errors & general errors
        const newErrors = {};
        setGeneralError("");

        if (!username.trim()) newErrors.username = "Username is required";
        if (!password.trim()) newErrors.password = "Password is required";

        setFieldErrors(newErrors);

        // Stop if there are validation errors
        if (Object.keys(newErrors).length > 0) return;

        try {
            const res = await axios.post("/api/login", { username, password });
            localStorage.setItem("user", JSON.stringify(res.data.user));
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.role);
            navigate("/admin");
        } catch (err) {
            setGeneralError(err.response?.data?.message || "Login failed");
        }
    };
    return (
        <>
            <section className="bg-gray-50">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-[80vh] md:h-screen lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                                Admin Login
                            </h1>
                            {generalError && (
                                <p
                                    className="small-text"
                                    style={{ color: "red" }}
                                >
                                    {generalError}
                                </p>
                            )}

                            <form
                                className="space-y-4 md:space-y-6"
                                onSubmit={handleSubmit}
                            >
                                <div
                                    className={`${
                                        fieldErrors.username ? "has-error" : ""
                                    }`}
                                >
                                    <label
                                        htmlFor="username"
                                        className="block mb-2 text-sm font-medium text-gray-900 "
                                    >
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        name="username"
                                        id="username"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        required=""
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) => {
                                            setUsername(e.target.value);
                                            if (fieldErrors.username) {
                                                setFieldErrors((prev) => ({
                                                    ...prev,
                                                    username: "",
                                                })); // or delete field
                                            }
                                        }}
                                        tabIndex={1}
                                    />
                                    {fieldErrors.username && (
                                        <p className="text-red-500 error-notes">
                                            {fieldErrors.username}
                                        </p>
                                    )}
                                </div>
                                <div
                                    className={`${
                                        fieldErrors.password ? "has-error" : ""
                                    }`}
                                >
                                    <label
                                        htmlFor="password"
                                        className="block mb-2 text-sm font-medium text-gray-900 "
                                    >
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        required=""
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            if (fieldErrors.password) {
                                                setFieldErrors((prev) => ({
                                                    ...prev,
                                                    password: "",
                                                }));
                                            }
                                        }}
                                        tabIndex={2}
                                    />
                                    {fieldErrors.password && (
                                        <p className="text-red-500 error-notes">
                                            {fieldErrors.password}
                                        </p>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    tabIndex={3}
                                    className="w-full bg-blue-500 hover:bg-blue-800 text-white  focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer"
                                >
                                    Sign in
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
