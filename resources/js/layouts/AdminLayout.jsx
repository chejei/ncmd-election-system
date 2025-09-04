// AdminLayout.jsx
import { useState, useEffect } from "react";
import { Outlet, useLocation, matchPath } from "react-router-dom";
import { useSetting } from "../components/SettingContext";
import Header from "../components/Header";
import AdminSidebar from "../components/AdminSidebar";
import Breadcrumbs from "../components/Breadcrumbs";
import routeTitles from "../routes/routeTitles";

function usePageTitle() {
    const location = useLocation();

    let heading = "Page";
    for (const path in routeTitles) {
        const match = matchPath({ path, end: true }, location.pathname);
        if (match) {
            heading = routeTitles[path];
            break;
        }
    }

    return heading;
}

export default function AdminLayout({ children }) {
    const location = useLocation();
    const heading = usePageTitle();
    const siteName = useSetting("site_name", "");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };
    useEffect(() => {
        if (location.pathname === "/admin") {
            document.title = `${siteName} | Admin Portal`;
        } else {
            document.title = `${heading}`;
        }
    }, [heading, location.pathname]);

    return (
        <>
            <AdminSidebar isOpen={isSidebarOpen} />
            <main
                className={`w-full bg-gray-200 min-h-screen transition-all main
        ${
            isSidebarOpen
                ? "md:w-[calc(100%-400px)] md:ml-100"
                : "pl-[52px] md:ml-0"
        }
      `}
            >
                <Header
                    toggleSidebar={toggleSidebar}
                    isSidebarOpen={isSidebarOpen}
                />
                <div className="p-6 heading-title">
                    <h1>{heading}</h1>
                    <Breadcrumbs />
                </div>
                <div className="p-6">
                    <Outlet />
                </div>
            </main>
        </>
    );
}
