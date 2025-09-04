import { useEffect, useState } from "react";
import ctaOverlay from "../assets/images/cta-img.jpg";
import { ReadMoreIcon } from "../assets/icons/icon";
import axios from "../api/axios";
import headingBanner from "../assets/images/heading-background.png";

export default function Candidates() {
    const [positions, setPositions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("/meet-candidates");
                setPositions(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);
    return (
        <>
            <section
                id="heading"
                className="bg-white py-20 bg-cover bg-center"
                style={{ backgroundImage: `url(${headingBanner})` }}
            >
                <div className="h-[200px]  mx-auto sm:px-7 px-4 max-w-screen-xl flex items-center">
                    <h1 className="text-5xl text-white font-bold">
                        Our Election Candidates
                    </h1>
                </div>
            </section>
            <section id="imageHero" className="bg-white py-10">
                <div className="mx-auto sm:px-7 px-4 max-w-screen-xl">
                    {positions
                        .filter((pos) => pos.candidate_count > 0)
                        .map((pos) => (
                            <div key={pos.id} className="mb-8">
                                {/* Position Title */}
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
                        ))}
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
