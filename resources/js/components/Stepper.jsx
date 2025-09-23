// Stepper.jsx
import { CheckIcon } from "../assets/icons/icon";

export default function Stepper({ steps, currentStep }) {
    return (
        <ol className="lg:flex items-top w-full space-y-4 lg:space-x-8 lg:space-y-0 mb-6">
            {steps.map((step) => {
                const isCompleted = currentStep > step.number;
                const isActive = currentStep === step.number;
                const isUpcoming = currentStep < step.number;

                return (
                    <li key={step.number} className="flex-1">
                        <span
                            className={`border-l-2 flex flex-row items-center border-t-0 pl-4 pt-0 border-solid font-medium
                            lg:pt-4 lg:border-t-2 lg:border-l-0 lg:pl-0
                            ${isCompleted ? "text-blue-600" : ""}
                            ${isActive ? "text-blue-300" : ""}
                            ${isUpcoming ? "text-gray-400" : ""}
                          `}
                        >
                            <span
                                className={`w-8 h-8 rounded-full flex justify-center items-center mr-3 text-sm border p-2
                                  ${
                                      isActive
                                          ? "bg-blue-50 border-blue-600 text-blue-600"
                                          : ""
                                  }
                                  ${isCompleted ? "bg-blue-600 text-white" : ""}
                                `}
                            >
                                {isCompleted ? (
                                    <CheckIcon className="w-4 h-4" />
                                ) : (
                                    `0${step.number}`
                                )}
                            </span>
                            <h4
                                className={`text-base lg:text-sm
                                  ${isActive ? "text-blue-300" : ""}
                                  ${isCompleted ? "text-blue-600" : ""}
                                  ${isUpcoming ? "text-gray-400" : ""}
                                `}
                            >
                                {step.label}
                            </h4>
                        </span>
                    </li>
                );
            })}
        </ol>
    );
}
