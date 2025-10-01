import React from "react";
import { useSetting } from "../components/SettingContext";
import InnerBanner from "../components/InnerBanner";

export default function PrivacyPolicy() {
    const siteName = useSetting("site_name", "");
    return (
        <>
            <InnerBanner title="Privacy Policy" />
            <section
                id="guidelines"
                className="bg-white text-black gradiant-articles"
            >
                <div className="max-w-screen-xl sm:px-7 px-4 py-10 lg:py-20 mx-auto">
                    <p className="text-gray-700 mb-8">
                        {siteName} values your trust. This Privacy Policy
                        explains how we collect, use, and protect your
                        information when you participate in the online election.
                    </p>
                    <ol className="list-decimal guidelines-list sm:px-7 px-4">
                        <li>
                            <h4 className="text-xl font-semibold mb-2  ">
                                Information We Collect
                            </h4>
                            <ul className="list-disc">
                                <li>
                                    Personal details provided during
                                    registration (e.g., name, email, church
                                    affiliation, voter credentials).
                                </li>
                                <li>
                                    Login credentials used to access the system.
                                </li>
                                <li>
                                    Voting activity (ballot choices are securely
                                    recorded but remain anonymous).
                                </li>
                            </ul>
                        </li>
                        <li>
                            <h4 className="text-xl font-semibold mb-2  ">
                                How We Use Your Information
                            </h4>
                            <ul className="list-disc">
                                <li>To verify voter eligibility.</li>
                                <li>
                                    To provide secure access to the online
                                    voting system.
                                </li>
                                <li>
                                    To ensure the accuracy and integrity of the
                                    election process.
                                </li>
                                <li>
                                    To communicate important election updates.
                                </li>
                            </ul>
                        </li>
                        <li>
                            <h4 className="text-xl font-semibold mb-2  ">
                                Confidentiality of Votes
                            </h4>
                            <ul className="list-disc">
                                <li>
                                    All individual votes are anonymous and
                                    cannot be traced back to the voter.
                                </li>
                                <li>
                                    The system records only the final tally for
                                    each candidate.
                                </li>
                            </ul>
                        </li>
                        <li>
                            <h4 className="text-xl font-semibold mb-2  ">
                                Data Security
                            </h4>
                            <ul className="list-disc">
                                <li>
                                    All data is securely stored and protected by
                                    encryption.
                                </li>
                                <li>
                                    Voter credentials are unique and must not be
                                    shared.
                                </li>
                                <li>
                                    Election officials monitor the system to
                                    maintain fairness.
                                </li>
                            </ul>
                        </li>
                        <li>
                            <h4 className="text-xl font-semibold mb-2  ">
                                Data Sharing
                            </h4>
                            <ul className="list-disc">
                                <li>
                                    No personal information will be sold or
                                    distributed to third parties.
                                </li>
                                <li>
                                    Data may only be accessed by authorized
                                    election officials.
                                </li>
                            </ul>
                        </li>
                        <li>
                            <h4 className="text-xl font-semibold mb-2  ">
                                Retention of Data
                            </h4>
                            <ul className="list-disc">
                                <li>
                                    Data will be kept only for the duration of
                                    the election and verification process.
                                </li>
                                <li>
                                    After the election, personal data will be
                                    securely deleted, except where required for
                                    official records.
                                </li>
                            </ul>
                        </li>
                        <li>
                            <h4 className="text-xl font-semibold mb-2  ">
                                Policy Updates
                            </h4>
                            <p>
                                This Privacy Policy may be updated as needed.
                                Any changes will be communicated through
                                official NCMD channels.
                            </p>
                        </li>
                    </ol>
                </div>
            </section>
        </>
    );
}
