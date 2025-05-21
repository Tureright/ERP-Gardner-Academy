// EditablePayroll.tsx
import React, { useEffect, useState } from "react";
import { EmployeeResponse, PayrollData } from "@/types";
import { useLatestPayroll } from "@/hooks/usePayroll";
import { useCreatePayroll } from "@/hooks/usePayroll";
import EditableCalculations from "./EditableCalculations";
import { mathUtils } from "@/utils/math";
import EditableDate from "./EditableHeader";

type Props = {
  teacher: EmployeeResponse;
  onChange: (data: {
    earnings: PayrollData["earnings"];
    deductions: PayrollData["deductions"];
    jobPosition: string;
  }) => void;
};

export default function EditablePayroll({ teacher, onChange }: Props) {
  const { data, isLoading } = useLatestPayroll(teacher.id);
  const { mutate: createPayroll } = useCreatePayroll();
  const [mesAnio, setMesAnio] = useState(new Date());
const [fechaPago, setFechaPago] = useState(new Date());


  const [earnings, setEarnings] = useState<
    Array<{ description: string; amount: number }>
  >([]);
  const [deductions, setDeductions] = useState<
    Array<{ description: string; amount: number }>
  >([]);

  useEffect(() => {
    if (data) {
      const newEarnings = data.data.earnings || [];
      const newDeductions = data.data.deductions || [];
      setEarnings(newEarnings);
      setDeductions(newDeductions);

      onChange({
        earnings: newEarnings,
        deductions: newDeductions,
        jobPosition: data.data.jobPosition || "",
      });
    }
  }, [data]);

  useEffect(() => {
    onChange({
      earnings,
      deductions,
      jobPosition: data?.data.jobPosition || "",
    });
  }, [earnings, deductions]);

  const handleCreatePayroll = () => {
    const payrollData: PayrollData = {
      earnings,
      deductions,
      payrollDate: new Date().toISOString().split("T")[0],
    };
    createPayroll({ employeeId: teacher.id, payrollData });
  };

  const totalEntregado =
    mathUtils.sumAmounts(earnings) - mathUtils.sumAmounts(deductions);

  if (isLoading) return <div>Cargando datos del rol de pagos...</div>;

  return (
    <div className="flex flex-col gap-6 border border-black p-6 bg-gray-50">
<header className="flex items-center">
  <div className="flex flex-col items-center justify-center w-full">
    <h2 className="font-bold text-[2rem]  text-center">Rol de Pagos</h2>
    <p className="text-2xl text-center">
      {mathUtils.formatMonthYear(mesAnio)}
      <EditableDate value={mesAnio} type="mes" onChange={setMesAnio} />
    </p>
  </div>
</header>

<div className="flex justify-between">
  <div>
    <div className="flex gap-1 flex-wrap">
      <p className="font-bold">Nombre: </p>
      <p>{teacher.firstName} {teacher.lastName}</p>
    </div>
    <div className="flex gap-1 flex-wrap">
      <p className="font-bold">Cédula: </p>
      <p>{teacher.nationalId}</p>
    </div>
    <div className="flex gap-1 flex-wrap">
      <p className="font-bold">Cargo: </p>
      <p>{data.data.jobPosition}</p>
    </div>
  </div>
  <div>
    <div className="flex gap-1 flex-wrap">
      <p className="font-bold">Fecha de pago: </p>
      <p>{mathUtils.formatDateDDMMYYYY(fechaPago)}</p>
      <EditableDate value={fechaPago} type="fecha" onChange={setFechaPago} />
    </div>
  </div>
</div>

      <div className="flex flex-wrap gap-2">
        <EditableCalculations
          title="Ingresos"
          items={earnings}
          setItems={setEarnings}
        />
        <EditableCalculations
          title="Deducciones"
          items={deductions}
          setItems={setDeductions}
        />
      </div>

      <div className="flex justify-between font-bold text-gray-800 p-4 mt-4">
        <h3 className="text-2xl">Total entregado</h3>
        <p className="text-2xl">${totalEntregado.toFixed(2)}</p>
      </div>

      <div className="p-4">
        <p>
          {`Yo, ${teacher.firstName} ${teacher.lastName}, con la cédula de identidad N.° ${teacher.nationalId}, declaro haber recibido a conformidad la cantidad de `}
          <span className="font-semibold text-gray-800 italic transition duration-300">
            {mathUtils.numberToMoneyWords(totalEntregado.toFixed(2))}
          </span>
          .
        </p>
      </div>
    </div>
  );
}
