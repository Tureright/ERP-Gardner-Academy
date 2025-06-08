import { useLatestPayroll } from '@/hooks/usePayroll';
import { EmployeeResponse, PayrollFullTemplate } from '@/types';
import React from 'react'
import { mathUtils } from '@/utils/math';
type Props = {
    payrollFullTemplate: PayrollFullTemplate;
}

export default function PayrollTemplateHeader({ payrollFullTemplate }: Props) {

  return (
        <div className="flex flex-col gap-6">
          <header className="flex items-center">
            <div className="flex flex-col items-center justify-center w-full">
              <h2 className="font-bold text-[2rem]  text-center">Rol de Pagos</h2>
                <p className="text-2xl">
                  {
                  mathUtils.formatMonthYear(new Date(payrollFullTemplate.payrollMonth))
                  }
                </p>
       
            </div>
            
            <img
              src="/logo.png"
              alt="Logo"
              className="w-[150px] h-auto ml-4 filter grayscale"
            />
          </header>
    
    
          <div className="flex justify-between">
            <div>
              <div className="flex gap-1 flex-wrap">
                <p className="font-bold">Nombre: </p>
                <p>
                  {payrollFullTemplate.firstName} {payrollFullTemplate.lastName}
                </p>
              </div>
              <div className="flex gap-1 flex-wrap">
                <p className="font-bold">Cédula: </p>
                <p>{payrollFullTemplate.nationalId}</p>
              </div>
              <div className="flex gap-1 flex-wrap">
                <p className="font-bold">Cargo: </p>
                <p>{payrollFullTemplate.jobPosition}</p>
              </div>
            </div>
            <div>
              <div className="flex gap-1 flex-wrap">

                <p className="font-bold">Fecha de pago: </p>
                <p>
                  {mathUtils.formatDateDDMMYYYY(new Date(payrollFullTemplate.payrollDate))}              
                </p>
                
                
              </div>
            </div>
          </div>
          </div>
  )
}