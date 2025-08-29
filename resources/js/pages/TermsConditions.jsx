import React from 'react';
import { useSetting } from "../components/SettingContext";
import headingBanner from '../assets/images/heading-background.png';

export default function TermsConditions() {
    const siteName = useSetting("site_name", "");
    return (
    <>
        <section 
            id="heading" 
            className="bg-white py-20 bg-cover bg-center"
            style={{ backgroundImage: `url(${headingBanner})` }}>
            <div className="h-[200px]  mx-auto sm:px-7 px-4 max-w-screen-xl flex items-center"> 
                <h1 className="text-5xl text-white font-bold">Terms and Conditions</h1> 
            </div>
        </section>
        <section id="guidelines" className="bg-white text-black gradiant-articles">
         <div className="max-w-screen-xl sm:px-7 px-4 py-10 lg:py-20 mx-auto">
            <p className="text-gray-700 mb-8">
                By accessing and using the {siteName | ''} online voting system, you agree to comply with the following Terms and Conditions.
            </p>
            <ol className='list-decimal guidelines-list sm:px-7 px-4'>
                <li>
                    <h4 className="text-1xl font-semibold mb-2  ">Eligibility</h4>
                    <ul className='list-disc'>
                        <li>Only verified members and delegates of NCMD with voter access are eligible to vote.</li>
                        <li>Voter credentials are unique and non-transferable.</li>
                    </ul>
                </li>
                <li>
                    <h4 className="text-1xl font-semibold mb-2  ">Use of the System</h4>
                    <ul className='list-disc'>
                        <li>Each voter is entitled to cast one (1) ballot only.</li>
                        <li>Votes must be submitted within the official voting period.</li>
                        <li>Once submitted, ballots cannot be changed or withdrawn.</li>
                    </ul>
                </li>
                <li>
                    <h4 className="text-1xl font-semibold mb-2  ">Confidentiality and Security</h4>
                    <ul className='list-disc'>
                        <li>All votes are confidential and securely recorded.</li>
                        <li>Voters are responsible for safeguarding their login credentials.</li>
                        <li>Unauthorized access, sharing, or manipulation attempts will result in disqualification.</li>
                    </ul>
                </li>
                <li>
                    <h4 className="text-1xl font-semibold mb-2  ">Fairness and Integrity</h4>
                    <ul className='list-disc'>
                        <li>The NCMD Election Committee reserves the right to validate and monitor the election process.</li>
                        <li>Any misconduct, tampering, or cheating will not be tolerated.</li>
                    </ul>
                </li>
                <li>
                    <h4 className="text-1xl font-semibold mb-2  ">System Availability</h4>
                    <ul className='list-disc'>
                        <li>The system is maintained for reliability, but temporary interruptions may occur.</li>
                        <li>In such cases, the election committee will provide official guidance.</li>
                    </ul>
                </li>
                <li>
                    <h4 className="text-1xl font-semibold mb-2  ">Results</h4>
                    <ul className='list-disc'>
                        <li>Votes are automatically tallied at the close of the election period.</li>
                        <li>Official winners will be announced by the NCMD Election Committee.</li>
                    </ul>
                </li>
                <li>
                    <h4 className="text-1xl font-semibold mb-2  ">Acceptance</h4>
                    <p>By logging in and casting your vote, you confirm that you have read, understood, and agreed to these Terms and Conditions.</p>
                </li>
            </ol>
         </div>
        </section>
    </>
    );
}