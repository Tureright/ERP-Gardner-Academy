import React from "react";
import Calculations from "../Calculations/Calculations";
import { EmployeeResponse } from "@/types";
import { useLatestPayroll } from "@/hooks/usePayroll";
import { mathUtils } from "@/utils/math";
type Props = {
  teacher: EmployeeResponse;
};

export default function PayrollTemplate({ teacher }: Props) {
  const { data, isLoading, error } = useLatestPayroll(teacher.id);
  if (isLoading) return <div>Loading...</div>;

  const deductions = data.data.deductions;
  const earnings = data.data.earnings;
  const totalEntregado =
    mathUtils.sumAmounts(earnings) - mathUtils.sumAmounts(deductions);

  return (
    <div className="flex flex-col gap-6 border border-black p-6">

      <div className="flex flex-wrap gap-2 bg-white ">
        <Calculations title={"Ingresos"} items={earnings} />
        <Calculations title={"Deducciones"} items={deductions} />
        <div className="flex flex-wrap justify-between font-bold text-gray-800 w-full gap-2 bg-payroll-gray p-4">
          <h3 className="text-2xl">Total entregado</h3>
          <p className="text-2xl">${totalEntregado.toFixed(2)}</p>
        </div>
      </div>

      <div className=" p-4">
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
