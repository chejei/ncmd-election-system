import React from 'react';
import { useSetting } from "../components/SettingContext";
import { formatDate } from "../utils/formatDate";
import headingBanner from '../assets/images/heading-background.png';


export default function Guidelines() {
    const siteName = useSetting("site_name", "");
    const startDate = formatDate(useSetting("start_date", ""));
    const endDate = formatDate(useSetting("end_date", ""));
    console.log(siteName);
    return (
    <>
        <section 
            id="heading" 
            className="bg-white py-20 bg-cover bg-center"
            style={{ backgroundImage: `url(${headingBanner})` }}>
            <div className="h-[200px]  mx-auto sm:px-7 px-4 max-w-screen-xl flex items-center"> 
                <h1 className="text-5xl text-white font-bold">Online Election Guidelines</h1> 
            </div>
        </section>
        <section id="guidelines" className="bg-white text-black gradiant-articles">
         <div className="max-w-screen-xl sm:px-7 px-4 py-10 lg:py-20 mx-auto">
            <ol className='list-decimal guidelines-list sm:px-7 px-4'>
                <li>
                    <h4 className="text-1xl font-semibold mb-2  ">Eligibility to Vote</h4>
                    <ul className='list-disc'>
                        <li>Only duly registered and verified members and delegates of NCMD are eligible to vote.</li>
                        <li>Each voter is entitled to one vote per position.</li>
                        <li>Voter credentials (PIN or unique code) are confidential and must not be shared.</li>
                    </ul>
                </li>
                <li>
                    <h4 className="text-1xl font-semibold mb-2  ">Accessing the Election System</h4>
                    <ul className='list-disc'>
                        <li>Go to the official election site: {siteName | ''}.</li>
                        <li>Log in using your assigned voter credentials.</li>
                        <li>If you encounter login issues, contact the election committee immediately.</li>
                    </ul>
                </li>
                <li>
                    <h4 className="text-1xl font-semibold mb-2  ">Voting Procedure</h4>
                    <ul className='list-disc'>
                        <li>After logging in, you will be directed to a Welcome Page</li>
                        <li>Click Start Voting to proceed to the ballot form</li>
                        <li>Step 1: Fill Out Your Ballot Form – choose your preferred candidate for each position</li>
                        <li>Step 2: Review Your Ballot – a summary table will show all the candidates you have selected</li>
                        <li>Final Step: Capture Your Photo – take a photo for identity verification to ensure election integrity and prevent fraud</li>
                        <li>Click Submit Ballot to finalize your vote</li>
                        <li>You will be redirected to a Thank You Page confirming that your vote has been successfully recorded</li>
                    </ul>
                    <p className='italic'>Note: Once submitted, ballots cannot be edited or resubmitted.</p>
                </li>
                <li>
                    <h4 className="text-1xl font-semibold mb-2  ">Voting Period</h4>
                    <ul className='list-disc'>
                        <li>The election system will open on: {startDate || 'TBA' }</li>
                        <li>The election system will close on: {endDate || 'TBA' }</li>
                        <li>Votes cast outside this period will not be counted.</li>
                    </ul>
                </li>
                <li>
                    <h4 className="text-1xl font-semibold mb-2  ">Confidentiality & Integrity</h4>
                    <ul className='list-disc'>
                        <li>All votes are anonymous and securely recorded.</li>
                        <li>The election committee will oversee and validate results to ensure fairness and transparency.</li>
                        <li>Any attempt to manipulate or compromise the system will result in disqualification and possible disciplinary action.</li>
                    </ul>
                </li>
                <li>
                    <h4 className="text-1xl font-semibold mb-2  ">Results Announcement</h4>
                    <ul className='list-disc'>
                        <li>Results will be tabulated automatically after the voting period ends.</li>
                        <li>Official winners will be announced by the NCMD Election Committee through the site and official communication channels.</li>
                    </ul>
                </li>
                <li>
                    <h4 className="text-1xl font-semibold mb-2  ">Theme Reminder</h4>
                    <p>This election is guided by the principle:</p>
                    <p> "Electing Servant Leaders – Serve First, Lead with Compassion, Guide with Faith."</p>
                    <p>Every vote is a prayerful choice to raise leaders who embody humility, integrity, and Christ-like service. </p>
                </li>
            </ol>    
         </div>
        </section>
    </>
    );
}