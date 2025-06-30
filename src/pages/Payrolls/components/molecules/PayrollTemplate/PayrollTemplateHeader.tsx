import React from "react";
import { PayrollFullTemplate } from "@/types";
import { convertirMesTextoAISO, mathUtils } from "@/utils/math";

type Props = {
  payrollFullTemplate: PayrollFullTemplate;
};

export default function PayrollTemplateHeader({ payrollFullTemplate }: Props) {
  let dateStr = payrollFullTemplate.payrollMonth;

  if (!/^\d{4}-\d{2}-\d{2}T/.test(dateStr)) {
    dateStr = convertirMesTextoAISO(dateStr);
  }
  const [year, month] = dateStr.split("-");
  const localDate = new Date(parseInt(year), parseInt(month) - 1, 1, 0, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%'
        }}>
          <h2 style={{ fontWeight: 'bold', fontSize: '2rem', textAlign: 'center' }}>
            Rol de Pagos
          </h2>
          <p style={{ fontSize: '24px' }}>{mathUtils.formatMonthYear(localDate)}</p>
        </div>
        <img
          src="https://cdigardnermini.edu.ec/img/header/centro-infantil-gardner-mini-academy-quito-valle-de-los-chillos.png"
          alt="Gardner Mini Academy Logo"
          style={{
            width: '150px',
            height: 'auto',
            marginLeft: '16px',
            filter: 'grayscale(100%)'
          }}
        />
      </header>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            <p style={{ fontWeight: 'bold' }}>Nombre:</p>
            <p>{payrollFullTemplate.firstName} {payrollFullTemplate.lastName}</p>
          </div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            <p style={{ fontWeight: 'bold' }}>Cédula:</p>
            <p>{payrollFullTemplate.nationalId}</p>
          </div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            <p style={{ fontWeight: 'bold' }}>Cargo:</p>
            <p>{payrollFullTemplate.jobPosition}</p>
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            <p style={{ fontWeight: 'bold' }}>Fecha de pago:</p>
            <p>
              {mathUtils.formatDateDDMMYYYY(
                new Date(payrollFullTemplate.payrollDate)
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
