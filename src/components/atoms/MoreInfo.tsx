import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";

type Props = {
  message: string;
  className?: string;
};

export default function MoreInfo({ message, className = "" }: Props) {
  const iconRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, transformX: "-50%" });
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible && iconRef.current && tooltipRef.current) {
      const iconRect = iconRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const screenWidth = window.innerWidth;

      let left = iconRect.left + iconRect.width / 2 + window.scrollX;
      let transformX = "-50%";

      // 🧠 Auto-ajuste para no salirse del borde derecho
      if (left + tooltipRect.width / 2 > screenWidth - 8) {
        left = screenWidth - tooltipRect.width - 8;
        transformX = "0";
      }

      // 🧠 Auto-ajuste para no salirse del borde izquierdo
      if (left - tooltipRect.width / 2 < 8) {
        left = 8;
        transformX = "0";
      }

      const top = iconRect.bottom + window.scrollY + 8;

      setPosition({ top, left, transformX });
    }
  }, [visible]);

  return (
    <>
      <div
        ref={iconRef}
        className={`inline-block relative cursor-pointer ${className}`}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        <div className="w-6 h-6 rounded-full bg-purple-200 text-purple-800 flex items-center justify-center font-bold hover:bg-purple-600 hover:text-white transition">
          ?
        </div>
      </div>

      {visible &&
        createPortal(
          <div
            ref={tooltipRef}
            className="z-[9999] bg-black text-white rounded px-3 py-2 shadow-lg"
            style={{
              position: "absolute",
              top: position.top,
              left: position.left,
              transform: `translateX(${position.transformX})`,
              whiteSpace: "normal",
              wordBreak: "break-word",
              overflowWrap: "anywhere",
              maxWidth: "300px",
              width: "max-content",
              maxHeight: "200px",
              overflowY: "auto",
            }}
          >
            {message}
          </div>,
          document.body
        )}
    </>
  );
}
