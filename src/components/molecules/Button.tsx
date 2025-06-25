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
  const finalClassName = `h-[50px] px-4 py-2 rounded-md font-semibold transition hover:bg-purple-primary hover:text-white flex items-center justify-center gap-2 ${
    hasBgClass ? "" : "bg-purple-light"
  } ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`;

  return (
    <button onClick={onClick} className={finalClassName} disabled={disabled}>
      {variant !== "icon" && !!text && <span>{text}</span>}
      {icon && <span>{icon}</span>}
    </button>
  );
}
