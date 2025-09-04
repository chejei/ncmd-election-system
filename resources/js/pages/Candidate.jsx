import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import Accordion from "../components/Accordion";
import ctaOverlay from "../assets/images/cta-img.jpg";

export default function Candidate() {
    const { slug } = useParams();
    const [candidate, setCandidate] = useState(null);

    useEffect(() => {
        const fetchCandidate = async () => {
            try {
                const res = await axios.get(`/candidate/${slug}`);
                setCandidate(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCandidate();
    }, [slug]);

    if (!candidate) {
        return (
            <div className="bg-white border border-gray-100 shadow-md p-6 rounded-md">
                <div className="max-w-screen-xl sm:px-7 px-4 py-10 lg:py-20 mx-auto">
                    <p>Loading candidate details...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <section
                id="profile"
                className={`${
                    (candidate.political_color && "") || "bg-gray-300"
                } text-black`}
                style={{ backgroundColor: candidate.political_color }}
            >
                <div className="max-w-screen-xl  px-0  md:px-7 mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 items-center">
                        <div className="">
                            {candidate.photo && (
                                <img
                                    src={`/storage/${candidate.photo}`}
                                    alt={candidate.first_name}
                                    className="w-full object-cover rounded-lg object-top md:object-bottom h-[500px] md:h-auto"
                                />
                            )}
                        </div>
                        <div className="px-5 py-10 bg-white w-full md:rounded my-0 md:my-20 mx-auto">
                            <h1 className="text-5xl font-bold mb-3 leading-6">
                                {candidate.full_name}
                                <br />
                                <span className="text-2xl">
                                    for {candidate.position_title}
                                </span>
                            </h1>
                            <div className="mb-4">
                                {candidate.age && (
                                    <p className="text-lg">
                                        <strong>Age:</strong> {candidate.age}{" "}
                                        years old.
                                    </p>
                                )}
                                {candidate.email && (
                                    <p className="text-lg">
                                        <strong>Email:</strong>{" "}
                                        {candidate.email}
                                    </p>
                                )}
                                {candidate.address && (
                                    <p className="text-lg">
                                        <strong>Address:</strong>{" "}
                                        {candidate.address}
                                    </p>
                                )}
                            </div>
                            <div className="mb-4">
                                <h3 className="text-1xl font-bold mb-2">
                                    Education Background
                                </h3>
                                {candidate.grade_year && (
                                    <p className="text-lg">
                                        <strong>Grade/Year:</strong>{" "}
                                        {candidate.grade_year}
                                    </p>
                                )}
                                {candidate.course_strand && (
                                    <p className="text-lg">
                                        <strong>Course/Strand:</strong>{" "}
                                        {candidate.course_strand}
                                    </p>
                                )}
                                {candidate.school && (
                                    <p className="text-lg">
                                        <strong>School:</strong>{" "}
                                        {candidate.school}
                                    </p>
                                )}
                            </div>
                            {candidate.occupation && candidate.company && (
                                <div className="mb-4">
                                    <h3 className="text-1xl font-bold mb-2">
                                        Professional Information
                                    </h3>
                                    {candidate.occupation && (
                                        <p className="text-lg">
                                            <strong>Ocupation:</strong>{" "}
                                            {candidate.occupation}
                                        </p>
                                    )}
                                    {candidate.company && (
                                        <p className="text-lg">
                                            <strong>Company:</strong>{" "}
                                            {candidate.company}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            <section id="ministry" className="text-black  py-10 lg:py-20">
                <div className="max-w-screen-xl sm:px-7 px-4 mx-auto">
                    <h2 className="text-3xl font-bold mb-3">
                        Ministry Involvement
                    </h2>
                    <div
                        className="py-3 editor-html"
                        dangerouslySetInnerHTML={{
                            __html: candidate.ministry_involvement,
                        }}
                    ></div>
                </div>
            </section>
            {candidate.answers && candidate.answers.length > 0 && (
                <section id="qa" className="text-black  py-10 lg:py-20">
                    <div className="max-w-screen-xl sm:px-7 px-4 mx-auto">
                        <h2 className="text-3xl font-bold mb-3">
                            Get to know them more
                        </h2>
                        {candidate.answers.map((answer, index) => (
                            <div key={`accordion-${answer.id}-wrapper`}>
                                <hr
                                    key={`hr-${answer.id}`}
                                    className="w-full lg:mt-10 md:mt-12 md:mb-8 my-8"
                                />
                                <Accordion
                                    key={`accordion-${answer.id}`}
                                    title={answer.question_text}
                                    content={answer.answer}
                                    index={index}
                                />
                            </div>
                        ))}
                    </div>
                </section>
            )}
            <section
                id="CTA"
                className="bg-gradient-to-b from-black to-slate-950 overlay-wrapper"
            >
                <div className="max-w-screen-xl sm:px-7 px-4 py-10 lg:py-20 mx-auto overlay-text">
                    <div className="p-10 lg:p-20 bg-gradient-to-b from-white to-gray-300 rounded-lg">
                        <div className="lg:grid lg:grid-cols-12 items-center">
                            <div className="text-black lg:col-span-8 flex flex-col">
                                <h2 className="font-semibold text-gray-400 lg:col-span-12">
                                    Be Part of Choosing Servant Leaders.
                                </h2>
                                <h2 className="text-4xl font-medium lg:text-7xl">
                                    Don't wait,
                                    <br /> your{" "}
                                    <span className="text-red-500 font-bold">
                                        vote
                                    </span>{" "}
                                    matters!
                                </h2>
                                <span className="text-gray-600 pt-4 text-[20px] leading-[26px]">
                                    Every vote is a step toward raising leaders
                                    who serve first, lead with compassion, and
                                    guide with faith.
                                </span>
                            </div>
                            <div className="mt-10 lg:mt-0 lg:col-start-9 lg:col-span-4 flex">
                                <a
                                    href=""
                                    className="ml-0 lg:ml-auto bg-red-500 text-white font-bold py-2 px-8 rounded-3xl text-2xl hover:bg-blue-500"
                                >
                                    Vote Now
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="overlay-img h-[100%]">
                    <img
                        className="opacity-75 object-cover sm:w-full h-[100%]"
                        src={ctaOverlay}
                    />
                </div>
            </section>
        </>
    );
}
