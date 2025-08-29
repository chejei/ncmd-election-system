import React from 'react';
import { useSetting } from "../components/SettingContext";
import { formatDate } from "../utils/formatDate";
import homeBanner from '../assets/images/home-banner.jpg';
import ctaOverlay from '../assets/images/cta-img.jpg';
import ctaOverlay1 from '../assets/images/leaders.jpg';


export default function Home() {
    const siteName = useSetting("site_name", "");
    const startDate = formatDate(useSetting("start_date", ""));
    const endDate = formatDate(useSetting("end_date", ""));
  return (
    <>
        <section id="hero" className="bg-gradient-to-b from-black to-slate-950 overlay-wrapper">
          <div className="mx-auto sm:px-7 px-4 max-w-screen-xl overlay-text">
              <div className="gap-x-6 px-4 py-16 pb-64 mx-auto lg:grid xl:px-0 lg:grid-cols-12">
                  <h1 id="typing" className="font-sans font-semibold text-white lg:col-span-12">
                      Alliance Youth of the Philippines
                  </h1>
                  <div className="mt-1 text-white lg:col-span-8 lg:mt-3">
                      <h2 className="text-5xl font-medium lg:text-7xl">
                            <span className="text-yellow-500">North Central Mindanao District</span>  
                          <br className="max-sm:hidden lg:hidden xl:block" /> 
                          <span className="text-red-500 font-bold">Elections</span> 
                          <span className="text-blue-500"> 2025</span>
                      </h2>
                  </div>
                  
              </div>
          </div>
          <div className='overlay-img'>
            <img src={homeBanner} />
          </div>
      </section>
      <section id="imageHero" className="bg-white py-10">
          <div className="mx-auto sm:px-7 px-4 max-w-screen-xl">      
              <div className="flex flex-col text-center pb-20 pt-20 lg:pt-28 pb-10 text-black max-w-screen-md mx-auto">
                  <h2 className="text-4xl font-medium lg:text-6xl">Electing <span className="text-red-500 font-bold"
                          >Servant</span> Leader</h2>
                  <span className="text-gray-600 pt-5 text-[20px] leading-[26px]">
                      Choosing leaders who embody humility, integrity, and Christ-like service. It is our mission to raise leaders who serve first, lead with compassion, and guide with faith
                  </span>
              </div>
              <div className="pb-10 lg:pb-20">
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                      <div>
                          <h2 className="mt-4 text-xl font-semibold text-gray-800">Serve First</h2>
                          <p className="mt-2 text-gray-500">True leadership begins with humility. Putting the needs of others above personal ambition. A servant leader listens, supports, and uplifts the community, following Christ's example of washing His disciples' feet. Service is not secondary to leadership—it is the foundation of it.</p>
                      </div>

                      <div>
                          <h2 className="mt-4 text-xl font-semibold text-gray-800">Lead with Compassion</h2>
                          <p className="mt-2 text-gray-500">Guiding others with empathy, kindness, and understanding. A compassionate leader values people over power, showing patience and love in decision-making and ensuring that every voice is heard.</p>
                      </div>

                      <div>
                          <h2 className="mt-4 text-xl font-semibold text-gray-800">Guide with Faith</h2>
                          <p className="mt-2 text-gray-500">Faith is the compass of a servant leader. Leading in alignment with God’s Word, trusting His wisdom above all. It is about inspiring others to remain steadfast in their spiritual journey, ensuring that every action and decision reflects Christ-centered values.</p>
                      </div>
                  </div>
              </div>
          </div>
      </section>
      <section id="image" className="bg-gradient-to-b from-black to-slate-950  bg-black overlay-wrapper">
          <div className="max-w-screen-xl sm:px-7 px-4 py-10 lg:py-20 mx-auto overlay-text">
              <div className="p-10 lg:p-20 bg-opacity rounded-lg">
                    <h2 className="text-4xl font-medium lg:text-7xl">Get to Know Your your <span className="text-blue-500 font-bold">Candidates</span>!</h2>
                    <p className="text-gray-600 pt-4 pb-6 text-[20px] leading-[26px]">Before casting your vote, take time to learn about the candidates—their background, values, and commitment to servant leadership. An informed choice builds a stronger future for NCMD.
                          </p>
                    <a href="/candidates"
                        className="bg-blue-500 text-white font-bold py-2 px-8 rounded-3xl text-2xl hover:bg-red-500">
                        Meet the Candidates
                    </a>
              </div>
          </div>
          <div className='overlay-img w-full'>
            <img className="object-cover w-full" src={ctaOverlay1} />
          </div>
      </section>
      <section id="guidelines" className="bg-white text-black gradiant-articles">
         <div className="max-w-screen-xl sm:px-7 px-4 py-10 lg:py-20 mx-auto">
            <h3 className="text-5xl font-semibold mb-4  ">Online Election Guidelines</h3>
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
                        <li>Go to the official election site: {siteName}.</li>
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
                        <li>The election system will open on: {startDate || "TBA" }</li>
                        <li>The election system will close on: {endDate || "TBA" }</li>
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
      <section id="CTA" className='bg-gradient-to-b from-black to-slate-950 overlay-wrapper'>
          <div className="max-w-screen-xl sm:px-7 px-4 py-10 lg:py-20 mx-auto overlay-text">
              <div className="p-10 lg:p-20 bg-gradient-to-b from-white to-gray-300 rounded-lg">
                  <div className="lg:grid lg:grid-cols-12 items-center">
                      <div className="text-black lg:col-span-8 flex flex-col">
                          <h2 className="font-semibold text-gray-400 lg:col-span-12">Be Part of Choosing Servant Leaders.</h2>
                          <h2 className="text-4xl font-medium lg:text-7xl">Don't wait,<br/> your <span className="text-red-500 font-bold"
                                  >vote</span> matters!</h2>
                          <span className="text-gray-600 pt-4 text-[20px] leading-[26px]">Every vote is a step toward raising leaders who serve first, lead with compassion, and guide with faith.
                          </span>
                      </div>
                      <div className="mt-10 lg:mt-0 lg:col-start-9 lg:col-span-4 flex">
                          <a href=""
                              className="ml-0 lg:ml-auto bg-red-500 text-white font-bold py-2 px-8 rounded-3xl text-2xl hover:bg-blue-500">
                             Vote Now
                          </a>
                      </div>
                  </div>
              </div>
          </div>
          <div className='overlay-img'>
            <img className='opacity-75' src={ctaOverlay} />
          </div>
      </section>
    </>
  );
}
