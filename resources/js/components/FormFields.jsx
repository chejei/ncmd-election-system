import React from "react";
import { UploadIcon } from "../assets/icons/icon";
import { Controller } from "react-hook-form";
import TiptapEditor from "./TiptapEditor";

export default function FormFields({
    fields,
    register,
    errors,
    watch,
    handleFileChange,
    control,
    photoPreview,
}) {
    const formValues = watch();
    return (
        <>
            {fields.map(
                ({
                    name,
                    label,
                    type,
                    options,
                    className,
                    wrapperClass,
                    required,
                }) => {
                    const validation = required
                        ? { required: `${label} is required` }
                        : {};

                    return (
                        <div
                            key={name}
                            className={`${wrapperClass ?? ""} ${
                                errors[name] ? "has-error" : ""
                            }`}
                        >
                            {type === "heading" ? (
                                <h2 className="text-lg font-bold">{label}</h2>
                            ) : (
                                <>
                                    <label className="block font-medium mb-1">
                                        {" "}
                                        {label}{" "}
                                        {required && (
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        )}
                                    </label>

                                    {type === "select" ? (
                                        <select
                                            {...register(name, validation)}
                                            className={className}
                                            defaultValue=""
                                        >
                                            <option value="">
                                                Select {label}
                                            </option>
                                            {options?.map((option) => (
                                                <option
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    ) : type === "textarea" ? (
                                        <textarea
                                            {...register(name, validation)}
                                            className={className}
                                            placeholder={`Enter ${label}`}
                                        />
                                    ) : type === "email" ? (
                                        <input
                                            type="email"
                                            {...register(name, {
                                                ...validation,
                                                pattern: {
                                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                    message:
                                                        "Please enter a valid email address",
                                                },
                                            })}
                                            className={className}
                                            placeholder={`Enter ${label}`}
                                        />
                                    ) : type === "wysiwyg" ? (
                                        <Controller
                                            control={control}
                                            name={name}
                                            rules={validation}
                                            render={({ field }) => (
                                                <TiptapEditor
                                                    value={field.value ?? ""}
                                                    onChange={(val) =>
                                                        field.onChange(
                                                            val ?? ""
                                                        )
                                                    }
                                                    placeholder={`Enter ${label}`}
                                                    className={className}
                                                />
                                            )}
                                        />
                                    ) : type === "true_false" ? (
                                        <Controller
                                            control={control}
                                            name={name}
                                            rules={validation}
                                            render={({ field }) => (
                                                <>
                                                    <div className={className}>
                                                        <input
                                                            type="checkbox"
                                                            className="toggle-switch"
                                                            id={`${name}-checkbox`}
                                                            {...field}
                                                            checked={
                                                                !!field.value
                                                            }
                                                        />
                                                        <label
                                                            htmlFor={`${name}-checkbox`}
                                                        >
                                                            <span className="sw"></span>
                                                        </label>
                                                    </div>
                                                </>
                                            )}
                                        />
                                    ) : type === "file" ? (
                                        <div className="flex items-center justify-center w-full">
                                            <label
                                                htmlFor={name}
                                                className="flex flex-col items-center justify-center w-full h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                                            >
                                                {photoPreview &&
                                                photoPreview?.[name] ? (
                                                    <img
                                                        src={photoPreview[name]}
                                                        alt="Preview"
                                                        className={className}
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <UploadIcon />
                                                        <p className="mb-2 text-sm text-gray-500">
                                                            <span className="font-semibold">
                                                                Click to upload
                                                            </span>
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            SVG, PNG, JPG or GIF
                                                        </p>
                                                    </div>
                                                )}
                                                <input
                                                    id={name}
                                                    type="file"
                                                    accept="image/*"
                                                    {...register(name, {
                                                        validate: (value) => {
                                                            if (
                                                                value instanceof
                                                                FileList
                                                            ) {
                                                                if (
                                                                    value.length ===
                                                                    0
                                                                ) {
                                                                    return "Photo is required";
                                                                }
                                                                return true;
                                                            }

                                                            if (
                                                                typeof value ===
                                                                    "string" &&
                                                                value.trim() !==
                                                                    ""
                                                            ) {
                                                                return true;
                                                            }

                                                            return "Photo is required";
                                                        },
                                                    })}
                                                    onChange={(e) =>
                                                        handleFileChange(
                                                            e,
                                                            name
                                                        )
                                                    }
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                    ) : type === "phone_number" ? (
                                        <input
                                            type="text"
                                            {...register(name, {
                                                ...validation,
                                                pattern: {
                                                    value: /^(09|\+639)\d{9}$/,
                                                    message:
                                                        "Please enter a valid Philippine phone number (e.g., 09123456789 or +639123456789)",
                                                },
                                            })}
                                            onInput={(e) =>
                                                (e.target.value =
                                                    e.target.value.replace(
                                                        /[^0-9+]/g,
                                                        ""
                                                    ))
                                            }
                                            className={className}
                                            placeholder={`Enter ${label}`}
                                        />
                                    ) : (
                                        <input
                                            type={type || "text"}
                                            {...register(name, validation)}
                                            className={className}
                                            placeholder={`Enter ${label}`}
                                        />
                                    )}

                                    {errors[name] && (
                                        <p className="text-red-500 error-notes">
                                            {errors[name]?.message}
                                        </p>
                                    )}
                                </>
                            )}
                        </div>
                    );
                }
            )}
        </>
    );
}
