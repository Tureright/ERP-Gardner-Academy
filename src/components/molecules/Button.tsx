import React from "react";

type Props = {
  text?: string;
  icon?: React.ReactNode;
  variant?: "text" | "text-icon" | "icon";
  onClick?: () => void;
  className?: string;
};

export default function Button({
  text,
  icon,
  variant = "text",
  onClick,
  className = "",
}: Props) {
  let content;

  if (variant === "icon") {
    content = <span>{icon}</span>;
  } else if (variant === "text-icon") {
    content = (
      <span className="flex items-center justify-between w-full gap-2">
        <span>{text}</span>
        <span>{icon}</span>
      </span>
    );
  } else {
    content = <span>{text}</span>;
  }

  // Detecta si ya se incluyó una clase de fondo (bg-...)
  const hasBgClass = /\bbg-[\w-]+\b/.test(className);
  const finalClassName = `px-4 py-2 rounded-md font-semibold transition hover:bg-purple-primary hover:text-white ${
    hasBgClass ? "" : "bg-purple-light"
  } ${className}`;

  return (
    <button onClick={onClick} className={finalClassName}>
      {content}
    </button>
  );
}
