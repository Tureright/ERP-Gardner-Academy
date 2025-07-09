import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProgressBreadcrumb from "@/components/molecules/ProgressBreadcrumb";
import Button from "@/components/molecules/Button";
import { EmployeeData, PayrollData, PayrollFullTemplate } from "@/types";
import PayrollTemplate from "../components/molecules/PayrollTemplate/PayrollTemplate";
import EditablePayroll from "../components/molecules/EditablePayroll/EditablePayroll";
import {
  useCreatePayroll,
  useDeletePayroll,
  usePayrollsByEmployee,
  useSetPayrollTemplate,
  usePayrollExists,
} from "@/hooks/usePayroll";
import { useUpdateEmployee } from "@/hooks/useEmployee";
import { TriangleAlert, Undo } from "lucide-react";

type Props = {};

export default function NewPayroll_FillPayroll({}: Props) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const teacher = state?.teacher;
  const payrollType = state?.payrollType || "Mensual";
  const total14 = state?.total14 || 0;
  const [earnings, setEarnings] = useState<PayrollData["earnings"]>([]);
  const [deductions, setDeductions] = useState<PayrollData["deductions"]>([]);
  const [jobPosition, setJobPosition] = useState<string>("");
  const [nationalId, setNationalId] = useState<string>("");
  const [payrollMonthDate, setPayrollMonthDate] = useState<Date>(new Date());
  const [payrollDateDate, setPayrollDateDate] = useState<Date>(new Date());
  const [summary, setSummary] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const { mutate: createPayroll } = useCreatePayroll();
  const updateEmployee = useUpdateEmployee();
  const { mutateAsync: setPayrollTemplate } = useSetPayrollTemplate();

  useEffect(() => {
    if (!teacher) {
      navigate("/payrolls", { replace: true });
    }
  }, [teacher, navigate]);

  if (!teacher) {
    return null;
  }

  const { data: existingPayrolls } = usePayrollsByEmployee(teacher.id || "");
  const { mutateAsync: deletePayroll } = useDeletePayroll();
  const { data: payrollAlreadyExists, isFetching: existsIsFetching } =
    usePayrollExists(teacher.id, payrollMonthDate.toISOString());

  const steps = [
    "Selección de Profesor",
    "Completar Rol de Pagos",
    "Detalles de Rol de Pagos",
  ];

  const payrollTitleMap: Record<string, string> = {
    Mensual: "Nuevo rol de pagos",
    Decimotercer: "Decimotercer remuneración",
    Decimocuarto: "Decimocuarta remuneración",
  };

  const pageTitle = payrollTitleMap[payrollType] || "Nuevo rol de pagos";

  const confirmCreatePayroll = async () => {
    setIsLoading(true);
    try {
      const payrollDate = payrollDateDate.toISOString();
      const payrollMonth = payrollMonthDate.toISOString();

      const payrollData: PayrollData = {
        earnings,
        deductions,
        payrollDate,
        payrollMonth,
        volatile: false,
        type: payrollType,
      };

      await new Promise<void>((resolve, reject) => {
        createPayroll(
          { employeeId: teacher.id, payrollData },
          {
            onSuccess: async (response) => {
              console.log("Response",response.data);
              console.log("ResponseMEssage",response.data.message);
              console.log("ResponseID",response.data.payrollId);
              console.log("ResponseDriveId",response.data.driveId);
              const payrollId = response.data.payrollId;
              const driveId = response.data.driveId;
              
              const fullPayrollData: PayrollFullTemplate = {
                id: payrollId,
                employeeId: teacher.id,
                earnings,
                deductions,
                payrollDate,
                firstName: teacher.firstName,
                lastName: teacher.lastName,
                nationalId,
                birthDate: teacher.birthDate,
                jobPosition,
                payrollMonth,
                summary,
                type: payrollType,
                driveId: driveId,
              };
              console.log(JSON.stringify(fullPayrollData, null, 2)); 
              const employeeData: EmployeeData = {
                adminId: teacher.adminId,
                firstName: teacher.firstName,
                lastName: teacher.lastName,
                nationalId,
                birthDate: teacher.birthDate,
                workPeriods: [
                  {
                    jobPosition,
                    startDate: teacher.workPeriods[0].startDate,
                    endDate: teacher.workPeriods[0].endDate,
                  },
                ],
                institutionalEmail: teacher.institutionalEmail,
              };

              updateEmployee.mutate(
                { employeeId: teacher.id, employeeData },
                {
                  onSuccess: () =>
                    console.log("Empleado actualizado exitosamente"),
                  onError: (error) =>
                    console.error("Error al actualizar empleado", error),
                }
              );

              await setPayrollTemplate({ newPayroll: fullPayrollData });

              if (existingPayrolls?.data?.length > 0) {
                const volatilePayroll = existingPayrolls.data.find(
                  (p) => p.volatile === true
                );
                if (volatilePayroll) {
                  console.log(
                    "🗑️ Eliminando payroll volatile:",
                    volatilePayroll.id
                  );
                  await deletePayroll({
                    employeeId: teacher.id,
                    payrollId: volatilePayroll.id,
                  });
                }
              }

              navigate("/payrolls/payrollDetails", {
                state: { fullPayrollData },
              });

              resolve();
            },
            onError: (error) => {
              console.error("❌ Error al crear el nuevo payroll:", error);
              alert(
                "Ocurrió un error al crear el nuevo rol de pagos. Intenta nuevamente."
              );
              reject(error);
            },
          }
        );
      });
    } catch (err) {
      console.error("❌ Error general en confirmCreatePayroll:", err);
      if (err instanceof TypeError && err.message.includes("Failed to fetch")) {
        alert(
          "No se pudo conectar con el servidor. Verifica tu conexión a internet o inténtalo nuevamente en unos minutos."
        );
      } else {
        alert("Ocurrió un error inesperado. Revisa la consola.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col space-y-8 p-4">
      <div>
        <Button
          icon={<Undo size={20} />}
          variant="icon"
          onClick={() => window.history.back()}
          className="mb-2"
        />
      </div>

      <header className="space-y-4">
        <h1 className="text-[2.5rem] mb-4">{pageTitle}</h1>
        {payrollType == "Mensual" ? (
          <ProgressBreadcrumb steps={steps} currentStep={1} />
        ) : null}
      </header>

      <section className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <EditablePayroll
          teacher={teacher}
          editableType={payrollType}
          total14={total14}
          onChange={({
            earnings,
            deductions,
            jobPosition,
            nationalId,
            payrollMonth,
            payrollDate,
            summary,
          }) => {
            setEarnings(earnings);
            setDeductions(deductions);
            setJobPosition(jobPosition);
            setNationalId(nationalId);
            setPayrollMonthDate(payrollMonth);
            setPayrollDateDate(payrollDate);
            setSummary(summary);
          }}
        />
      </section>

      <div className="flex justify-end space-x-4">
        <Button
          text="Volver"
          variant="text"
          onClick={() => navigate(-1)}
          className="bg-gray-300 text-gray-800"
        />
        <Button
          text="Continuar"
          variant="text"
          onClick={() => {
            if (payrollType == "Mensual"&&payrollAlreadyExists.data) {
              setShowWarningModal(true);
            } else {
              setShowConfirmModal(true);
            }
          }}
          disabled={existsIsFetching}
          className="bg-dark-cyan text-white"
        />
      </div>

      {/* Modal de advertencia */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md space-y-4">
            <div className="flex items-center space-x-2 text-yellow-600">
              <TriangleAlert />
              <h2 className="text-lg font-semibold">Advertencia</h2>
            </div>
            <p>
              Ya existe un rol de pagos para el{" "}
              <strong>
                {payrollMonthDate.toLocaleDateString("es-EC", {
                  year: "numeric",
                  month: "long",
                })}
              </strong>
              . Si continúas, el rol anterior será reemplazado.
            </p>
            <div className="flex justify-end space-x-4">
              <Button
                text="Cancelar"
                variant="text"
                onClick={() => setShowWarningModal(false)}
                className="bg-gray-300 text-gray-800"
              />
              <Button
                text="Continuar"
                variant="text"
                onClick={() => {
                  setShowWarningModal(false);
                  setShowConfirmModal(true);
                }}
                className="bg-dark-cyan text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación final */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
            <h2 className="text-xl font-semibold mb-4">Confirmar creación</h2>
            <p className="mb-6">
              ¿Estás seguro de que deseas crear este nuevo rol de pagos?
            </p>
            <div className="flex justify-end space-x-4">
              <Button
                text="Cancelar"
                variant="text"
                onClick={() => setShowConfirmModal(false)}
                className="bg-gray-300 text-gray-800"
              />
              <Button
                text="Confirmar"
                variant="text"
                onClick={() => {
                  setShowConfirmModal(false);
                  confirmCreatePayroll();
                }}
                className="bg-dark-cyan text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Loading modal */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center space-y-4">
            <p className="text-xl font-semibold">Creando Rol de Pagos...</p>
            <div className="ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 animate-spin"></div>
          </div>
        </div>
      )}
    </div>
  );
}
