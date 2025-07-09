import { EmployeeResponse } from "@/types";
import React, { useState } from "react";
import { getCurrentJobPosition, mathUtils } from "@/utils/math";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "@/components/molecules/Button";
import { ArchiveRestore, Edit, Undo } from "lucide-react";
import { useProfilePicture } from "@/hooks/useEmployee";
import LazyImage from "../components/atoms/LazyImage/LazyImage";
import Personal13Table from "../components/molecules/Personal13Table/Personal13Table";
import Personal14Table from "../components/molecules/Personal14Table/Personal14Table";

type Props = {};

export default function TeachersDetails({}: Props) {
  const { state } = useLocation();
  const teacher = state?.teacher;
  const navigate = useNavigate();
  const [total14, setTotal14] = useState<number>(0);
  const teachersName = `${teacher.firstName} ${teacher.lastName}`;
  const currentJobPosition = getCurrentJobPosition(teacher.workPeriods);
  const [isLoading13, setIsLoading13] = useState<boolean>(true);
  const [isLoading14, setIsLoading14] = useState<boolean>(true);

  const {
    data: profilePicture,
    isLoading: profilePictureIsLoading,
    error: profilePictureError,
  } = useProfilePicture(teacher.id);

  const avatarSrc = profilePicture
    ? `data:${profilePicture.data.mimeType};base64,${profilePicture.data.base64}`
    : "";

  const sortedWorkPeriods = [...teacher.workPeriods].sort((a, b) => {
    if (a.endDate === "Actualmente trabajando") return -1;
    if (b.endDate === "Actualmente trabajando") return 1;
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  const today = new Date();
  const month = today.getMonth(); // 0 = enero, 11 = diciembre
  const year = today.getFullYear();

  const periodo13 = month === 11 ? year + 1 : year;

  // Si hoy es antes de agosto, el periodo del décimo cuarto termina este año
  const periodo14Fin = month < 7 ? year : year + 1; // julio = 6
  const periodo14Inicio = periodo14Fin - 1;

  return (
    <div className="p-4 space-y-10 max-w-4xl mx-auto">
      <div>
        <Button
          icon={<Undo size={20} />}
          variant="icon"
          onClick={() => window.history.back()}
          className="mb-2 "
        />
      </div>
      <h1 className="text-[2.5rem] mb-4">{teachersName}</h1>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[2rem]">Información General</h2>
          <Button
            text="Editar"
            icon={<Edit size={20} strokeWidth={2} />}
            variant="text-icon"
            onClick={() =>
              navigate("/payrolls/editTeacherInfo", { state: { teacher } })
            }
            aria-label="Editar detalles del profesor"
          />
        </div>

        <div className="space-y-4 border border-gray-300 rounded-xl shadow-sm p-4 bg-gray-100">
          <h3 className="text-2xl mb-2">Información básica</h3>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 w-28 h-28 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
              {profilePictureIsLoading || !avatarSrc ? (
                <div className="w-full h-full animate-pulse bg-gray-300 rounded-full" />
              ) : profilePictureError ? (
                <div className="text-gray-400 text-sm">Error</div>
              ) : (
                <LazyImage
                  src={avatarSrc}
                  alt={`Avatar de ${teacher.firstName}`}
                  className="w-full h-full object-cover rounded-full"
                />
              )}
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <strong className="block text-gray-700">Cédula</strong>
                <p className="text-gray-800">{teacher.nationalId}</p>
              </div>
              <div>
                <strong className="block text-gray-700">Cargo actual</strong>
                <p className="text-gray-800">{currentJobPosition}</p>
              </div>
              <div>
                <strong className="block text-gray-700">
                  Correo institucional
                </strong>
                <p className="text-gray-800">{teacher.institutionalEmail}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 border border-gray-300 rounded-xl shadow-sm p-4 bg-gray-100">
          <h3 className="text-2xl mb-2">Trayectoria en la escuela</h3>
          <div className="space-y-4">
            {sortedWorkPeriods.map((workPeriod, index) => {
              function parseDate(dateStr: string) {
                if (dateStr === "Actualmente trabajando")
                  return "Actualmente trabajando";
                if (dateStr.includes("T") && dateStr.includes("Z")) {
                  const dateObj = new Date(dateStr);
                  return dateObj.toISOString().split("T")[0];
                }
                return dateStr;
              }

              const localStartDate = parseDate(workPeriod.startDate);
              const [startYear, startMonth, startDay] = localStartDate
                .split("-")
                .map(Number);
              const startDateObj = new Date(
                startYear,
                startMonth - 1,
                startDay
              );

              let endDateText;
              if (workPeriod.endDate === "Actualmente trabajando") {
                endDateText = "Actualmente trabajando";
              } else {
                const localEndDate = parseDate(workPeriod.endDate);
                const [endYear, endMonth, endDay] = localEndDate
                  .split("-")
                  .map(Number);
                const endDateObj = new Date(endYear, endMonth - 1, endDay);
                endDateText = mathUtils.formatDateDDMMYYYY(endDateObj);
              }

              const isCurrent = workPeriod.endDate === "Actualmente trabajando";
              const textClass = isCurrent ? "text-gray-900" : "text-gray-500";

              return (
                <div
                  key={index}
                  className={`border-l-4 pl-4 py-2 border-gray-300 bg-gray-50 rounded-md ${textClass}`}
                >
                  <p className="font-semibold text-lg">
                    {`${index + 1}. ${workPeriod.jobPosition}`}
                  </p>
                  <p>
                    <strong>Inicio:</strong>{" "}
                    {mathUtils.formatDateDDMMYYYY(startDateObj)}
                  </p>
                  <p>
                    <strong>Final:</strong> {endDateText}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <hr className="border-t-2 border-gray-300 my-4" />
      <h2 className="text-[2rem]">Derechos del trabajador</h2>

      <div className="flex flex-col gap-4">
        <h3 className="text-2xl">Decimotercer remuneración</h3>
        <p>
          La decimotercer remuneración es un beneficio anual que corresponde a
          la doceava parte del total de los ingresos percibidos por el
          trabajador durante el año. En esta sección se incluyen los pagos
          mensuales que se deberían hacer para cumplir con el decimotercer
          sueldo de{" "}
          <strong className="text-purple-primary">
            {teachersName} del año {periodo13}
          </strong>
          .
        </p>
        <h3 className="text-xl">Pagos mensuales</h3>

        <Personal13Table
          employeeId={teacher.id}
          onLoadingChange={(loading) => setIsLoading13(loading)}
        />

        <h3 className="text-xl">Generar rol de pagos</h3>
        <p>
          Genera un rol de pagos específico para la decimotercer remuneración
          del profesor{" "}
          <strong className="text-purple-primary">
            {teachersName} del año {periodo13}
          </strong>
          .
        </p>
        <Button
          text="Generar rol de pagos"
          icon={
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 flex items-center justify-center border-2 border-gray-700 text-gray-700 text-base font-bold rounded transition group-hover:bg-purple-primary group-hover:text-white group-hover:border-purple-primary">
                13
              </span>
              <ArchiveRestore size={20} strokeWidth={2} />
            </div>
          }
          variant="text-icon"
          disabled={isLoading13}
          onClick={() =>
            navigate("/payrolls/fillPayroll", {
              state: {
                teacher: teacher,
                payrollType: "Decimotercer",
              },
            })
          }
          aria-label="Genera un rol de pagos para la decimotercer remunración"
        />
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-2xl mb-2">Decimocuarta remuneración</h3>
        <p>
          El décimo cuarto sueldo es un beneficio anual que equivale a un sueldo
          básico unificado (SBU). El cálculo incluye el período comprendido
          entre el{" "}
          <strong className="text-purple-primary">
            1 de agosto de {periodo14Inicio}
          </strong>{" "}
          y el{" "}
          <strong className="text-purple-primary">
            31 de julio de {periodo14Fin}
          </strong>
          .
        </p>

        <h3 className="text-xl">Pagos mensuales</h3>
        <p>
          El décimo tercer sueldo se basa en 360 días laborales al año (30 por
          mes). Si el profesor no trabajó el mes completo, puedes modificar los
          días para obtener el valor exacto. El cálculo se hace en función del
          Sueldo Básico Unificado (SBU) hasta el año {year}.
        </p>

        <Personal14Table
          employeeId={teacher.id}
          onTotal={(total14) => setTotal14(total14)}
          onLoadingChange={(loading) => setIsLoading14(loading)}
        />

        <h3 className="text-xl">Generar rol de pagos</h3>
        <p>
          Genera un rol de pagos específico para la decimocuarta remuneración
          del profesor{" "}
          <strong className="text-purple-primary">
            {teachersName} del año {periodo13}
          </strong>
          .
        </p>
        <Button
          text="Generar rol de pagos"
          icon={
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 flex items-center justify-center border-2 border-gray-700 text-gray-700 text-base font-bold rounded transition group-hover:bg-purple-primary group-hover:text-white group-hover:border-purple-primary">
                14
              </span>
              <ArchiveRestore size={20} strokeWidth={2} />
            </div>
          }
          variant="text-icon"
          disabled={isLoading14}
          onClick={() =>
            navigate("/payrolls/fillPayroll", {
              state: {
                teacher: teacher,
                payrollType: "Decimocuarto",
                total14: total14,
              },
            })
          }
          aria-label="Genera un rol de pagos para la decimocuarta remunración"
        />
      </div>
    </div>
  );
}
