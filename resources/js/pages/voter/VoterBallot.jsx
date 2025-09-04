import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import Swal from "sweetalert2";
import Webcam from "react-webcam";
import { CameraIcon, RetakeIcon } from "../../assets/icons/icon";
import Stepper from "../../components/Stepper";

const steps = [
    { number: 1, label: "Election Ballot" },
    { number: 2, label: "Review" },
    { number: 3, label: "Final" },
];

export default function Ballot() {
    const navigate = useNavigate();
    const [positions, setPositions] = useState([]);
    const [selections, setSelections] = useState({});
    const [loading, setLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);
    const [photo, setPhoto] = useState(null);
    const webcamRef = useRef(null);
    const voter = JSON.parse(localStorage.getItem("user"));
    if (!voter) navigate("/vote");
    const voter_id = voter.id;

    if (voter.restrict) {
        Swal.fire({
            icon: "warning",
            title: "Already Voted",
            text: "You have already voted. You cannot access the ballot again.",
            backdrop: `
        rgba(0,0,0,0.6)
        blur(5px)
       `,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
        }).then(() => {
            navigate("/vote"); // redirect back to voter list
        });
        return; // stop execution
    }

    // Fetch candidates
    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const res = await axios.get("/position-candidates");
                setPositions(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching candidates:", error);
                setLoading(false);
            }
        };
        fetchCandidates();
    }, []);

    // Handle candidate select
    const handleSelect = (positionId, candidateId, maxWinner) => {
        const current = selections[positionId] || [];

        if (maxWinner > 1) {
            let updated;

            if (current.includes(candidateId)) {
                updated = current.filter((id) => id !== candidateId);
            } else {
                if (current.length < maxWinner) {
                    updated = [...current, candidateId];
                } else {
                    Swal.fire({
                        icon: "warning",
                        title: "Limit Reached",
                        text: `You can only select up to ${maxWinner} candidates for this position.`,
                    });
                    return;
                }
            }

            setSelections({
                ...selections,
                [positionId]: updated,
            });
        } else {
            setSelections({
                ...selections,
                [positionId]: candidateId,
            });
        }
    };

    // Validate selections before moving to next step
    const handleNext = () => {
        if (currentStep === 1) {
            const allSelected = positions
                .filter((pos) => pos.candidates && pos.candidates.length > 0)
                .every((pos) => {
                    return pos.max_winners > 1
                        ? selections[pos.id] && selections[pos.id].length > 0
                        : selections[pos.id];
                });

            if (!allSelected) {
                Swal.fire({
                    icon: "error",
                    title: "Incomplete Ballot",
                    text: "Please select candidates for all positions before continuing.",
                });
                return;
            }
        }

        if (currentStep === 3) {
            handleSubmit();
        } else {
            setCurrentStep(currentStep + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setPhoto(imageSrc);
    };

    // Submit final ballot
    const handleSubmit = async () => {
        if (!photo) {
            Swal.fire({
                icon: "warning",
                title: "Photo Required",
                text: "You must take a photo before submitting.",
            });
            return;
        }
        try {
            const formData = new FormData();
            formData.append("selections", JSON.stringify(selections));
            formData.append("photo", photo);
            formData.append("voter_id", voter_id);

            await axios.post("/submit-ballot", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            const updatedVoter = { ...voter, voted_photo: photo };
            localStorage.setItem("user", JSON.stringify(updatedVoter));

            navigate("/thank-you");
        } catch (error) {
            console.error("Error submitting ballot:", error);
            Swal.fire({
                icon: "error",
                title: "Submission Failed",
                text: "Something went wrong while submitting your vote.",
            });
        }
    };

    if (loading) {
        return <p className="text-center mt-10">Loading ballot...</p>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-screen-xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
                {/* Stepper */}
                <Stepper steps={steps} currentStep={currentStep} />

                {/* Step 1: Ballot */}
                {currentStep === 1 && (
                    <>
                        <h3 className="text-3xl font-bold text-gray-800 mb-6">
                            Step 1 : Fill Out Your Ballot Form
                        </h3>
                        <p className="text-gray-600 mb-3">
                            Select your preferred candidates for each position
                            listed on the ballot.
                        </p>
                        <ul className="list">
                            <li>Review all positions carefully.</li>
                            <li>
                                Choose only up to the allowed number of
                                candidates per position.
                            </li>
                            <li>
                                Double-check your choices before moving forward.
                            </li>
                        </ul>
                        <div className="step-wrapper mt-6">
                            {positions
                                .filter(
                                    (position) =>
                                        position.candidates &&
                                        position.candidates.length > 0
                                )
                                .map((position) => (
                                    <div key={position.id} className="mb-8">
                                        <h2 className="text-xl font-semibold text-gray-700 mb-4">
                                            {position.title}{" "}
                                            {position.max_winners > 1 && (
                                                <span className="text-sm text-gray-500">
                                                    (Select up to{" "}
                                                    {position.max_winners})
                                                </span>
                                            )}
                                        </h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            {position.candidates.map(
                                                (candidate) => (
                                                    <label
                                                        key={candidate.id}
                                                        className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer ${
                                                            position.max_winners >
                                                            1
                                                                ? (
                                                                      selections[
                                                                          position
                                                                              .id
                                                                      ] || []
                                                                  ).includes(
                                                                      candidate.id
                                                                  )
                                                                    ? "border-blue-500 bg-blue-50"
                                                                    : "border-gray-300"
                                                                : selections[
                                                                      position
                                                                          .id
                                                                  ] ===
                                                                  candidate.id
                                                                ? "border-blue-500 bg-blue-50"
                                                                : "border-gray-300"
                                                        }`}
                                                    >
                                                        <input
                                                            type={
                                                                position.max_winner >
                                                                1
                                                                    ? "checkbox"
                                                                    : "radio"
                                                            }
                                                            name={`position-${position.id}`}
                                                            value={candidate.id}
                                                            checked={
                                                                position.max_winners >
                                                                1
                                                                    ? (
                                                                          selections[
                                                                              position
                                                                                  .id
                                                                          ] ||
                                                                          []
                                                                      ).includes(
                                                                          candidate.id
                                                                      )
                                                                    : selections[
                                                                          position
                                                                              .id
                                                                      ] ===
                                                                      candidate.id
                                                            }
                                                            onChange={() =>
                                                                handleSelect(
                                                                    position.id,
                                                                    candidate.id,
                                                                    position.max_winners
                                                                )
                                                            }
                                                            className="hidden"
                                                        />
                                                        <img
                                                            src={
                                                                candidate.photo
                                                                    ? `/storage/${candidate.photo}`
                                                                    : "/images/user-placeholder.png"
                                                            }
                                                            alt={
                                                                candidate.first_name
                                                            }
                                                            className="h-16 w-16 object-cover object-top rounded-full border"
                                                        />
                                                        <div>
                                                            <p className="text-lg font-medium text-gray-800">
                                                                {
                                                                    candidate.full_name
                                                                }
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                {
                                                                    candidate.church_name
                                                                }
                                                            </p>
                                                        </div>
                                                    </label>
                                                )
                                            )}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </>
                )}

                {/* Step 2: Review */}
                {currentStep === 2 && (
                    <div>
                        <h3 className="text-3xl font-bold text-gray-800 mb-6">
                            Step 2: Review Your Ballot
                        </h3>
                        <p className="text-gray-600 mb-3">
                            Before finalizing, confirm your chosen candidates.
                        </p>
                        <ul className="list">
                            <li>Ensure that all selections are correct.</li>
                            <li>
                                If you need to make changes, go back and update
                                your ballot.
                            </li>
                            <li>Once satisfied, proceed to the final step.</li>
                        </ul>
                        <div className="step-wrapper mt-6">
                            <table className="w-full border border-gray-300 rounded-md">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="text-left px-4 py-2 border-b">
                                            Position
                                        </th>
                                        <th className="text-left px-4 py-2 border-b">
                                            Candidate
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {positions
                                        .filter(
                                            (position) =>
                                                position.candidates &&
                                                position.candidates.length > 0
                                        )
                                        .map((position) => {
                                            // Normalize selections (array or single)
                                            const selectedIds = Array.isArray(
                                                selections[position.id]
                                            )
                                                ? selections[position.id]
                                                : [
                                                      selections[position.id],
                                                  ].filter(Boolean);

                                            // Get selected candidates
                                            const selectedCandidates =
                                                position.candidates.filter(
                                                    (c) =>
                                                        selectedIds.includes(
                                                            c.id
                                                        )
                                                );

                                            if (selectedCandidates.length === 0)
                                                return null;

                                            return (
                                                <tr
                                                    key={position.id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-4 py-2 border-b">
                                                        {position.title}
                                                    </td>
                                                    <td className="px-4 py-2 border-b">
                                                        {selectedCandidates.map(
                                                            (c, i) => (
                                                                <span
                                                                    key={c.id}
                                                                >
                                                                    {
                                                                        c.full_name
                                                                    }
                                                                    {i <
                                                                        selectedCandidates.length -
                                                                            1 && (
                                                                        <br />
                                                                    )}
                                                                </span>
                                                            )
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Step 3: Final (Photo Upload) */}
                {currentStep === 3 && (
                    <div>
                        <h3 className="text-3xl font-bold text-gray-800 mb-6">
                            Final Step: Capture Your Photo
                        </h3>
                        <p className="text-gray-600 mb-3">
                            This is the last step before submitting your ballot.{" "}
                            <br />
                            To complete your voting process, please capture a
                            clear photo of yourself using the camera provided.
                        </p>
                        <h4 className="mb-2 text-m font-semibold">
                            Why this step is important:
                        </h4>
                        <ul className="list">
                            <li>
                                <span className="font-semibold">
                                    Identity Verification
                                </span>{" "}
                                – ensures that the person submitting the vote is
                                really you.
                            </li>
                            <li>
                                <span className="font-semibold">
                                    Prevents Fraud
                                </span>{" "}
                                – avoids duplicate or unauthorized voting.
                            </li>
                            <li>
                                <span className="font-semibold">
                                    Election Integrity
                                </span>{" "}
                                – helps maintain fairness, transparency, and
                                trust in the voting process.
                            </li>
                        </ul>
                        <h4 className="mb-2 text-m font-semibold">
                            Guidelines for taking your photo:
                        </h4>
                        <ul className="list">
                            <li>
                                {" "}
                                Position yourself in front of the camera with
                                good lighting.
                            </li>
                            <li>
                                {" "}
                                Make sure your face is clearly visible (no hats,
                                masks, or obstructions).
                            </li>
                            <li>
                                {" "}
                                Once you capture the photo and click submit your
                                vote will be automatically recorded and
                                finalized.
                            </li>
                        </ul>
                        <h4 className="mb-2 text-m font-semibold">
                            Important Notice:
                        </h4>
                        <ul className="list">
                            <li>
                                {" "}
                                If your photo appears unclear, anomalous, or
                                suspicious (e.g., blurry face, multiple people,
                                altered images), your vote may not be considered
                                valid and could be invalidated.
                            </li>
                            <li>
                                {" "}
                                Please ensure your photo is taken properly to
                                avoid issues with verification.
                            </li>
                        </ul>
                        <div className="step-wrapper mt-6">
                            {!photo ? (
                                <>
                                    <Webcam
                                        audio={false}
                                        ref={webcamRef}
                                        screenshotFormat="image/jpeg"
                                        videoConstraints={{
                                            facingMode: "environment",
                                        }}
                                        className="w-full h-auto rounded-lg"
                                    />
                                    <div className="flex justify-center mt-2 ">
                                        <button
                                            onClick={capture}
                                            className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 mx-auto rounded camera-button"
                                            aria-label="Take a Photo"
                                        >
                                            <CameraIcon />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <img
                                        src={photo}
                                        alt="Captured"
                                        className="w-full h-auto rounded-lg object-cover"
                                    />
                                    <div className="flex justify-center mt-2">
                                        <button
                                            onClick={() => setPhoto(null)}
                                            className="w-10 h-10 bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 mx-auto rounded camera-button"
                                            aria-label="Retake"
                                        >
                                            <RetakeIcon />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-end mt-8">
                    {currentStep > 1 && (
                        <button
                            onClick={() => handleBack()}
                            className="px-6 py-3 mx-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100"
                        >
                            Back
                        </button>
                    )}
                    <button
                        onClick={() => handleNext()}
                        className="px-6 py-3 mx-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                    >
                        {currentStep === 3 ? "Submit Ballot" : "Next"}
                    </button>
                </div>
            </div>
        </div>
    );
}
