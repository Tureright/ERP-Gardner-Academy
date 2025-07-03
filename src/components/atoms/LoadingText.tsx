import React from 'react'

type Props = {
    text?: string
}

export default function LoadingText({text}: Props) {
  return (
        <div className="flex items-center space-x-2 text-gray-700 text-sm">
      <svg
        className="animate-spin h-4 w-4 text-purple-primary"
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
  )
}