import React from "react";
import Calculations from "./Calculations";
import { EmployeeResponse, PayrollFullTemplate } from "@/types";
import { useLatestPayroll } from "@/hooks/usePayroll";
import { mathUtils } from "@/utils/math";
import PayrollTemplateHeader from "./PayrollTemplateHeader";
type Props = {
  payrollFullTemplate: PayrollFullTemplate;
};

export default function PayrollTemplate({ payrollFullTemplate }: Props) {

  const totalEntregado =
    mathUtils.sumAmounts(payrollFullTemplate.earnings) - mathUtils.sumAmounts(payrollFullTemplate.deductions);

  return (
    <div className="flex flex-col gap-6 border border-black p-6 max-w-[895px]">
      <PayrollTemplateHeader payrollFullTemplate={payrollFullTemplate}/>
      <div className="flex flex-wrap gap-2 bg-white ">
        <Calculations title={"Ingresos"} items={payrollFullTemplate.earnings} />
        <Calculations title={"Deducciones"} items={payrollFullTemplate.deductions} />
        <div className="flex flex-wrap justify-between font-bold text-gray-800 w-full gap-2 bg-payroll-gray p-4">
          <h3 className="text-2xl">Total entregado</h3>
          <p className="text-2xl">${totalEntregado.toFixed(2)}</p>
        </div>
      </div>

      <div className=" p-4">
        <p>
          {`Yo, ${payrollFullTemplate.firstName} ${payrollFullTemplate.lastName}, con la cédula de identidad N.° ${payrollFullTemplate.nationalId}, declaro haber recibido a conformidad la cantidad de `}
          <span className="font-semibold text-gray-800 italic transition duration-300">
            {mathUtils.numberToMoneyWords(totalEntregado.toFixed(2))}
          </span>
          .
        </p>
      </div>
        <div className="mt-12 text-center">
    <div className="border-t border-gray-700 w-64 mx-auto mb-2"></div>
    <p className="text-gray-700 text-sm">Recibí conforme</p>
  </div>

    </div>
  );
}
