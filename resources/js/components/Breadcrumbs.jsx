import React from "react";
import { Link, useLocation, matchPath } from "react-router-dom";
import routeTitles from "../routes/routeTitles";

export default function Breadcrumbs() {
  const location = useLocation();
  const pathname = location.pathname;

  // Split current path into segments
  const segments = pathname.split("/").filter(Boolean);

  // Build breadcrumb paths progressively
  const paths = segments.map((_, index) => "/" + segments.slice(0, index + 1).join("/"));

  // Helper: find title for a path using matchPath
  const getTitle = (path) => {
    for (const route in routeTitles) {
      const match = matchPath({ path: route, end: true }, path);
      if (match) return routeTitles[route];
    }
    // return path; // fallback if not found
  };

  return (
    <nav className="text-sm text-gray-600 my-3">
      <ol className="flex space-x-2">
        {paths.map((path, index) => {
          const title = getTitle(path);
          const isLast = index === paths.length - 1;
          return (
           title && (
              <li key={path} className="flex items-center">
                {!isLast ? (
                  <Link to={path} className="hover:underline text-blue-600">
                    {title}
                  </Link>
                ) : (
                  <span className="font-medium">{title}</span>
                )}
                {!isLast && <span className="mx-2">/</span>}
              </li>
            )
          );
        })}
      </ol>
    </nav>
  );
};

