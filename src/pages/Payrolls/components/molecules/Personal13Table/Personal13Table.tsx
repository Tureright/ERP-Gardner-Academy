import React, { useEffect } from "react";
import { useGet13erSueldoByEmployeeId } from "@/hooks/useEmployee";
import LoadingText from "@/components/atoms/LoadingText";

interface Props {
  employeeId: string;
  onLoadingChange?: (loading: boolean) => void;
}

export default function Personal13Table({
  employeeId,
  onLoadingChange,
}: Props) {
  const { data, isLoading, error } = useGet13erSueldoByEmployeeId(employeeId);

  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(isLoading);
    }
  }, [isLoading, onLoadingChange]);

  if (isLoading)
    return <LoadingText text="Cargando décimo tercero por mes..." />;
  if (error) return <p>Error al cargar datos: {error.message}</p>;

  const dataByMonth = data.data ?? {};

  const rows = Object.entries(dataByMonth);

  const total = rows.reduce((acc, [_, value]) => {
    const num = Number(value);
    return !isNaN(num) ? acc + num : acc;
  }, 0);

  return (
    <div className="flex flex-col w-full space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3 text-sm font-semibold">Fecha</th>
              <th className="p-3 text-sm font-semibold text-right">Valor</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([month, value]) => (
              <tr
                key={month}
                className="border-t border-gray-300 hover:bg-gray-50"
              >
                <td className="p-3 text-sm">{month}</td>
                <td className="p-3 text-sm text-right">
                  {isNaN(Number(value))
                    ? "---"
                    : `$${Number(value).toFixed(2)}`}
                </td>
              </tr>
            ))}
            <tr className="border-t border-gray-300 bg-gray-200 text-gray-700 font-semibold">
              <td className="p-3 text-sm">Total</td>
              <td className="p-3 text-sm text-right">${total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
