import React, { useState } from "react";

type LazyImageProps = {
  src: string;
  alt: string;
  className?: string;
};

/**
 * Carga la imagen de forma lazy y muestra un placeholder
 * hasta que esté lista.
 */
export default function LazyImage({ src, alt, className = "" }: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`${className} relative overflow-hidden`}>
      {/* Placeholder: gris animado */}
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
