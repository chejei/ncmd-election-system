import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, matchPath } from 'react-router-dom';
import { useSetting } from "../components/SettingContext";
import routeTitles from "../routes/routeTitles";
import logo from '../assets/ncmd-election-logo.png';

function usePageTitle() {
  const location = useLocation();

  let heading = 'Page';
  for (const path in routeTitles) {
    const match = matchPath({ path, end: true }, location.pathname);
    if (match) {
      heading = routeTitles[path];
      break;
    }
  }

  return heading;
}
export default function FrontendLayout() {
  const siteName = useSetting("site_name", "");
  const siteLogo = useSetting("site_logo", "");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const heading = usePageTitle();
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/admin") {
      document.title = `${siteName} | Admin Portal`;
    } else {
      document.title = `${heading}`;
    }
  }, [heading, location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    // Run once on mount (in case page loads already wide)
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };
  return (
    <>
      <header className=''>
        <div className="mx-auto sm:px-7 px-4 max-w-screen-xl py-10">
            <nav className="flex px-4 xl:px-0 justify-between items-center" aria-label="Global">
                <a className="text-2xl font-semibold" href="/">
                    <img className='object-contain h-[50px] sm:h-[80px] w-[200px]' src={siteLogo ? `/storage/${siteLogo}` : logo} alt={siteName}/>
                </a>
              <ul className={`flex-row flex-1 items-center justify-end gap-5 nav-menu ml-auto hidden md:flex ${isMenuOpen ? "open" : ""}`}>
                <li>
                  <a className="font-medium" href="/" aria-current="page">
                    Home
                  </a>
                </li>
                <li>
                  <a className="font-medium" href="/candidates" aria-current="page">
                    Candidates
                  </a>
                </li>
                <li>
                  <a className="font-medium" href="/election-result">
                    Election Result
                  </a>
                </li>

                <li>
                  <a
                    className="btn font-medium inline-block ml-0 lg:ml-auto bg-blue-500 text-white py-2 px-4 rounded-3xl hover:bg-blue-600"
                    href="/vote"
                  >
                    Vote Now!
                  </a>
                </li>
              </ul>
              <div
                   onClick={toggleMenu}
                    className={`sidebar-toggle cursor-pointer block md:hidden ${isMenuOpen ? "open" : ""}`}
                    >
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </nav>
        </div>
      </header>
      <Outlet />
      <footer className="bg-white">
          <div className="max-w-screen-xl sm:px-7 px-4 py-10 lg:py-20 mx-auto">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4">
                 
                  <div className="flex flex-col sm:flex-row items-center  sm:col-span-2 md:col-span-3">
                     <div className="flex-none mb-10 sm:mb-0">
                        <a className="text-2xl font-semibold" href="/">
                            <img className='object-contain h-[80px] w-[200px]' src={siteLogo ? `/storage/${siteLogo}` : logo} alt={siteName}/>
                        </a>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 ">About {siteName}</p>

                      <div className="mt-5 space-y-2">
                          <p className="text-sm text-gray-600">{siteName} is the official online platform for conducting the elections of the Alliance Youth of the Philippines – North Central Mindanao District. This site provides a secure, transparent, and accessible way for members to cast their votes and participate in choosing servant leaders who embody humility, integrity, and Christ-like service. The system ensures that every vote counts toward building a future led with compassion, faith, and dedication to ministry.</p>
                      </div>
                    </div>
                  </div>
                  <div>
                      <p className="font-semibold text-gray-800 ">Quick Link</p>

                      <div className="flex flex-col items-start mt-5 space-y-2">
                          <a href="/vote" className="text-gray-600 hover:underline hover:text-purple-600">Vote</a>
                          <a href="/election-result" className="text-gray-600 hover:underline hover:text-purple-600">Election Result</a>
                          <a href="/candidate" className="text-gray-600 hover:underline hover:text-purple-600">Candidate</a>
                          <a href="/guidelines" className="text-gray-600 hover:underline hover:text-purple-600">Guidelines</a>
                      </div>
                  </div>
              </div>

              <hr className="my-6 border-gray-200 md:my-8" />

              <div className="flex flex-col md:flex-row items-center justify-between">
                <span className="text-black text-sm order-2 md:order-1">
                    © {siteName}. All Rights Reserved.
                </span>

                <div className="flex flex-row items-start mt-0 md:mt-5 space-y-2 order-1 md:order-2">
                  <a href="/privacy-policy" className="text-black text-sm hover:underline hover:text-blue-600 mx-2">Privacy Policy</a> |
                  <a href="/terms-and-conditions" className="text-black text-sm hover:underline hover:text-blue-600 mx-2">Terms and Conditions</a>
                </div>
            </div>
          </div>
      </footer>
    </>
  );
}