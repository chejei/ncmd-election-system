import React, { useState } from "react";
import { CaretIcon } from "../assets/icons/icon";

export default function Accordion({ title, content, index }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="w-full md:px-6">
            <div className="flex justify-between items-center w-full">
                <div>
                    <p
                        className={`flex justify-center items-center text-base leading-6 text-gray-800  ${
                            open ? "font-semibold" : "font-medium"
                        }`}
                    >
                        <span className="lg:mr-6 mr-4 lg:text-2xl md:text-xl text-lg font-semibold text-gray-800">
                            Q{index + 1}.
                        </span>
                        {title}
                    </p>
                </div>
                <button
                    aria-label="toggler"
                    className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 cursor-pointer"
                    onClick={() => setOpen(!open)}
                >
                    <CaretIcon
                        className={`w-8 h-8 transform transition-transform ${
                            open ? "rotate-180" : ""
                        }`}
                    />
                </button>
            </div>
            {open && (
                <div className="mt-6 w-full">
                    <div
                        className="text-base leading-6 text-gray-600 font-normal editor-html"
                        dangerouslySetInnerHTML={{ __html: content }}
                    ></div>
                </div>
            )}
        </div>
    );
}
