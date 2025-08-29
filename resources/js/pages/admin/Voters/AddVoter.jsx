import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "../../../api/axios";
import FormFields from "../../../components/FormFields";
import Swal from "sweetalert2";

export default function AddVoter() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    control,
  } = useForm();
  const [churches, setChurches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/churches").then((res) => setChurches(res.data));
  }, []);

  const fields = [
    { name: "heading-1", label: "Voter Information", type: "heading", wrapperClass: "col-span-3" },
    { name: "first_name", label: "First Name", type: "text", className: "w-full border rounded px-3 py-2", wrapperClass: "mb-3", required: true },
    { name: "last_name", label: "Last Name", type: "text", className: "w-full border rounded px-3 py-2", wrapperClass: "mb-3", required: true },
    { name: "middle_name", label: "Middle Name", type: "text", className: "w-full border rounded px-3 py-2", wrapperClass: "mb-3" },
    { name: "suffix_name", label: "Suffix Name", type: "text", className: "w-full border rounded px-3 py-2", wrapperClass: "mb-3" },
    { name: "email", label: "Email", type: "email", className: "w-full border rounded px-3 py-2", wrapperClass: "mb-3", required: true },
    { name: "phone_number", label: "Phone Number", type: "text", className: "w-full border rounded px-3 py-2", wrapperClass: "mb-3", required: true },
    {
      name: "church_id",
      label: "Church",
      type: "select",
      options: churches.map((c) => ({ value: c.id, label: c.name })),
      className: "w-full border rounded px-3 py-2",
      wrapperClass: "mb-3",
    },
  ];

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("/voters", data);
      if (res.status === 200 || res.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `Voter saved successfully!`,
        }).then(() => {
          navigate("/admin/voters");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error saving voter.",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.response.data.message || "Failed to save voter.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Unexpected Error",
          text: "An unexpected error occurred.",
        });
      }
    }
  };

  return (
    <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md lg:col-span-2">
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-3 gap-4">
        <FormFields
          fields={fields}
          register={register}
          errors={errors}
          watch={watch}
          setValue={setValue}
          control={control}
        />
        <div className="col-span-3 flex justify-end items-center">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Save Voter
          </button>
        </div>
      </form>
    </div>
  );
};

