import React, { useState } from 'react';
import { useSetting } from "../components/SettingContext";
import logo from '../assets/ncmd-election-logo.png';
import { HomeIcon, SettingsIcon, LogoutIcon, ReportIcon, UserIcon, CaretIcon } from '../assets/icons/icon';
import { Link, useNavigate } from 'react-router-dom';
import api from "../api/axios"; 

export default function AdminSidebar({ isOpen }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const navigate = useNavigate();
  const siteName = useSetting("site_name", "");
  const siteLogo = useSetting("site_logo", "");
  
  const handleLogout = async () => {
    try {
      await api.post(
        "/logout",
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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
    <div className={`fixed left-0 top-0 h-full z-50 sidebar-menu 
        transition-transform bg-white shadow-lg 
        ${isOpen ? 'open' : ''}
      `}>
      <a className="flex items-center justify-center" href='/'  >
            <img 
              className={`object-contain py-4 h-[120px]  
                ${isOpen ? 'w-100' : 'w-[36px]'}
              `}
              src={siteLogo ? `/storage/${siteLogo}` : logo} alt={siteName}/>
          </a>
      
      <div className='nav-menu flex flex-col justify-between h-screen'>
        <ul>
          <li className="mb-5">
            <Link to="/admin" className="flex items-center py-4 px-3">
              <HomeIcon />
              <span 
                className={`text-sm 
                ${isOpen ? '' : 'hidden'}
              `}
                >Dashboard</span>
            </Link>
          </li>
          <li className="mb-5"
            onMouseEnter={() => !isOpen && toggleDropdown("candidates")}
            onMouseLeave={() => !isOpen && toggleDropdown(null)}
          >
            <div className='flex items-center justify-between'>
              <Link 
                to="/admin/candidate" 
                className="flex items-center py-4 px-3 sidebar-dropdown-toggle flex-1"
                >
                <UserIcon />
                <span 
                  className={`text-sm 
                  ${isOpen ? '' : 'hidden'}
                `}
                  >Candidates</span>
              </Link>
              <button 
                 className={`btn-submenu flex-none h-full cursor-pointer 
                    ${!isOpen ? "hidden" : ""} 
                    ${openDropdown === "candidates" ? "open-submenu" : ""}
                `}
                onClick={() => toggleDropdown("candidates")}
                >
                <CaretIcon />
              </button>
            </div>
            <ul 
              className={`submenu mt-2 transition-all duration-300 
               ${openDropdown === "candidates" ? "block" : "hidden"}
              `}
              >
              <li className="mb-4 flex">
                <Link to="/admin/candidate/position" className="py-4 px-8 flex-1">
                  <span>Positions</span>
                </Link>
              </li>
              <li className="mb-4 flex">
                <Link to="/admin/candidate/churches" className="py-4 px-8 flex-1">
                  <span>Churches</span>
                </Link>
              </li>
                <li className="mb-4 flex">
                <Link to="/admin/candidate/questions" className=" py-4 px-8 flex-1">
                  <span>Questions</span>
                </Link>
              </li>
            </ul>
          </li>
          <li className="mb-5"
            onMouseEnter={() => !isOpen && toggleDropdown("voter")}
            onMouseLeave={() => !isOpen && toggleDropdown(null)}
          >
            <Link to="/admin/voters" className="flex items-center py-4 px-3 sidebar-dropdown-toggle flex-1">
              <ReportIcon />
               <span 
                className={`text-sm 
                ${isOpen ? '' : 'hidden'}
              `}
                >Voter</span>
            </Link>
            <button 
                 className={`btn-submenu flex-none h-full cursor-pointer 
                    ${!isOpen ? "hidden" : ""} 
                    ${openDropdown === "voter" ? "open-submenu" : ""}
                `}
                onClick={() => toggleDropdown("voter")}
                ></button>
                 <ul 
              className={`submenu mt-2 transition-all duration-300 
               ${openDropdown === "voter" ? "block" : "hidden"}
              `}
              >
              <li className="mb-4 flex">
                <Link to="/admin/voters/import" className="py-4 px-8 flex-1">
                  <span>Import Bulk</span>
                </Link>
              </li>
            </ul>
          </li>
       </ul>
       <ul>
        <li className="mb-5">
          <Link to="/admin/settings" className="flex  items-center py-4 px-3">
              <SettingsIcon />
              <span 
                className={`text-sm 
                ${isOpen ? '' : 'hidden'}
              `}
                >Settings</span>
          </Link>
        </li>
        <li>
          <a onClick={handleLogout} className="flex  items-center py-4 px-3 cursor-pointer" target="_blank">
            <LogoutIcon />
            <span 
                className={`text-sm 
                ${isOpen ? '' : 'hidden'}
              `}
                >Logout</span>
          </a>
        </li>
      </ul>
      </div>
    </div>
  );
}
