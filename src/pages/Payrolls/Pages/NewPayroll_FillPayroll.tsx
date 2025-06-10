import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProgressBreadcrumb from "@/components/molecules/ProgressBreadcrumb";
import Button from "@/components/molecules/Button";
import { EmployeeResponse, PayrollFullTemplate } from "@/types";
import PayrollTemplate from "../components/molecules/PayrollTemplate/PayrollTemplate";
import EditablePayroll from "../components/molecules/EditablePayroll/EditablePayroll";
import { useCreatePayroll } from "@/hooks/usePayroll";
import { PayrollData } from "@/types";

type Props = {};

export default function NewPayroll_FillPayroll({}: Props) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const teacher = state?.teacher;
  const [earnings, setEarnings] = useState<PayrollData["earnings"]>([]);
  const [deductions, setDeductions] = useState<PayrollData["deductions"]>([]);
  const [jobPosition, setJobPosition] = useState<string>("");
  const { mutate: createPayroll } = useCreatePayroll();
  const [payrollMonthDate, setPayrollMonthDate] = useState<Date>(new Date());
  const [payrollDateDate, setPayrollDateDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    "Selección de Profesor",
    "Completar Rol de Pagos",
    "Detalles de Rol de Pagos",
  ];

  useEffect(() => {
    if (!teacher) {
      console.error("No se encontró el profesor en el estado de la ubicación.");
      navigate("/payrolls/selectTeacher");
    }
  }, [teacher, navigate]);

  if (!teacher) return null;

  const confirmCreatePayroll = () => {
    setIsLoading(true);
    const payrollDate = payrollDateDate.toISOString().split("T")[0];
    const payrollMonth = payrollMonthDate.toISOString().slice(0, 7);

    const payrollData: PayrollData = {
      earnings,
      deductions,
      payrollDate,
    };
    createPayroll(
      { employeeId: teacher.id, payrollData },
      {
        onSuccess: (response) => {
          const payrollId = response.data.payrollId;

          const fullPayrollData: PayrollFullTemplate = {
          id: payrollId,
          employeeId: teacher.id,
          earnings,
          deductions,
          payrollDate,
          firstName: teacher.firstName,
          lastName: teacher.lastName,
          nationalId: teacher.nationalId,
          birthDate: teacher.birthDate,
          jobPosition,
          payrollMonth,
        };

          setIsLoading(false);
          navigate("/payrolls/payrollDetails", { state: { fullPayrollData } });
        },
        onError: (error) => {
          setIsLoading(false);
          console.error("Error al crear el payroll:", error);
          alert("Ocurrió un error al crear el payroll. Inténtalo nuevamente.");
        },
      }
    );
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col space-y-8 px-4">
      <header className="space-y-4">
        <h1 className="text-[2.5rem] mb-4">Nuevo rol de pagos</h1>
        <ProgressBreadcrumb steps={steps} currentStep={1} />
      </header>

      <section className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <EditablePayroll
          teacher={teacher}
          onChange={({
            earnings,
            deductions,
            jobPosition,
            payrollMonth,
            payrollDate,
          }) => {
            setEarnings(earnings);
            setDeductions(deductions);
            setJobPosition(jobPosition);
            setPayrollMonthDate(payrollMonth);
            setPayrollDateDate(payrollDate);
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
          onClick={() => setShowConfirmModal(true)}
          className="bg-dark-cyan text-white"
        />
      </div>
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
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center space-y-4">
            <p className="text-xl font-semibold">Creando Rol de Pagos...</p>
            <div className="ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
          </div>
        </div>
      )}
    </div>
  );
}
