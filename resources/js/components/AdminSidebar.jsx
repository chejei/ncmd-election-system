import React, { useState } from "react";
import Swal from "sweetalert2";
import { useSetting } from "../components/SettingContext";
import logo from "../assets/ncmd-election-logo.png";
import {
    HomeIcon,
    SettingsIcon,
    LogoutIcon,
    ReportIcon,
    UserIcon,
    CaretIcon,
} from "../assets/icons/icon";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function AdminSidebar({ isOpen, toggleSidebar, isSidebarOpen }) {
    const [openDropdown, setOpenDropdown] = useState(null);
    const navigate = useNavigate();
    const siteName = useSetting("site_name", "");
    const siteLogo = useSetting("site_logo", "");

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out of your session.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e7000b",
            cancelButtonColor: "#2b7fff",
            confirmButtonText: "Yes, logout",
        });

        if (!result.isConfirmed) return; // If canceled, stop here

        try {
            await api.post(
                "/logout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("user");
            navigate("/login");
        }
    };

    const toggleDropdown = (menu) => {
        setOpenDropdown(openDropdown === menu ? null : menu);
    };

    return (
        <div
            className={`fixed left-0 top-0 h-full z-50 sidebar-menu 
        transition-transform bg-white shadow-lg 
        ${isOpen ? "open" : ""}
      `}
        >
            <div className="flex items-center justify-center">
                <a className="flex items-center justify-center" href="/">
                    <img
                        className={`object-contain py-4 h-[90px] md:h-[120px]  
                        ${isOpen ? "w-100" : "w-[36px]"}
                    `}
                        src={siteLogo ? `/storage/${siteLogo}` : logo}
                        alt={siteName}
                        title={siteName}
                    />
                </a>
                <div
                    onClick={toggleSidebar}
                    className={`
                                sidebar-toggle cursor-pointer mr-2
                                ${isSidebarOpen ? "open" : "hidden"}
                                md:hidden                    
                            `}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            <div className="nav-menu flex flex-col justify-between h-screen">
                <ul>
                    <li className="mb-5">
                        <Link
                            to="/admin"
                            className="flex items-center py-4 px-3 group"
                        >
                            <HomeIcon />
                            <span
                                className={`text-sm 
                                ${isOpen ? "" : "hidden"}`}
                            >
                                Dashboard
                            </span>
                            {!isOpen && (
                                <span className="absolute left-full ml-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition">
                                    Dashboard
                                </span>
                            )}
                        </Link>
                    </li>
                    <li
                        className="mb-5"
                        onMouseEnter={() =>
                            !isOpen && toggleDropdown("candidates")
                        }
                        onMouseLeave={() => !isOpen && toggleDropdown(null)}
                    >
                        <div className="flex items-center justify-between">
                            <Link
                                to="/admin/candidate"
                                className="flex items-center py-4 px-3 sidebar-dropdown-toggle flex-1 group"
                            >
                                <UserIcon />
                                <span
                                    className={`text-sm 
                                    ${isOpen ? "" : "hidden"}
                                  `}
                                >
                                    Candidates
                                </span>
                                {!isOpen && (
                                    <span className="absolute left-0 top-[-20px] ml-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition">
                                        Candidates
                                    </span>
                                )}
                            </Link>
                            <button
                                className={`btn-submenu flex-none h-full cursor-pointer 
                                  ${!isOpen ? "hidden" : ""} 
                                  ${
                                      openDropdown === "candidates"
                                          ? "open-submenu"
                                          : ""
                                  }
                              `}
                                onClick={() => toggleDropdown("candidates")}
                            >
                                <CaretIcon />
                            </button>
                        </div>
                        <ul
                            className={`submenu mt-2 transition-all duration-300 
                                        ${
                                            openDropdown === "candidates"
                                                ? "block"
                                                : "hidden"
                                        }
                                        `}
                        >
                            <li className="mb-4 flex">
                                <Link
                                    to="/admin/candidate/applicants"
                                    className="py-4 px-8 flex-1"
                                >
                                    <span>Applicants</span>
                                </Link>
                            </li>
                            <li className="mb-4 flex">
                                <Link
                                    to="/admin/candidate/position"
                                    className="py-4 px-8 flex-1"
                                >
                                    <span>Positions</span>
                                </Link>
                            </li>
                            <li className="mb-4 flex">
                                <Link
                                    to="/admin/candidate/churches"
                                    className="py-4 px-8 flex-1"
                                >
                                    <span>Churches</span>
                                </Link>
                            </li>
                            <li className="mb-4 flex">
                                <Link
                                    to="/admin/candidate/questions"
                                    className=" py-4 px-8 flex-1"
                                >
                                    <span>Questions</span>
                                </Link>
                            </li>
                        </ul>
                    </li>
                    <li
                        className="mb-5"
                        onMouseEnter={() => !isOpen && toggleDropdown("voter")}
                        onMouseLeave={() => !isOpen && toggleDropdown(null)}
                    >
                        <div className="flex items-center justify-between">
                            <Link
                                to="/admin/voters"
                                className="flex items-center py-4 px-3 sidebar-dropdown-toggle flex-1 group"
                            >
                                <ReportIcon />
                                <span
                                    className={`text-sm 
                                    ${isOpen ? "" : "hidden"}
                                    `}
                                >
                                    Voter
                                </span>
                                {!isOpen && (
                                    <span className="absolute left-0 top-[-20px] ml-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition">
                                        Voter
                                    </span>
                                )}
                            </Link>
                            <button
                                className={`btn-submenu flex-none h-full cursor-pointer 
                                    ${!isOpen ? "hidden" : ""} 
                                    ${
                                        openDropdown === "voter"
                                            ? "open-submenu"
                                            : ""
                                    }
                                `}
                                onClick={() => toggleDropdown("voter")}
                            >
                                <CaretIcon />
                            </button>
                        </div>
                        <ul
                            className={`submenu mt-2 transition-all duration-300 
                            ${openDropdown === "voter" ? "block" : "hidden"}
                            `}
                        >
                            <li className="mb-4 flex">
                                <Link
                                    to="/admin/voters/import"
                                    className="py-4 px-8 flex-1"
                                >
                                    <span>Import Bulk</span>
                                </Link>
                            </li>
                        </ul>
                    </li>
                </ul>
                <ul>
                    <li className="mb-5">
                        <Link
                            to="/admin/settings"
                            className="flex  items-center py-4 px-3 group"
                        >
                            <SettingsIcon />
                            <span
                                className={`text-sm 
                                  ${isOpen ? "" : "hidden"}
                                `}
                            >
                                Settings
                            </span>
                            {!isOpen && (
                                <span className="absolute left-full ml-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition">
                                    Settings
                                </span>
                            )}
                        </Link>
                    </li>
                    <li>
                        <a
                            onClick={handleLogout}
                            className="flex  items-center py-4 px-3 cursor-pointer group relative"
                            target="_blank"
                        >
                            <LogoutIcon />
                            <span
                                className={`text-sm 
                                  ${isOpen ? "" : "hidden"}
                                `}
                            >
                                Logout
                            </span>
                            {!isOpen && (
                                <span className="absolute left-full ml-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition">
                                    Logout
                                </span>
                            )}
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
}
