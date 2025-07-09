import React, { useEffect } from "react";
import { workPeriods } from "@/types";
import Button from "@/components/molecules/Button";
import { CircleX, Plus } from "lucide-react";

type WorkPeriodErrors = {
  jobPosition?: string;
  startDate?: string;
  endDate?: string;
};

type Props = {
  workPeriods: workPeriods[];
  setWorkPeriods: React.Dispatch<React.SetStateAction<workPeriods[]>>;
  workPeriodErrors: WorkPeriodErrors[];
  setWorkPeriodErrors: React.Dispatch<React.SetStateAction<WorkPeriodErrors[]>>;
};

export default function WorkPeriods({
  workPeriods,
  setWorkPeriods,
  workPeriodErrors,
  setWorkPeriodErrors,
}: Props) {
  const handleWorkPeriodChange = (
    index: number,
    field: keyof workPeriods,
    value: string
  ) => {
    const updated = [...workPeriods];
    updated[index][field] = value;
    setWorkPeriods(updated);

    setWorkPeriodErrors((prev) => {
      const copy = [...prev];
      if (!copy[index]) copy[index] = {};
      copy[index][field] = "";
      return copy;
    });
  };

  const handleAddWorkPeriod = () => {
    const newWP: workPeriods = {
      jobPosition: "",
      startDate: new Date().toISOString().slice(0, 10),
      endDate: "",
    };
    setWorkPeriods([...workPeriods, newWP]);
    setWorkPeriodErrors([...workPeriodErrors, {}]);
  };

  const handleDeleteWorkPeriod = (index: number) => {
    setWorkPeriods(workPeriods.filter((_, i) => i !== index));
    setWorkPeriodErrors(workPeriodErrors.filter((_, i) => i !== index));
  };

  // 🔍 Validar que "Actualmente trabajando" sea el más reciente
  useEffect(() => {
    const indexCurrent = workPeriods.findIndex(
      (wp) => wp.endDate === "Actualmente trabajando"
    );

    if (indexCurrent !== -1) {
      const currentStart = new Date(workPeriods[indexCurrent].startDate);
      let hasNewer = false;

      workPeriods.forEach((wp, i) => {
        if (i !== indexCurrent) {
          const otherStart = new Date(wp.startDate);
          if (otherStart > currentStart) {
            hasNewer = true;
          }
        }
      });

      setWorkPeriodErrors((prev) => {
        const updatedErrors = [...prev];
        if (!updatedErrors[indexCurrent]) updatedErrors[indexCurrent] = {};
        updatedErrors[indexCurrent].startDate = hasNewer
          ? "El período actual debe ser el más reciente"
          : "";
        return updatedErrors;
      });
    }
  }, [workPeriods, setWorkPeriodErrors]);

  return (
    <div>


      {workPeriods.map((wp, index) => {
        const errors = workPeriodErrors[index] || {};

        return (
          <div key={index} className="mb-4 border rounded p-4 space-y-2 bg-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <label className="font-semibold">Cargo</label>
                {wp.endDate === "Actualmente trabajando" && (
                  <span className="text-xs text-pink-700 bg-pink-200 px-2 py-1 rounded-full">
                    Actual
                  </span>
                )}
              </div>
              <Button
              icon={<CircleX />}
              variant="text-icon"
              onClick={() => handleDeleteWorkPeriod(index)}
              className="bg-red-200 hover:bg-red-500"
              />
            </div>
            <input
              className={`border px-2 py-1 w-full ${
                errors.jobPosition ? "border-red-500" : ""
              }`}
              value={wp.jobPosition}
              onChange={(e) =>
                handleWorkPeriodChange(index, "jobPosition", e.target.value)
              }
            />
            {errors.jobPosition && (
              <p className="text-red-600 text-sm mt-1">{errors.jobPosition}</p>
            )}

            <div>
              <label className="font-semibold">Fecha de inicio</label>
              <input
                type="date"
                className={`border px-2 py-1 w-full ${
                  errors.startDate ? "border-red-500" : ""
                }`}
                value={wp.startDate.slice(0, 10)}
                onChange={(e) =>
                  handleWorkPeriodChange(index, "startDate", e.target.value)
                }
              />
              {errors.startDate && (
                <p className="text-red-600 text-sm mt-1">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label className="font-semibold">Fecha de finalización</label>
              <input
                type="date"
                className={`border px-2 py-1 w-full ${
                  errors.endDate ? "border-red-500" : ""
                }`}
                disabled={wp.endDate === "Actualmente trabajando"}
                value={
                  wp.endDate === "Actualmente trabajando"
                    ? ""
                    : wp.endDate.slice(0, 10)
                }
                onChange={(e) =>
                  handleWorkPeriodChange(index, "endDate", e.target.value)
                }
              />
              {errors.endDate && (
                <p className="text-red-600 text-sm mt-1">{errors.endDate}</p>
              )}
            </div>

            <div className="flex items-center mt-2">
              <label
                htmlFor={`toggle-${index}`}
                className="mr-2 text-sm font-medium"
              >
                Actualmente trabajando
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id={`toggle-${index}`}
                  className="sr-only peer"
                  checked={wp.endDate === "Actualmente trabajando"}
                  onChange={(e) => {
                    const updatedPeriods = workPeriods.map((period, i) => {
                      if (i === index && e.target.checked) {
                        return { ...period, endDate: "Actualmente trabajando" };
                      } else if (i === index && !e.target.checked) {
                        return { ...period, endDate: "" };
                      } else if (
                        e.target.checked &&
                        period.endDate === "Actualmente trabajando"
                      ) {
                        return { ...period, endDate: "" };
                      }
                      return period;
                    });
                    setWorkPeriods(updatedPeriods);

                    setWorkPeriodErrors((prev) => {
                      const copy = [...prev];
                      if (!copy[index]) copy[index] = {};
                      copy[index].endDate = "";
                      return copy;
                    });
                  }}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-pink-300 rounded-full peer dark:bg-gray-300 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
              </label>
            </div>
          </div>
        );
      })}

      <Button
        text="Añadir"
        icon={<Plus/>}
        variant="text-icon"
        onClick={handleAddWorkPeriod}
        className="w-full"
      />
    </div>
  );
}
