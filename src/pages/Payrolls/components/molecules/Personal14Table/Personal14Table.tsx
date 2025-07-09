import React, { useState, useMemo, useEffect } from "react";
import { useGetMonthsFor14Sueldo } from "@/hooks/useEmployee";
import LoadingText from "@/components/atoms/LoadingText";

interface Props {
  employeeId: string;
  onTotal?: (total14: number) => void;
  onLoadingChange?: (loading: boolean) => void;
}

export default function Personal14Table({ employeeId, onTotal, onLoadingChange }: Props) {
  const { data, isLoading, error } = useGetMonthsFor14Sueldo(employeeId);
  const [sbu, setSbu] = useState(470);
  const [daysWorked, setDaysWorked] = useState<{ [key: string]: number }>({});

    useEffect(() => {
      if (onLoadingChange) {
        onLoadingChange(isLoading);
      }
    }, [isLoading, onLoadingChange]);

  const months = useMemo(() => {
    const now = new Date();
    const baseYear = now.getMonth() >= 7 ? now.getFullYear() + 1 : now.getFullYear();

    return [
      { label: `agosto de ${baseYear - 1}`, key: `agosto-${baseYear - 1}` },
      { label: `septiembre de ${baseYear - 1}`, key: `septiembre-${baseYear - 1}` },
      { label: `octubre de ${baseYear - 1}`, key: `octubre-${baseYear - 1}` },
      { label: `noviembre de ${baseYear - 1}`, key: `noviembre-${baseYear - 1}` },
      { label: `diciembre de ${baseYear - 1}`, key: `diciembre-${baseYear - 1}` },
      { label: `enero de ${baseYear}`, key: `enero-${baseYear}` },
      { label: `febrero de ${baseYear}`, key: `febrero-${baseYear}` },
      { label: `marzo de ${baseYear}`, key: `marzo-${baseYear}` },
      { label: `abril de ${baseYear}`, key: `abril-${baseYear}` },
      { label: `mayo de ${baseYear}`, key: `mayo-${baseYear}` },
      { label: `junio de ${baseYear}`, key: `junio-${baseYear}` },
      { label: `julio de ${baseYear}`, key: `julio-${baseYear}` },
    ];
  }, []);

  const validMonths = useMemo(() => new Set(data?.data ?? []), [data]);

  const sbuDaily = useMemo(() => sbu / 360, [sbu]);

  const rows = useMemo(() => {
    return months.map(({ label, key }) => {
      const defaultDays = validMonths.has(label) ? 30 : 0;
      const days = daysWorked[key] ?? defaultDays;
      const value = parseFloat((sbuDaily * days).toFixed(2));
      return { key, label, days, value };
    });
  }, [months, validMonths, daysWorked, sbuDaily]);

  const total = useMemo(() => {
    return rows.reduce((acc, r) => acc + r.value, 0);
  }, [rows]);

  useEffect(() => {
    if (onTotal) {
      onTotal(total);
    }
  }, [total, onTotal]);

  const handleChange = (key: string, value: string) => {
    const num = Math.max(0, Math.min(30, parseInt(value) || 0));
    setDaysWorked(prev => ({ ...prev, [key]: num }));
  };

  if (isLoading) return <LoadingText text="Cargando información del décimo cuarto sueldo..." />;
  if (error) return <p className="text-red-600">Error al cargar datos: {error.message}</p>;

  return (
    <div className="flex flex-col w-full space-y-4">
      <div className="flex items-center gap-2">
        <label htmlFor="sbu" className="text-sm font-medium">
          Salario Básico Unificado (SBU):
        </label>
        <input
          id="sbu"
          type="number"
          value={sbu}
          onChange={(e) => setSbu(Number(e.target.value))}
          className="border border-gray-300 rounded px-2 py-1 w-24"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3 text-sm font-semibold">Fecha</th>
              <th className="p-3 text-sm font-semibold text-center">Días laborados</th>
              <th className="p-3 text-sm font-semibold text-right">Valor</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ key, label, days, value }) => (
              <tr key={key} className="border-t border-gray-300 hover:bg-gray-50">
                <td className="p-3 text-sm">{label}</td>
                <td className="p-3 text-sm text-center">
                  <input
                    type="number"
                    min={0}
                    max={30}
                    value={days}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 w-16 text-center"
                  />
                  <span className="text-gray-500"> / 30</span>
                </td>
                <td className="p-3 text-sm text-right">${value.toFixed(2)}</td>
              </tr>
            ))}
            <tr className="border-t border-gray-300 bg-gray-200 text-gray-700 font-semibold">
              <td className="p-3 text-sm">Total</td>
              <td className="p-3 text-sm text-center"></td>
              <td className="p-3 text-sm text-right">${total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
