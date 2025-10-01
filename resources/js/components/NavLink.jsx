// components/InnerBanner.jsx
import { useLocation } from "react-router-dom";

export default function NavLink({ href, children }) {
    const location = useLocation();
    const isActive = location.pathname === href;

    return (
        <a
            href={href}
            className={`relative font-medium transition-all hover:text-blue-600 ${
                isActive ? "text-blue-600" : "text-gray-800"
            }`}
        >
            {children}
            {/* Hover / Active underline - only on larger screens */}
            <span
                className={`hidden md:block absolute left-0 -bottom-1 h-[2px] bg-blue-600 transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                }`}
            ></span>
        </a>
    );
}
