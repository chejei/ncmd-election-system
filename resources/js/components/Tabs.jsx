//components/Tabs.jsx
import React from "react";

export default function Tabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="mb-4 border-b border-gray-200">
      <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
        {tabs.map((tab) => (
          <li key={tab.key} className="me-2">
            <button
              onClick={() => onTabChange(tab.key)}
              className={`inline-block p-4 border-b-2 rounded-t-lg ${
                activeTab === tab.key
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-600"
              }`}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
