import React from "react";
import { useGetEmployees13erSueldo } from "@/hooks/useEmployee";
import LoadingText from "@/components/atoms/LoadingText";

export default function Table13er() {
  const { data, isLoading, error } = useGetEmployees13erSueldo();

  if (isLoading) return <LoadingText text="Cargando décimos terceros..." />;
  if (error) return <p>Error al cargar datos: {error.message}</p>;

  const empleados = data?.data ?? [];

  const totalGlobal = empleados.reduce(
    (acc, e) => acc + (Number(e.total13er) || 0),
    0
  );

  return (
    <div className="flex flex-col w-full space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3 text-sm font-semibold">Docente</th>
              <th className="p-3 text-sm font-semibold text-right">
                13er Acumulado
              </th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((emp) => (
              <tr
                key={emp.empleado}
                className="border-t border-gray-300 hover:bg-gray-50"
              >
                <td className="p-3 text-sm">{emp.fullName}</td>
                <td className="p-3 text-sm text-right">
                  ${Number(emp.total13er).toFixed(2)}
                </td>
              </tr>
            ))}
            <tr className="border-t border-gray-300 bg-gray-200 text-gray-700 font-semibold">
              <td className="p-3 text-sm">Total</td>
              <td className="p-3 text-sm text-right">
                ${totalGlobal.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
