import React from "react";
import { EmployeeResponse } from "@/types";
import { useProfilePicture } from "@/hooks/useEmployee";
import LazyImage from "../LazyImage/LazyImage";
type Props = {
  employee: EmployeeResponse;
};

export default function Card({ employee }: Props) {
  const { data, isLoading, error } = useProfilePicture(employee.id);

  // Placeholder de avatar mientras carga
  console.log("data", data);
  const avatarSrc = data
    ? `data:${data.data.mimeType};base64,${data.data.base64}`
    : "";
  console.log("Avatar src:", avatarSrc);
  return (
    <div className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow flex flex-col items-center">
      <div className="w-16 h-16 rounded-full mb-2 overflow-hidden">
        {isLoading || !avatarSrc ? (
          <div className="w-full h-full bg-gray-200 animate-pulse rounded-full" />
        ) : error ? (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500 rounded-full">
            !
          </div>
        ) : (
          <LazyImage
            src={avatarSrc}
            alt={`Avatar de ${employee.firstName}`}
            className="w-16 h-16 rounded-full"
          />
        )}
      </div>

      <p className="text-xs font-semibold text-dark-cyan">
        {employee.firstName}
      </p>
      <p className="text-xs font-semibold text-gray-500">{employee.lastName}</p>
    </div>
  );
}