// EditablePayroll.tsx
import { useEffect, useState } from "react";
import { EmployeeResponse, PayrollData } from "@/types";
import { useLatestPayroll } from "@/hooks/usePayroll";
import EditableCalculations from "./EditableCalculations";
import { mathUtils } from "@/utils/math";
import EditableDates from "./EditableDates";

type Props = {
  teacher: EmployeeResponse;
  onChange: (data: {
    earnings: PayrollData["earnings"];
    deductions: PayrollData["deductions"];
    jobPosition: string;
    nationalId?: string;
    payrollMonth: Date;
    payrollDate: Date;
    summary: string;
  }) => void;
};

const SPECIAL_EARNINGS = ["Sueldo", "Fondo de reserva"];
const SPECIAL_DEDUCTIONS = ["Aporte personal"];

export default function EditablePayroll({ teacher, onChange }: Props) {
  const { data, isLoading } = useLatestPayroll(teacher.id);

  const [mesAnio, setMesAnio] = useState(new Date());
  const [fechaPago, setFechaPago] = useState(new Date());
  const [jobPosition, setJobPosition] = useState<string>("");
  const [nationalId, setNationalId] = useState<string>("");

  const [earnings, setEarnings] = useState<Array<{ description: string; amount: number }>>([]);
  const [deductions, setDeductions] = useState<Array<{ description: string; amount: number }>>([]);

  // Cargar y construir datos iniciales
  useEffect(() => {
    if (!data) return;

    const rawE = data.data.earnings || [];
    const rawD = data.data.deductions || [];

    // Extraer valores especiales
    const rawSalary = rawE.find((it) => it.description === "Sueldo")?.amount;
    const hasFR = rawE.some((it) => it.description === "Fondo de reserva");
    const hasAP = rawD.some((it) => it.description === "Aporte personal");

    // Determinar Sueldo
    let salary = rawSalary;
    if (salary === undefined && (hasFR || hasAP)) {
      salary = 460.0;
    }

    // Base ordinary items (omit specials)
    const baseEarnings = rawE.filter((it) => !SPECIAL_EARNINGS.includes(it.description));
    const baseDeductions = rawD.filter((it) => !SPECIAL_DEDUCTIONS.includes(it.description));

    // Construir especiales
    const builtEarnings = [...baseEarnings];
    if (salary !== undefined) {
      builtEarnings.unshift({ description: "Sueldo", amount: salary });
      if (hasFR) {
        builtEarnings.splice(1, 0, {
          description: "Fondo de reserva",
          amount: parseFloat((salary * 0.0833).toFixed(2)),
        });
      }
    }

    const builtDeductions = [...baseDeductions];
    if (salary !== undefined && hasAP) {
      builtDeductions.unshift({
        description: "Aporte personal",
        amount: parseFloat((salary * 0.0945).toFixed(2)),
      });
    }

    setEarnings(builtEarnings);
    setDeductions(builtDeductions);
    setJobPosition(data.data.jobPosition || "Profesor titular");
    setNationalId(teacher.nationalId || "");
  }, [data, teacher.nationalId]);

  const totalEntregado = mathUtils.sumAmounts(earnings) - mathUtils.sumAmounts(deductions);
  const summary = `Yo, ${teacher.firstName} ${teacher.lastName}, con la cédula de identidad N.° ${nationalId}, declaro haber recibido a conformidad la cantidad de ${mathUtils.numberToMoneyWords(
    totalEntregado.toFixed(2)
  )}.`;

  useEffect(() => {
    onChange({
      earnings,
      deductions,
      jobPosition,
      nationalId,
      payrollMonth: mesAnio,
      payrollDate: fechaPago,
      summary,
    });
  }, [earnings, deductions, jobPosition, nationalId, mesAnio, fechaPago, summary, onChange]);

  useEffect(() => {
  const sueldoItem = earnings.find((e) => e.description === "Sueldo");

  if (!sueldoItem) return;

  const updatedEarnings = earnings.map((item) => {
    if (item.description === "Fondo de reserva") {
      return {
        ...item,
        amount: parseFloat((sueldoItem.amount * 0.0833).toFixed(2)),
      };
    }
    return item;
  });

  const updatedDeductions = deductions.map((item) => {
    if (item.description === "Aporte personal") {
      return {
        ...item,
        amount: parseFloat((sueldoItem.amount * 0.0945).toFixed(2)),
      };
    }
    return item;
  });

  // Solo actualiza si hubo cambios reales
  const frChanged = JSON.stringify(updatedEarnings) !== JSON.stringify(earnings);
  const apChanged = JSON.stringify(updatedDeductions) !== JSON.stringify(deductions);

  if (frChanged) setEarnings(updatedEarnings);
  if (apChanged) setDeductions(updatedDeductions);
}, [earnings]);

  if (isLoading) return <div>Cargando datos del rol de pagos...</div>;

  const specialConfig = {
    "Sueldo": { lockDescription: true, lockAmount: false },
    "Fondo de reserva": { lockDescription: true, lockAmount: true },
  };
  const deductionConfig = {
    "Aporte personal": { lockDescription: true, lockAmount: true },
  };

  return (
    <div className="flex flex-col gap-6 border border-black p-6 bg-gray-50">
      <header className="flex items-center">
        <div className="flex flex-col items-center justify-center w-full">
          <h2 className="font-bold text-[2rem] text-center">Rol de Pagos</h2>
          <EditableDates
            label="Fecha del rol:"
            value={mesAnio.toString()}
            onChange={setMesAnio}
            type="monthYear"
          />
        </div>
      </header>

      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex gap-1 flex-wrap">
            <p className="font-bold">Nombre:</p>
            <p>
              {teacher.firstName} {teacher.lastName}
            </p>
          </div>

          <div className="flex gap-1 flex-wrap items-center">
            <label className="font-bold" htmlFor="cedula">
              Cédula:
            </label>
            <input
              id="cedula"
              type="text"
              className="border px-2 py-1 rounded"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
            />
          </div>

          <div className="flex gap-1 flex-wrap items-center">
            <label className="font-bold" htmlFor="cargo">
              Cargo:
            </label>
            <input
              id="cargo"
              type="text"
              className="border px-2 py-1 rounded"
              value={jobPosition}
              onChange={(e) => setJobPosition(e.target.value)}
            />
          </div>
        </div>

        <div>
          <EditableDates
            label="Fecha de pago:"
            value={fechaPago.toString()}
            onChange={setFechaPago}
            type="fullDate"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <EditableCalculations
          title="Ingresos"
          items={earnings}
          setItems={setEarnings}
          specialConfig={specialConfig}
        />
        <EditableCalculations
          title="Deducciones"
          items={deductions}
          setItems={setDeductions}
          specialConfig={deductionConfig}
        />
      </div>

      <div className="flex justify-between font-bold text-gray-800 p-4 mt-4">
        <h3 className="text-2xl">Total entregado</h3>
        <p className="text-2xl">${totalEntregado.toFixed(2)}</p>
      </div>

      <div className="p-4">
        <p>
          {`Yo, ${teacher.firstName} ${teacher.lastName}, con la cédula de identidad N.° ${nationalId}, declaro haber recibido a conformidad la cantidad de `}
          <span className="font-semibold text-gray-800 italic transition duration-300">
            {mathUtils.numberToMoneyWords(totalEntregado.toFixed(2))}
          </span>
          .
        </p>
      </div>
    </div>
  );
}
