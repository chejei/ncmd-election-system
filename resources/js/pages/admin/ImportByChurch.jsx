import React, { useEffect, useState, useRef } from "react";
import Papa from "papaparse";
import Swal from "sweetalert2";
import axios from "../../api/axios";
import { InfoCircle } from "../../assets/icons/icon";

export default function ImportByChurch() {
    const [csvData, setCsvData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [churches, setChurches] = useState([]);
    const [selectedChurch, setSelectedChurch] = useState("");
    const [importErrors, setImportErrors] = useState({});
    const fileInputRef = useRef(null);
    const requiredHeaders = [
        "registration_num",
        "first_name",
        "last_name",
        "middle_name",
        "suffix_name",
        "email",
        "phone_number",
    ];
    useEffect(() => {
        axios.get("/api/churches").then((res) => {
            const filtered = res.data.map((church) => ({
                id: church.id,
                name: church.name,
            }));
            setChurches(filtered);
        });
    }, []);

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
                        text: `Headers must be exactly: ${requiredHeaders.join(
                            ", "
                        )}`,
                    });
                    e.target.value = null;
                    return;
                }

                // Filter out empty rows
                const filteredData = results.data.filter((row) =>
                    Object.values(row).some(
                        (val) => val && val.toString().trim() !== ""
                    )
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
        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "voters_template_by_church.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleSelectAll = () => {
        if (selectAll) {
            // Unselect all
            setSelectedRows([]);
        } else {
            // Select only valid rows (no errors)
            const validRowIndexes = csvData
                .map((row, index) => {
                    const validEmail = isValidEmail(row.email);
                    const validPhone = isValidPhone(row.phone_number);
                    const validRegistrationNum = isValidRegistrationNum(
                        row.registration_num
                    );

                    const hasErrors =
                        !validEmail || !validPhone || !validRegistrationNum;

                    return hasErrors ? null : index;
                })
                .filter((i) => i !== null); // keep only valid row indexes

            setSelectedRows(validRowIndexes);
        }

        setSelectAll(!selectAll);
    };

    const handleImport = async () => {
        if (!selectedChurch) {
            Swal.fire({
                icon: "warning",
                title: "No Church Selected",
                text: "Please select a church before importing voters.",
            });
            return;
        }

        if (selectedRows.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "No Rows Selected",
                text: "Please select at least one row to import.",
            });
            return;
        }
        try {
            const dataToImport = selectedRows.map((csvIndex) => {
                const row = csvData[csvIndex];
                return {
                    ...row,
                    csv_index: csvIndex,
                    church_name: selectedChurch,
                };
            });

            const response = await axios.post("/api/voters/import", {
                voters: dataToImport,
            });

            const { success_count, error_count, success_rows, data } =
                response.data;

            const errorsMap = {};
            data.forEach((row) => {
                if (!row.success) {
                    errorsMap[row.voter.csv_index] = [row.message];
                }
            });
            setImportErrors(errorsMap);

            // Show Info Swal
            Swal.fire({
                icon: "info",
                title: "Import Summary",
                html: `
                    <p><strong>Successful:</strong> ${success_count}</p>
                    <p><strong>Errors:</strong> ${error_count}</p>
                `,
                didClose: () => {
                    const updatedCsv = csvData.map((row, index) => {
                        if (success_rows.includes(index)) {
                            return {
                                ...row,
                                _imported: true, // flag
                            };
                        }
                        return row;
                    });

                    setCsvData(updatedCsv);
                },
            });

            setSelectedRows([]);
            setSelectAll(false);
            setSelectedChurch("");

            if (fileInputRef.current) {
                fileInputRef.current.value = null;
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Import Failed",
                text: "Something went wrong while importing voters.",
            });
        }
    };

    const handleClearTable = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "This will clear all rows in the table.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#2b7fff",
            cancelButtonColor: "#e7000b",
            confirmButtonText: "Yes, clear it",
            cancelButtonText: "No, cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                setCsvData([]);
                setSelectedRows([]);
                setImportErrors([]);
                setSelectAll(false);
                setSelectedChurch("");
                if (fileInputRef.current) {
                    fileInputRef.current.value = null; // reset file input
                }
                Swal.fire("Cleared!", "The table has been cleared.", "success");
            }
        });
    };

    const isValidPhone = (number) => {
        if (!number) return true; // allow empty
        return /^(09|\+639)\d{9}$/.test(number);
    };

    const isValidEmail = (email) => {
        if (!email) return true; // allow empty
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const isValidRegistrationNum = (registrationNum) => {
        return registrationNum && registrationNum.trim() !== "";
    };

    console.log(importErrors);

    return (
        <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md lg:col-span-2">
            <h2 className="text-lg font-bold mb-3">Upload Voters CSV</h2>

            <div className="flex items-center mb-6 justify-between">
                <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-4">
                    <div className="">
                        <label className="block text-sm font-medium text-gray-700">
                            Upload file
                        </label>
                        <input
                            ref={fileInputRef}
                            className="block w-[300px] border border-gray-300 rounded 
                                focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:ring-2
                                file:bg-gray-50 file:border-0 file:me-4 file:py-2 file:px-4
                                disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                            aria-describedby="file_input_help"
                            id="file_input"
                            type="file"
                            accept=".csv"
                            onChange={handleFileUpload}
                        />
                        <p
                            className="mt-1 text-sm text-gray-500"
                            id="file_input_help"
                        >
                            Accept CSV file format only.
                        </p>
                    </div>
                    <div className="">
                        <label className="block text-sm font-medium text-gray-700">
                            Church
                        </label>
                        <select
                            value={selectedChurch}
                            onChange={(e) => setSelectedChurch(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select Church</option>
                            {churches.map((church) => (
                                <option key={church.id} value={church.name}>
                                    {church.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex gap-2">
                    {csvData.length > 0 && (
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            onClick={handleClearTable}
                        >
                            Clear Table
                        </button>
                    )}
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
                                        disabled={csvData.every((row) => {
                                            const validRegistrationNum =
                                                isValidRegistrationNum(
                                                    row.registration_num
                                                );
                                            const validEmail = isValidEmail(
                                                row.email
                                            );
                                            const validPhone = isValidPhone(
                                                row.phone_number
                                            );
                                            return (
                                                !validEmail ||
                                                !validPhone ||
                                                !validRegistrationNum
                                            );
                                        })}
                                    />
                                </th>
                                {Object.keys(csvData[0]).map((key, idx) => {
                                    if (key == "_imported") return null;
                                    return (
                                        <th key={idx} className="border p-2">
                                            {key}
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {csvData.map((row, rowIndex) => {
                                if (row._imported) return null;
                                const clientErrors = [];
                                if (
                                    !isValidRegistrationNum(
                                        row.registration_num
                                    )
                                )
                                    clientErrors.push(
                                        `Registration Number is required.`
                                    );
                                if (!isValidEmail(row.email))
                                    clientErrors.push(
                                        `Invalid email: ${row.email}`
                                    );
                                if (!isValidPhone(row.phone_number))
                                    clientErrors.push(
                                        `Invalid number: ${row.phone_number}`
                                    );

                                // Merge server errors if any
                                console.log(importErrors[rowIndex]);
                                const backendErrors =
                                    importErrors[rowIndex] || [];
                                const rowErrors = [
                                    ...clientErrors,
                                    ...backendErrors,
                                ];
                                const hasErrors = rowErrors.length > 0;
                                return (
                                    <tr
                                        key={rowIndex}
                                        className={`border ${
                                            hasErrors ? "bg-red-200" : ""
                                        }`}
                                    >
                                        <td className="border p-2 text-center">
                                            {!hasErrors ? (
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRows.includes(
                                                        rowIndex
                                                    )}
                                                    onChange={() =>
                                                        handleCheckboxChange(
                                                            rowIndex
                                                        )
                                                    }
                                                />
                                            ) : (
                                                <div className="relative group inline-block cursor-pointer">
                                                    <InfoCircle
                                                        width="15"
                                                        height="15"
                                                    />
                                                    <div
                                                        className="absolute left-full top-1/2 -translate-y-1/2 ml-2 
                                                                    hidden group-hover:block 
                                                                    bg-gray-800 text-white text-xs px-2 py-1 rounded 
                                                                    shadow-lg whitespace-nowrap z-10"
                                                    >
                                                        {rowErrors.map(
                                                            (err, i) => (
                                                                <div key={i}>
                                                                    {err}
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                        {Object.values(row).map(
                                            (val, colIndex) => (
                                                <td
                                                    key={colIndex}
                                                    className="border p-2"
                                                >
                                                    {val}
                                                </td>
                                            )
                                        )}
                                    </tr>
                                );
                            })}
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
