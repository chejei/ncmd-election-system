import React, { useEffect, useState } from "react";
import Tabs from "../../components/Tabs";
import axios from "../../api/axios";

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [churchesByZone, setChurchesByZone] = useState({});
    const [activeTab, setActiveTab] = useState("");
    const [activeChurchTab, setActiveChurchTab] = useState({});
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get("/api/statistics");
                setStats(res.data);
                setChurchesByZone(res.data.churches_by_zone);

                // Only set activeTab if it's empty (first load)
                setActiveTab(
                    (prev) =>
                        prev || Object.keys(res.data.churches_by_zone)[0] || ""
                );
            } catch (error) {
                console.error("Error fetching statistics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();

        const interval = setInterval(fetchStats, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (
            activeTab &&
            churchesByZone[activeTab]?.length > 0 &&
            !activeChurchTab[activeTab]
        ) {
            setActiveChurchTab((prev) => ({
                ...prev,
                [activeTab]: "0",
            }));
        }
    }, [activeTab, churchesByZone]);

    const tabItems = React.useMemo(() => {
        return Object.keys(churchesByZone).map((zone) => ({
            key: zone,
            label: `Zone ${zone}`,
        }));
    }, [churchesByZone]);

    const churchTabs = React.useMemo(() => {
        if (!activeTab || !churchesByZone[activeTab]) return [];

        return churchesByZone[activeTab].map((church, index) => ({
            key: index.toString(),
            label: church.church_name,
        }));
    }, [activeTab, churchesByZone]);

    const activeChurch = React.useMemo(() => {
        if (
            !activeTab ||
            activeChurchTab[activeTab] === undefined ||
            !churchesByZone[activeTab]
        ) {
            return null;
        }

        return (
            churchesByZone[activeTab][Number(activeChurchTab[activeTab])] ||
            null
        );
    }, [activeTab, activeChurchTab, churchesByZone]);

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
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
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
                            .filter((pos) => pos.approved_candidates.length > 0)
                            .map((pos) => {
                                const sorted = [
                                    ...pos.approved_candidates,
                                ].sort((a, b) => b.vote_count - a.vote_count);

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
                <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                    <div className="overflow-x-auto">
                        <div className="text-lg font-semibold">
                            Most Recent Voters Import
                        </div>
                        <table className="w-full text-sm text-left rtl:text-right text-body">
                            <thead className="text-sm text-body bg-neutral-secondary-soft border-b rounded-base border-default">
                                <tr>
                                    <th
                                        scope="col"
                                        className="pl-0  px-6 py-3 font-medium"
                                    >
                                        Church Name
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 font-medium"
                                    >
                                        Voters
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recent_church_imports.map(
                                    (church, index) => (
                                        <tr
                                            key={index}
                                            className="bg-neutral-primary border-b border-default"
                                        >
                                            <th
                                                scope="row"
                                                className="pl-0 px-6 py-4 font-medium text-heading whitespace-nowrap"
                                            >
                                                {church.church_name}
                                            </th>
                                            <td className="px-6 py-4">
                                                {church.total_voters}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md lg:col-span-4">
                    <Tabs
                        tabs={tabItems}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />

                    <div className="mt-4">
                        {activeTab && churchesByZone[activeTab]?.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                                    <div className="bg-white">
                                        <div className="overflow-x-auto">
                                            <div className="text-md mb-4 font-semibold">
                                                Zone {activeTab} Current Votes
                                            </div>
                                            {Object.keys(
                                                stats.zones[activeTab].positions
                                            ).length > 0 ? (
                                                Object.entries(
                                                    stats.zones[activeTab]
                                                        .positions
                                                ).map(
                                                    ([
                                                        positionTitle,
                                                        candidates,
                                                    ]) => (
                                                        <div
                                                            key={positionTitle}
                                                            className="mb-4"
                                                        >
                                                            <h5 className="text-sm font-bold">
                                                                {positionTitle}
                                                            </h5>
                                                            {candidates.length >
                                                            0 ? (
                                                                <ul className="ml-4 list-disc">
                                                                    {candidates.map(
                                                                        (
                                                                            cand
                                                                        ) => {
                                                                            const percentage =
                                                                                stats
                                                                                    .zones[
                                                                                    activeTab
                                                                                ]
                                                                                    .voter_count >
                                                                                0
                                                                                    ? (cand.votes /
                                                                                          stats
                                                                                              .zones[
                                                                                              activeTab
                                                                                          ]
                                                                                              .voter_count) *
                                                                                      100
                                                                                    : 0;

                                                                            return (
                                                                                <li
                                                                                    key={
                                                                                        cand.full_name
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        cand.full_name
                                                                                    }{" "}
                                                                                    –{" "}
                                                                                    {
                                                                                        cand.votes
                                                                                    }{" "}
                                                                                    votes
                                                                                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                                                                                        <div
                                                                                            className="bg-blue-600 h-1.5 rounded-full"
                                                                                            style={{
                                                                                                width: `${percentage}%`,
                                                                                            }}
                                                                                        ></div>
                                                                                    </div>
                                                                                </li>
                                                                            );
                                                                        }
                                                                    )}
                                                                </ul>
                                                            ) : (
                                                                <p className="ml-4 text-sm text-gray-500">
                                                                    No votes are
                                                                    currently
                                                                    occurring on
                                                                    this
                                                                    position.
                                                                </p>
                                                            )}
                                                        </div>
                                                    )
                                                )
                                            ) : (
                                                <p className="text-gray-500">
                                                    No votes are currently
                                                    occurring on this zone.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="bg-white  border border-gray-100 p-2 rounded-md lg:col-span-3">
                                        <Tabs
                                            tabs={churchTabs}
                                            activeTab={
                                                activeChurchTab[activeTab]
                                            }
                                            onTabChange={(churchId) =>
                                                setActiveChurchTab((prev) => ({
                                                    ...prev,
                                                    [activeTab]: churchId,
                                                }))
                                            }
                                        />

                                        <div className="p-4">
                                            {activeChurch ? (
                                                <>
                                                    <p className="mb-4">
                                                        Showing data for{" "}
                                                        <span className="font-semibold">
                                                            {
                                                                activeChurch.church_name
                                                            }
                                                        </span>
                                                    </p>
                                                    {Object.entries(
                                                        activeChurch.positions
                                                    ).map(
                                                        ([
                                                            positionTitle,
                                                            candidates,
                                                        ]) => {
                                                            return (
                                                                <div
                                                                    key={
                                                                        positionTitle
                                                                    }
                                                                    className="mb-2 mt-2"
                                                                >
                                                                    <h5 className="text-sm font-bold">
                                                                        {
                                                                            positionTitle
                                                                        }
                                                                    </h5>

                                                                    <ul className="ml-4 list-disc">
                                                                        {candidates?.length >
                                                                        0 ? (
                                                                            <>
                                                                                {candidates.map(
                                                                                    (
                                                                                        candidate
                                                                                    ) => {
                                                                                        const percentage =
                                                                                            stats
                                                                                                .zones[
                                                                                                activeTab
                                                                                            ]
                                                                                                .voter_count >
                                                                                            0
                                                                                                ? (candidate.votes /
                                                                                                      stats
                                                                                                          .zones[
                                                                                                          activeTab
                                                                                                      ]
                                                                                                          .voter_count) *
                                                                                                  100
                                                                                                : 0;
                                                                                        return (
                                                                                            <>
                                                                                                <li
                                                                                                    key={
                                                                                                        candidate.full_name
                                                                                                    }
                                                                                                >
                                                                                                    {
                                                                                                        candidate.full_name
                                                                                                    }{" "}
                                                                                                    –{" "}
                                                                                                    {
                                                                                                        candidate.votes
                                                                                                    }{" "}
                                                                                                    votes
                                                                                                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                                                                                                        <div
                                                                                                            className="bg-blue-600 h-1.5 rounded-full"
                                                                                                            style={{
                                                                                                                width: `${percentage}%`,
                                                                                                            }}
                                                                                                        ></div>
                                                                                                    </div>
                                                                                                </li>
                                                                                            </>
                                                                                        );
                                                                                    }
                                                                                )}
                                                                            </>
                                                                        ) : (
                                                                            <p className="text-sm text-gray-500">
                                                                                No
                                                                                voters
                                                                                in
                                                                                this
                                                                                church.
                                                                            </p>
                                                                        )}
                                                                    </ul>
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </>
                                            ) : (
                                                <p className="text-sm text-gray-500">
                                                    Select a church to view
                                                    data.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p>No churches in this zone.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
