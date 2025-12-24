import React from "react";
import { useSetting } from "../components/SettingContext";
import { formatDate } from "../utils/formatDate";
import InnerBanner from "../components/InnerBanner";
import Slider from "../components/Slider";
import step1img from "../assets/images/steps/step-1.png";
import step2img from "../assets/images/steps/step-2.png";
import step3img from "../assets/images/steps/step-3.gif";
import step4img from "../assets/images/steps/step-4.png";
import step5img from "../assets/images/steps/step-5.png";
import step6img from "../assets/images/steps/step-6.png";
import step7img from "../assets/images/steps/step-7.gif";
import step8img from "../assets/images/steps/confirmation.png";

export default function HowToVote() {
    const siteName = useSetting("site_name", "");
    const startDate = formatDate(useSetting("start_date", ""));
    const endDate = formatDate(useSetting("end_date", ""));

    const items = [
        {
            title: "Step 1: Secure Your Login Credentials",
            text: "To securely obtain your login credentials: please visit <a href=`/voter-verification`>Voter Verification</a> and provide the required information. Once submitted, your PIN code will be issued, which you can use to access your account.",
            img: step1img,
        },
        {
            title: "Step 2: Login to Your Account",
            text: "Enter your Last Name and PIN to access the system. Once logged in, you will be redirected to the Welcome Page.",
            img: step2img,
        },
        {
            title: "Step 3: Start the Voting Process",
            text: "Click the Start Voting button to open the ballot form.",
            img: step3img,
        },
        {
            title: "Step 4: Fill Out Your Ballot",
            text: "Select one candidate per position based on your preference.",
            img: step4img,
        },
        {
            title: "Step 5: Review Your Ballot",
            text: "A summary table will display all your selected candidates. Double-check your selections before proceeding.",
            img: step5img,
        },
        {
            title: "Step 6: Capture Your Photo",
            text: "Take a live photo for identity verification. This helps maintain election integrity and prevent duplicate voting.",
            img: step6img,
        },
        {
            title: "Final Step: Submit Your Ballot",
            text: "Submit Ballot to officially cast your vote.",
            img: step7img,
        },
        {
            title: "Confirmation",
            text: "You will be redirected to a Thank You Page confirming that your vote has been successfully recorded.",
            img: step8img,
        },
    ];

    return (
        <>
            <InnerBanner title="How to Vote" />
            <section
                id="guidelines"
                className="bg-white text-black gradiant-articles"
            >
                <div className="max-w-screen-xl sm:px-7 px-4 py-10 lg:py-20 mx-auto">
                    <h4 className="text-xl font-semibold mb-2  ">
                        Follow these steps to cast your vote securely and
                        successfully:
                    </h4>
                    {/* <Slider items={items} /> */}
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-col text-left border-b border-gray-200 items-start lg:items-center gap-6 bg-white p-6 "
                        >
                            <h3 className="text-xl font-semibold mb-2">
                                {item.title}
                            </h3>
                            <img
                                src={item.img}
                                alt={item.title}
                                className="w-full  h-auto object-contain rounded-md"
                            />
                            <div className="flex-1">
                                <p
                                    className="text-gray-700"
                                    dangerouslySetInnerHTML={{
                                        __html: item.text,
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}
