import React from "react";

type Props = {
  text?: string;
};

export default function CenteredSpinner({ text = "Cargando..." }: Props) {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center space-x-3 text-gray-800 text-base font-medium pointer-events-none">
      <svg
        className="animate-spin h-6 w-6 text-purple-primary"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v2l3-3-3-3v2a10 10 0 100 20v-2l-3 3 3 3v-2a8 8 0 01-8-8z"
        />
      </svg>
      <span>{text}</span>
    </div>
  );
}
