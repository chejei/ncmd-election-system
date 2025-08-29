import React, { useState } from "react";
import Papa from "papaparse";
import Swal from "sweetalert2";
import axios from "../../api/axios";

export default function ImportVoters() {
    const [csvData, setCsvData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const requiredHeaders = [
        "first_name",
        "last_name",
        "middle_name",
        "suffix_name",
        "email",
        "phone_number",
        "church_name",
    ];

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
            const fileHeaders = results.meta.fields;

            const isValid =
            fileHeaders.length === requiredHeaders.length &&
            requiredHeaders.every((h, i) => h === fileHeaders[i]);

            if (!isValid) {
                Swal.fire({
                    icon: "error",
                    title: "Invalid CSV Format",
                    text: `Headers must be exactly: ${requiredHeaders.join(", ")}`,
                });
                e.target.value = null;
                return;
            }

             // Filter out empty rows
            const filteredData = results.data.filter((row) =>
                Object.values(row).some((val) => val && val.toString().trim() !== "")
            );

            if (filteredData.length === 0) {
                Swal.fire({
                icon: "warning",
                title: "No Data Found",
                text: "CSV file has no valid rows with values.",
                });
                e.target.value = null; // reset input
                return;
            }

            setCsvData(results.data);
            setSelectedRows([]);
            setSelectAll(false);
        },
        });
    };

    const handleCheckboxChange = (rowIndex) => {
        setSelectedRows((prev) =>
        prev.includes(rowIndex)
            ? prev.filter((i) => i !== rowIndex)
            : [...prev, rowIndex]
        );
    };

    const handleDownloadTemplate = () => {
        const csvContent = requiredHeaders.join(",") + "\n";
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "voters_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleSelectAll = () => {
        if (selectAll) {
        setSelectedRows([]);
        } else {
        setSelectedRows(csvData.map((_, index) => index));
        }
        setSelectAll(!selectAll);
    };

    const handleImport = async () => {
        try {
        const dataToImport = selectedRows.map((i) => csvData[i]);
        await axios.post("/voters/import", { voters: dataToImport });

        Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Voters imported successfully!",
        });
        } catch (error) {
        console.error(error);
        Swal.fire({
            icon: "error",
            title: "Import Failed",
            text: "Something went wrong while importing voters.",
        });
        }
    };

    return (
        <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md lg:col-span-2">
        <h2 className="text-lg font-bold mb-3">Upload Voters CSV</h2>

        <div className="flex items-center mb-6 justify-between">
            <div>
            <label className="block font-medium mb-1">Upload file</label>
            <input
                className="block w-[300px] border border-gray-200 shadow-sm rounded-lg text-sm
                        focus:z-10 focus:border-blue-500 focus:ring-blue-500
                        file:bg-gray-50 file:border-0 file:me-4 file:py-2 file:px-4
                        disabled:opacity-50 disabled:pointer-events-none"
                aria-describedby="file_input_help"
                id="file_input"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
            />
            <p className="mt-1 text-sm text-gray-500" id="file_input_help">
                Accept CSV file format only.
            </p>
            </div>

            <div>
            <button
                onClick={handleDownloadTemplate}
                className="px-3 py-2 bg-green-600 text-white rounded"
            >
                Download Template
            </button>
            </div>
        </div>

        {csvData.length > 0 && (
            <div>
            <table className="table-auto border-collapse border border-gray-300 w-full">
                <thead>
                <tr className="bg-gray-200">
                    <th>
                        <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAll}
                        />
                    </th>
                    {Object.keys(csvData[0]).map((key, idx) => (
                    <th key={idx} className="border p-2">
                        {key}
                    </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {csvData.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border">
                    <td className="border p-2 text-center">
                        <input
                        type="checkbox"
                        checked={selectedRows.includes(rowIndex)}
                        onChange={() => handleCheckboxChange(rowIndex)}
                        />
                    </td>
                    {Object.values(row).map((val, colIndex) => (
                        <td key={colIndex} className="border p-2">
                        {val}
                        </td>
                    ))}
                    </tr>
                ))}
                </tbody>
            </table>

            <button
                onClick={handleImport}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
                Import Selected
            </button>
            </div>
        )}
        </div>
    );
}
