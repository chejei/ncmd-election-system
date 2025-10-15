import { useEffect, useState } from "react";
import axios from "../../../api/axios";
import TiptapEditor from "../../../components/TiptapEditor";
import Swal from "sweetalert2";

export default function CandidateQuestions({ candidateId, readOnly }) {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await axios.get(
                    `/api/questions/active/${candidateId}`
                );
                setQuestions(res.data);
            } catch (err) {
                console.error("Error fetching questions:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [candidateId]);

    const handleSaveAll = async () => {
        try {
            await axios.post(`/api/candidate-answers/bulk`, {
                candidate_id: candidateId,
                answers: questions.map((q) => ({
                    question_id: q.id,
                    answer: q.answer || "", // HTML from Tiptap
                })),
            });

            Swal.fire({
                icon: "success",
                title: "Saved!",
                text: "All answers have been saved successfully.",
                confirmButtonColor: "#3085d6",
            });
        } catch (err) {
            console.error("Failed to save:", err);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Failed to save answers. Please try again.",
                confirmButtonColor: "#d33",
            });
        } finally {
        }
    };

    if (loading) {
        return <p className="text-gray-500">Loading questions...</p>;
    }

    if (questions.length === 0) {
        return <p className="text-gray-500">No active questions available.</p>;
    }

    return (
        <div className="space-y-4">
            {questions.map((q, idx) => (
                <div
                    key={q.id}
                    className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
                >
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                        Q{idx + 1}. {q.question_text}
                    </h3>
                    {!readOnly ? (
                        <TiptapEditor
                            value={q.answer}
                            placeholder="Type your answer here..."
                            onChange={(val) =>
                                setQuestions((prev) =>
                                    prev.map((item) =>
                                        item.id === q.id
                                            ? { ...item, answer: val }
                                            : item
                                    )
                                )
                            }
                        />
                    ) : (
                        <div className="editor-html">
                            {q.answer ? (
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: q.answer,
                                    }}
                                />
                            ) : (
                                <span className="text-gray-500 italic">
                                    No answer provided
                                </span>
                            )}
                        </div>
                    )}
                </div>
            ))}
            {!readOnly && (
                <div className="text-right">
                    <button
                        onClick={handleSaveAll}
                        className={`mt-4 px-6 py-2 rounded text-white bg-blue-500 hover:bg-blue-800 cursor-pointer`}
                    >
                        Save All Answers
                    </button>
                </div>
            )}
        </div>
    );
}
