import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { EmployeeResponse, workPeriods } from "@/types";
import { useUpdateEmployee } from "@/hooks/useEmployee";
import WorkPeriods from "../components/molecules/WorkPeriods/WorkPeriods";

// 🔧 Convierte fechas a formato ISO UTC si no lo están ya
const toUTCISOString = (dateStr: string) => {
  if (dateStr.includes("T") && dateStr.includes("Z")) return dateStr;
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toISOString();
};

type FormData = {
  firstName: string;
  lastName: string;
  nationalId: string;
  birthDate: string;
  institutionalEmail: string;
  workPeriods: workPeriods[];
};

type FormErrorState = Partial<Record<keyof FormData, string>>;

export default function EditTeacherInfo() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const teacher = state?.teacher as EmployeeResponse;

  if (!teacher) return <p>Error: no se encontró el docente.</p>;

  const [formData, setFormData] = useState<FormData>({
    firstName: teacher.firstName,
    lastName: teacher.lastName,
    nationalId: teacher.nationalId,
    birthDate: teacher.birthDate,
    institutionalEmail: teacher.institutionalEmail,
    workPeriods: structuredClone(teacher.workPeriods),
  });

  const [savedTeacher, setSavedTeacher] = useState<EmployeeResponse>(teacher);
  const [formErrors, setFormErrors] = useState<FormErrorState>({});
  const [workPeriodErrors, setWorkPeriodErrors] = useState<
    { jobPosition?: string; startDate?: string; endDate?: string }[]
  >(Array(teacher.workPeriods.length).fill({}));

  const { mutate: updateEmployee, isPending } = useUpdateEmployee();

  const labelMap: Record<keyof FormData, string> = {
    firstName: "Nombres",
    lastName: "Apellidos",
    nationalId: "Cédula",
    institutionalEmail: "Correo institucional",
    birthDate: "Fecha de nacimiento",
    workPeriods: "",
  };

  const inputFields: (keyof FormData)[] = [
    "firstName",
    "lastName",
    "nationalId",
    "institutionalEmail",
    "birthDate",
  ];

  const handleFieldChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateForm = () => {
    const errors: FormErrorState = {};
    let isValid = true;

    inputFields.forEach((field) => {
      if (!formData[field] || (formData[field] as string).trim() === "") {
        errors[field] = `${labelMap[field]} es requerido`;
        isValid = false;
      }
    });

    setFormErrors(errors);
    return isValid;
  };

  const validateWorkPeriods = (): boolean => {
    let isValid = true;
    const errors = formData.workPeriods.map((wp) => {
      const error: { jobPosition?: string; startDate?: string; endDate?: string } = {};

      if (!wp.jobPosition.trim()) {
        error.jobPosition = "El cargo es requerido";
        isValid = false;
      }

      if (!wp.startDate) {
        error.startDate = "La fecha de inicio es requerida";
        isValid = false;
      }

      if (
        wp.endDate !== "Actualmente trabajando" &&
        (!wp.endDate || wp.endDate.trim() === "")
      ) {
        error.endDate = "La fecha de fin es requerida";
        isValid = false;
      }

      if (
        wp.endDate !== "Actualmente trabajando" &&
        wp.startDate &&
        wp.endDate &&
        new Date(wp.startDate) > new Date(wp.endDate)
      ) {
        error.startDate = "La fecha de inicio no puede ser posterior a la de fin";
        isValid = false;
      }

      return error;
    });

    const indexCurrent = formData.workPeriods.findIndex(
      (wp) => wp.endDate === "Actualmente trabajando"
    );

    if (indexCurrent !== -1) {
      const currentStart = new Date(formData.workPeriods[indexCurrent].startDate);
      const hasNewer = formData.workPeriods.some(
        (wp, i) => i !== indexCurrent && new Date(wp.startDate) > currentStart
      );

      if (hasNewer) {
        errors[indexCurrent].startDate = "El período actual debe ser el más reciente";
        isValid = false;
      }
    }

    setWorkPeriodErrors(errors);
    return isValid;
  };

  const handleSave = () => {
    if (!validateForm() || !validateWorkPeriods()) return;

    const sortedPeriods = [...formData.workPeriods]
      .map((wp) => ({
        ...wp,
        startDate: toUTCISOString(wp.startDate),
        endDate:
          wp.endDate === "Actualmente trabajando"
            ? "Actualmente trabajando"
            : toUTCISOString(wp.endDate),
      }))
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    const updatedTeacher: EmployeeResponse = {
      ...savedTeacher,
      ...formData,
      birthDate: toUTCISOString(formData.birthDate),
      workPeriods: sortedPeriods,
    };

    updateEmployee(
      {
        employeeId: savedTeacher.id,
        employeeData: updatedTeacher,
      },
      {
        onSuccess: () => {
          setSavedTeacher(updatedTeacher);
          navigate("/payrolls/teachersDetails", {
            state: { teacher: updatedTeacher },
          });
        },
      }
    );
  };

  const handleCancel = () => navigate(-1);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      <h1 className="text-[2.5rem] font-bold">Editar Información del Docente</h1>

      <section className="space-y-4 border border-gray-200 rounded-xl p-6 shadow-sm bg-gray-100">
        <h2 className="text-2xl font-semibold mb-4">Información Básica</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {inputFields.map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700">
                {labelMap[field]}
              </label>
              <input
                type={field === "birthDate" ? "date" : "text"}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-dark-cyan focus:border-dark-cyan"
                value={
                  field === "birthDate"
                    ? (formData.birthDate || "").slice(0, 10)
                    : (formData[field] as string)
                }
                onChange={(e) => handleFieldChange(field, e.target.value)}
              />
              {formErrors[field] && (
                <p className="text-sm text-red-600 mt-1">{formErrors[field]}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 border border-gray-200 rounded-xl p-6 shadow-sm bg-gray-100">
        <h2 className="text-2xl font-semibold mb-4">Trayectoria en la escuela</h2>

        <WorkPeriods
          workPeriods={formData.workPeriods}
          setWorkPeriods={(wps) => {
            const resolved = typeof wps === "function" ? wps(formData.workPeriods) : wps;
            setFormData((prev) => ({ ...prev, workPeriods: resolved }));
          }}
          workPeriodErrors={workPeriodErrors}
          setWorkPeriodErrors={setWorkPeriodErrors}
        />
      </section>

      <div className="flex justify-end gap-4">
        <button
          className="bg-dark-cyan hover:bg-cyan-700 text-white font-medium px-6 py-2 rounded-lg transition"
          onClick={handleSave}
        >
          Guardar
        </button>
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-6 py-2 rounded-lg transition"
          onClick={handleCancel}
        >
          Cancelar
        </button>
      </div>

      {isPending && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-4">
            <div className="w-6 h-6 border-4 border-dark-cyan border-t-transparent rounded-full animate-spin" />
            <span className="text-dark-cyan font-medium">
              Guardando datos del profesor...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
