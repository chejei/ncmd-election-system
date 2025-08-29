import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../../api/axios";
import FormFields from "../../../components/FormFields";
import Swal from "sweetalert2";


export default function EditQuestion() {
  const { questionId } = useParams();
  const { register, handleSubmit, reset, watch, formState: { errors }, control } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const fields = [
    { name: "heading-1", label: "Question Details", type: "heading", wrapperClass: "col-span-3" },
    { name: "question_text", label: "Question", type: "text", className: "w-full border rounded px-3 py-2", wrapperClass: "mb-3", required: true },
    { name: "enable", label: "Enable", type: "true_false", className: 'py-2', wrapperClass: "mb-3" },
  ];

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await axios.get(`/questions/${questionId}`);
        reset(res.data);
      } catch (error) {
        console.error(error);
        Swal.fire({ icon: "error", title: "Error", text: "Failed to fetch question." });
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [questionId, reset]);

  const onSubmit = async (data) => {
    try {
      const res = await axios.put(`/questions/${questionId}`, data);
      if (res.status === 200) {
        Swal.fire({ icon: "success", title: "Success", text: "Question updated successfully!" })
          .then(() => navigate("/admin/candidate/questions"));
      } else {
        Swal.fire({ icon: "error", title: "Error", text: "Error updating question." });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || "Failed to update question.",
      });
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-white border border-gray-100 shadow-md p-6 rounded-md lg:col-span-2">
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-3 gap-4">
        <FormFields fields={fields} register={register} errors={errors} watch={watch} control={control}/>
        <div className="col-span-3 flex justify-end items-center">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Update Question
          </button>
        </div>
      </form>
    </div>
  );
};