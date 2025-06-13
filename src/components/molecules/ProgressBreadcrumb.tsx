import React from "react";
import classNames from "classnames";

type Props = {
  steps: string[];
  currentStep: number;
};

export default function ProgressBreadcrumb({ steps, currentStep }: Props) {
  return (
    <div
      className="
        flex flex-col items-start space-y-2 text-sm text-gray-600
        sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0
      "
    >
      {steps.map((step, index) => {
        const isCurrent = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <React.Fragment key={step}>
            <div
              className={classNames(
                "flex items-center text-xs",
                {
                  "text-green-600": isCompleted,
                  "text-blue-600 font-semibold": isCurrent,
                  "text-gray-400": !isCurrent && !isCompleted,
                }
              )}
            >
              <span
                className="
                  rounded-full w-6 h-6 flex items-center justify-center
                  border border-gray-400 mr-2 text-xs
                "
              >
                {index + 1}
              </span>
              {step}
            </div>

            {/* Separador: solo horizontal en sm+ */}
            {index < steps.length - 1 && (
              <span className="hidden sm:inline text-gray-300">/</span>
            )}
          </React.Fragment>
        )
      })}
    </div>
  );
}
