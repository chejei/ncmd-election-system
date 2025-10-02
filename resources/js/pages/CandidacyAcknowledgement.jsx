import { useEffect, useRef } from "react";
import { useSetting } from "../components/SettingContext";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle } from "../assets/icons/icon";

export default function CandidacyAcknowledgement() {
    const navigate = useNavigate();
    const location = useLocation();
    const siteName = useSetting("site_name", "");
    const hasChecked = useRef(false);

    useEffect(() => {
        if (hasChecked.current) return; // Prevent double execution in Strict Mode
        hasChecked.current = true;

        const fromForm = sessionStorage.getItem("fromCandidacyForm");

        if (fromForm !== "true") {
            navigate("/apply-candidacy");
        } else {
            sessionStorage.removeItem("fromCandidacyForm");
        }
    }, [navigate]);

    return (
        <div className="py-10 md:py-20 lg:py-60 bg-white">
            <div className="mx-auto mx-auto sm:px-7 px-4 max-w-screen-xl">
                <div className="mb-4 flex flex-col sm:flex-row justify-start items-center gap-4 sm:gap-2">
                    <CheckCircle className="w-[30px] h-[30px] stroke-green-500 ml-0 mr-auto sm:mr-0 sm:ml-0" />
                    <h1 className="text-4xl font-bold text-gray-800">
                        Thank You for Stepping Up to Lead!
                    </h1>
                </div>
                <p className="text-gray-600 mb-6">
                    We sincerely appreciate your bravery and commitment in
                    submitting your candidacy for the {siteName}. True
                    leadership begins with the courage to see the needs of the
                    community and answer the call to serve.
                </p>
                <p className="text-gray-600 mb-6">
                    Your application has been successfully received and is now
                    under review. Every vote is a prayerful choice to raise
                    leaders who embody humility, integrity, and Christ-like
                    service. By stepping forward, you have demonstrated your
                    willingness to serve first, lead with compassion, and guide
                    with faith.
                </p>
                <p className="text-gray-600 mb-6">
                    We encourage you to continue reflecting on these values as
                    you await the election process. Your dedication inspires
                    others and strengthens our community.
                </p>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                    Next Steps:
                </h2>
                <ul className="mb-10 list-disc pl-5">
                    <li className="text-gray-600">
                        Your candidacy will be reviewed for approval.
                    </li>
                    <li className="text-gray-600">
                        You will be notified once your application has been
                        accepted.
                    </li>
                    <li className="text-gray-600">
                        For any questions or concerns, please contact the
                        election committee.
                    </li>
                </ul>
                <div className="flex gap-2">
                    <a
                        href="/"
                        className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-red-700 transition"
                    >
                        Back to Home
                    </a>
                </div>
            </div>
        </div>
    );
}
