import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { PieChart, Pie, Cell } from "recharts";

export default function ElectionResult() {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        // function to fetch stats
        const fetchStats = async () => {
            try {
                const res = await axios.get("/api/statistics");
                setStats(res.data);
            } catch (error) {
                console.error("Error fetching statistics:", error);
            }
        };

        fetchStats();

        // refresh stats every 60s
        const statsInterval = setInterval(fetchStats, 60000);

        // update time every second
        const timeInterval = setInterval(() => {
            setDateTime(new Date());
        }, 1000);

        // cleanup
        return () => {
            clearInterval(statsInterval);
            clearInterval(timeInterval);
        };
    }, []);

    function ordinalSuffix(n) {
        const s = ["th", "st", "nd", "rd"],
            v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }

    if (!stats) {
        return navigate(-1);
    }

    const registeredVoters = stats.total_voters;
    const totalVoted = stats.total_returns;

    const formatDateTime = (date) => {
        const time = date.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
        const formattedDate = date.toLocaleDateString([], {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
        return `${time} - ${formattedDate}`;
    };

    return (
        <>
            <section
                id="candidates-result"
                className="bg-white overlay-wrapper"
            >
                <div className="mx-auto sm:px-7 px-4 py-10 lg:py-20 max-w-screen-xl overlay-text">
                    <div className="flex flex-col gap-4 sm:gap-0 sm:flex-row items-center">
                        <div className="flex-1">
                            <h1
                                id="typing"
                                className="font-sans font-semibold text-black lg:col-span-12"
                            >
                                Alliance Youth of the Philippines
                            </h1>
                            <div className="mt-1 text-white lg:col-span-8 lg:mt-3">
                                <h2 className="text-5xl font-medium lg:text-6xl">
                                    <span className="text-yellow-500">
                                        North Central <br />
                                        Mindanao District{" "}
                                    </span>
                                    <br className="max-sm:hidden lg:hidden xl:block" />
                                    <span className="text-red-500 font-bold">
                                        Elections
                                    </span>
                                    <span className="text-blue-500"> 2025</span>
                                </h2>
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="flex flex-col items-center justify-center">
                                <PieChart width={200} height={200}>
                                    {/* Gray background (100%) */}
                                    <Pie
                                        data={[{ value: registeredVoters }]}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={100}
                                        startAngle={90}
                                        endAngle={-270}
                                        dataKey="value"
                                        isAnimationActive={false}
                                        focusable={false}
                                    >
                                        <Cell fill="#D3D3D3" />
                                    </Pie>

                                    {/* Yellow progress (voted %) */}
                                    <Pie
                                        data={[{ value: totalVoted }]}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={100}
                                        startAngle={90}
                                        endAngle={
                                            90 -
                                            360 *
                                                (totalVoted / registeredVoters)
                                        }
                                        dataKey="value"
                                        isAnimationActive={false}
                                        focusable={false}
                                    >
                                        <Cell fill="#FFD700" />
                                    </Pie>
                                </PieChart>
                                <p className="text-sx mt-3 text-center text-gray-800">
                                    Election Returns transmitted
                                    <br /> {totalVoted} of {registeredVoters}{" "}
                                    Voters As of {formatDateTime(dateTime)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section
                id="candidates-result"
                className="bg-white overlay-wrapper"
            >
                <div className="mx-auto sm:px-7 px-4 max-w-screen-xl overlay-text">
                    <div className="overflow-x-auto">
                        {stats.election_count
                            .filter((pos) => pos.candidates.length > 0)
                            .map((pos) => {
                                const sorted = [...pos.candidates].sort(
                                    (a, b) => b.vote_count - a.vote_count
                                );

                                let currentRank = 0;
                                let lastVote = null;

                                const ranked = sorted.map((cand, index) => {
                                    if (cand.vote_count !== lastVote) {
                                        currentRank++; // increment rank only when votes differ
                                    }
                                    lastVote = cand.vote_count;
                                    return { ...cand, rank: currentRank };
                                });
                                return (
                                    <div key={pos.id} className="mb-6">
                                        <div className="bg-red-600 text-white py-6 px-4 mb-2">
                                            <h3 className="text-2xl font-bold">
                                                {pos.title}
                                            </h3>
                                        </div>
                                        <ul className="mx-2">
                                            {ranked.map((cand, index) => {
                                                const percentage =
                                                    stats.total_voters > 0
                                                        ? (cand.vote_count /
                                                              stats.total_voters) *
                                                          100
                                                        : 0;
                                                return (
                                                    <li
                                                        key={cand.id}
                                                        className="rounded-md inset-shadow-2xs shadow-md/10 p-6 mb-4 flex items-center gap-2"
                                                    >
                                                        <span className="w-10 h-10 flex-none flex justify-center rounded-full text-gray-900 border-1 p-2">
                                                            {ordinalSuffix(
                                                                cand.rank
                                                            )}
                                                        </span>
                                                        <div className="flex-1">
                                                            <span className="font-semibold text-xl mb-2">
                                                                {cand.full_name}{" "}
                                                                –{" "}
                                                                {
                                                                    cand.vote_count
                                                                }{" "}
                                                                votes
                                                            </span>
                                                            <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                                                                <div
                                                                    className="bg-blue-600 h-3 rounded-full"
                                                                    style={{
                                                                        width: `${percentage}%`,
                                                                    }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </section>
        </>
    );
}
