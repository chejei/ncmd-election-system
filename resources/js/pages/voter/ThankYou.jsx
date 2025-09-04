import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "../../assets/icons/icon";

export default function ThankYouPage() {
    const navigate = useNavigate();
    const voter = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (!voter) return;
        if (!voter.voted_photo && !voter.restrict) {
            navigate("/vote/ballot");
        } else if (voter.restrict && voter.voted_photo) {
            navigate("/vote");
        } else if (!voter.restrict && voter.voted_photo) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            const updatedVoter = { ...voter, restrict: true };
            localStorage.setItem("user", JSON.stringify(updatedVoter));
        }
    }, [voter, navigate]);
    if (!voter) return null;

    return (
        <div className="py-60">
            <div className="mx-auto bg-white text-center">
                {voter.voted_photo && (
                    <div className="mb-4">
                        <img
                            src={voter.voted_photo}
                            alt="Voter Photo"
                            className="mx-auto w-64 h-64 rounded-full object-cover border-2 border-green-500"
                        />
                    </div>
                )}
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                    Thank You for Voting!
                </h1>
                <p className="text-gray-600 mb-6">
                    Your ballot has been successfully submitted. <br />
                    We appreciate your participation in this election. <br />
                    Enjoy the rest of the camp!
                </p>
                <div className="flex justify-center gap-2">
                    <a
                        href="/"
                        className="inline-block bg-gray-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
                    >
                        Back to Home
                    </a>
                    <a
                        href="/vote"
                        className="inline-block bg-blue-800 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
                    >
                        Dashboard
                    </a>
                </div>
            </div>
        </div>
    );
}
