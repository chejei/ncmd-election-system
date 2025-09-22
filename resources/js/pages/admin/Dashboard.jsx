import React, { useEffect, useState } from "react";
import axios from "../../api/axios";

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get("/statistics");
                setStats(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching statistics:", error);
            }
        };

        fetchStats();
        // set interval to refresh every 60s
        const interval = setInterval(fetchStats, 60000);

        // cleanup on unmount
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <div className="p-6">Loading statistics...</div>;
    }

    if (!stats) {
        return (
            <div className="p-6 text-red-500">Failed to load statistics.</div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md lg:col-span-2">
                    <div className="flex justify-between mb-4 items-start">
                        <div className="text-2xl font-semibold">Statistics</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
                        <div className="rounded-md border border-dashed border-gray-200 p-4">
                            <div className="flex items-center mb-0.5">
                                <div className="text-xl font-semibold">
                                    {stats.total_voters}
                                </div>
                            </div>
                            <span className="text-gray-400 text-sm">
                                Total Voter
                            </span>
                        </div>
                        <div className="rounded-md border border-dashed border-gray-200 p-4">
                            <div className="flex items-center mb-0.5">
                                <div className="text-xl font-semibold">
                                    {stats.total_returns}
                                </div>
                            </div>
                            <span className="text-gray-400 text-sm">
                                Election Retrun
                            </span>
                        </div>
                    </div>
                    <div className="flex justify-between mb-4 items-start">
                        <div className="text-lg font-semibold">
                            Voter by Zone
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        {stats.zones &&
                            Object.values(stats.zones).map((zone) => (
                                <div
                                    key={zone.zone}
                                    className="rounded-md border border-dashed border-gray-200 p-4"
                                >
                                    <div className="flex items-center mb-0.5">
                                        <div className="text-xl font-semibold">
                                            {zone.voter_count}
                                        </div>
                                    </div>
                                    <span className="text-gray-400 text-sm">
                                        Zone {zone.zone}
                                    </span>
                                </div>
                            ))}
                    </div>
                </div>
                <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                    <div className="overflow-x-auto">
                        <div className="text-lg font-semibold">
                            Current Votes
                        </div>
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
                                        <h5 className="text-sm font-bold">
                                            {pos.title}
                                        </h5>
                                        <ul className="ml-4 list-disc">
                                            {ranked.map((cand, index) => {
                                                const percentage =
                                                    stats.total_voters > 0
                                                        ? (cand.vote_count /
                                                              stats.total_voters) *
                                                          100
                                                        : 0;
                                                return (
                                                    <li key={cand.id}>
                                                        {cand.full_name} –{" "}
                                                        {cand.vote_count} votes
                                                        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
                                                            <div
                                                                className="bg-blue-600 h-1.5 rounded-full"
                                                                style={{
                                                                    width: `${percentage}%`,
                                                                }}
                                                            ></div>
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
            </div>
        </>
    );
}
