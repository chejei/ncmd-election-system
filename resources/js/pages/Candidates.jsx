import { useEffect, useState } from "react";
import ctaOverlay from "../assets/images/cta-img.jpg";
import { ReadMoreIcon } from "../assets/icons/icon";
import axios from "../api/axios";
import InnerBanner from "../components/InnerBanner";

export default function Candidates() {
    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await axios.get("/api/meet-candidates");
                setPositions(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const hasCandidates = positions.some((pos) => pos.candidate_count > 0);
    if (positions.length > 0 && !hasCandidates) {
        return (
            <>
                <section className="bg-white flex flex-col items-center text-center justify-center px-4 min-h-[80vh] md:min-h-screen">
                    <h2 className="text-3xl font-bold text-gray-800">
                        Candidate lineup coming soon!
                    </h2>
                    <p className="text-gray-500 mt-3">
                        Please check back later for updates.
                    </p>
                </section>
            </>
        );
    }

    return (
        <>
            <InnerBanner title="Our Election Candidates" />
            <section className="bg-white py-10">
                <div className="mx-auto sm:px-7 px-4 max-w-screen-xl">
                    {positions.length === 0 ? (
                        <p className="text-center text-gray-500">Loading...</p>
                    ) : (
                        positions
                            .filter((pos) => pos.candidate_count > 0)
                            .map((pos) => (
                                <div key={pos.id} className="mb-8">
                                    <h2 className="text-3xl font-semibold mb-4">
                                        {pos.title}
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {pos.candidates.map((cand) => (
                                            <div
                                                key={cand.id}
                                                className="border rounded-lg p-4 shadow hover:shadow-md transition"
                                            >
                                                <img
                                                    src={
                                                        cand.photo
                                                            ? `/storage/${cand.photo}`
                                                            : "/images/user-placeholder.png"
                                                    }
                                                    alt={cand.first_name}
                                                    className="w-full h-100 object-cover object-top rounded-md mb-3"
                                                />
                                                <h3 className="text-lg font-medium">
                                                    {cand.full_name}
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-3">
                                                    {cand.church_name}
                                                </p>
                                                <a
                                                    href={`candidate/${cand.slug}`}
                                                    className="inline-flex items-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-3xl text-sm px-5 py-2.5 me-2 mb-2"
                                                >
                                                    Read more
                                                    <ReadMoreIcon />
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                    )}
                </div>
            </section>
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
                                <h2 className="font-medium text-3xl md:text-4xl lg:text-7xl">
                                    Don't wait,
                                    <br /> your{" "}
                                    <span className="text-red-500 font-bold">
                                        vote
                                    </span>{" "}
                                    matters!
                                </h2>
                                <span className="text-gray-600 pt-4 text-[18px] leading-[24px] md:text-[20px] md:leading-[26px]">
                                    Every vote is a step toward raising leaders
                                    who serve first, lead with compassion, and
                                    guide with faith.
                                </span>
                            </div>
                            <div className="mt-10 lg:mt-0 lg:col-start-9 lg:col-span-4 flex">
                                <a
                                    href="/vote"
                                    className="ml-0 lg:ml-auto bg-red-500 text-white font-bold py-2 px-8 rounded-3xl text-xl sm:text-2xl hover:bg-blue-500"
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
