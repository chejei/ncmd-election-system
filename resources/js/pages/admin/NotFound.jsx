import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-6">Page Not Found</p>
            <Link
                to="/"
                className="btn font-medium inline-block bg-blue-500 text-white py-2 px-4 rounded-3xl hover:bg-blue-800 cursor-pointer"
            >
                Go Home
            </Link>
        </div>
    );
}
