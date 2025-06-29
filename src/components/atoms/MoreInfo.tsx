import React from "react";

type Props = {
  message: string;
  className?: string;
};

export default function MoreInfo({ message, className = "" }: Props) {
  return (
    <div className={`relative group inline-block ${className}`}>
      <div
        className={`
          w-5 h-5 rounded-full 
          bg-purple-light text-purple-800 
          flex items-center justify-center 
          text-xs font-bold cursor-pointer 
          hover:bg-purple-primary hover:text-white 
          transition
        `}
      >
        ?
      </div>

      {/* Tooltip */}
      <div
        className={`
          absolute z-10 hidden group-hover:block
          bg-black text-white text-xs 
          rounded py-1 px-2 
          whitespace-nowrap
          top-full left-1/2 transform -translate-x-1/2 mt-1
          shadow-lg
        `}
      >
        {message}
      </div>
    </div>
  );
}
