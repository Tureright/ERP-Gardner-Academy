import React from "react";

type Props = {
  text?: string;
  icon?: React.ReactNode;
  variant?: "text" | "text-icon" | "icon";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};

export default function Button({
  text,
  icon,
  variant = "text",
  onClick,
  className = "",
  disabled = false,
}: Props) {
  // Detecta si ya se incluyó una clase de fondo (bg-...)
  const hasBgClass = /\bbg-[\w-]+\b/.test(className);
  const hasHovertextClass = /\bhover:text-[\w-]+\b/.test(className);
  const hasHoverBgClass = /\bhover:bg-[\w-]+\b/.test(className);
  const finalClassName = `h-[50px] px-4 py-2 rounded-md font-semibold transition flex items-center justify-center gap-2 group 
  ${hasBgClass ? "" : " bg-purple-light "} 
  ${className} ${disabled ? " opacity-50 cursor-not-allowed " : ""} 
  ${hasHovertextClass ? "" : " hover:text-white "}
  ${hasHoverBgClass ? "" : " hover:bg-purple-primary "}
  `;

  return (
    <button onClick={onClick} className={finalClassName} disabled={disabled}>
      {variant !== "icon" && !!text && <span>{text}</span>}
      {icon && <span>{icon}</span>}
    </button>
  );
}

