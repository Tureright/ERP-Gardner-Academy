import { useEffect, useState } from "react";
import { EmployeeResponse, PayrollData } from "@/types";
import { useLatestPayroll } from "@/hooks/usePayroll";
import { useGet13erSueldoByEmployeeId } from "@/hooks/useEmployee";
import EditableCalculations from "./EditableCalculations";
import EditableDates from "./EditableDates";
import { mathUtils } from "@/utils/math";
import CenteredSpinner from "@/components/atoms/CenteredSpinner";

type Props = {
  teacher: EmployeeResponse;
  editableType?: string;
  total14?: number;
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

export default function EditablePayroll({
  teacher,
  editableType = "Mensual",
  total14 = 0,
  onChange,
}: Props) {
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(true);
  const [mesAnio, setMesAnio] = useState(new Date());
  const [fechaPago, setFechaPago] = useState(new Date());
  const [jobPosition, setJobPosition] = useState<string>("");
  const [nationalId, setNationalId] = useState<string>(
    teacher.nationalId || ""
  );

  const [earnings, setEarnings] = useState<
    Array<{ description: string; amount: number }>
  >([]);
  const [deductions, setDeductions] = useState<
    Array<{ description: string; amount: number }>
  >([]);

  const { data: latestPayroll, isLoading: isLoadingLatest } = useLatestPayroll(
    teacher.id
  );
  const { data: data13er, isLoading: isLoading13er } =
    useGet13erSueldoByEmployeeId(teacher.id);
  // Cargar datos iniciales (según editableType)
  useEffect(() => {
    if (editableType === "Decimotercer") {
      const value = Object.values(data13er?.data || {})
        .filter((v) => typeof v === "number")
        .reduce((sum, num) => sum + num, 0);
      setEarnings([
        { description: "Decimotercer remuneración", amount: value },
      ]);
      setDeductions([]);
      setJobPosition(latestPayroll?.data?.jobPosition || "Profesor titular");
      setIsLoadingInitialData(false);
      return;
    }
    if (editableType === "Decimocuarto") {
      setEarnings([
        { description: "Decimocuarta remuneración", amount: total14 },
      ]);
      setDeductions([]);
      setJobPosition("Profesor titular");
      setIsLoadingInitialData(false);
      return;
    }

    if (!latestPayroll) return;

    const rawE = latestPayroll.data.earnings || [];
    const rawD = latestPayroll.data.deductions || [];

    const rawSalary = rawE.find((it) => it.description === "Sueldo")?.amount;
    const hasFR = rawE.some((it) => it.description === "Fondo de reserva");
    const hasAP = rawD.some((it) => it.description === "Aporte personal");

    let salary = rawSalary;
    if (salary === undefined && (hasFR || hasAP)) {
      salary = 460.0;
    }

    const baseEarnings = rawE.filter(
      (it) => !SPECIAL_EARNINGS.includes(it.description)
    );
    const baseDeductions = rawD.filter(
      (it) => !SPECIAL_DEDUCTIONS.includes(it.description)
    );

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
    setJobPosition(latestPayroll.data.jobPosition || "Profesor titular");
    setIsLoadingInitialData(false); // ⬅️ Listo
  }, [editableType, latestPayroll, data13er]);

  const totalEntregado =
    mathUtils.sumAmounts(earnings) - mathUtils.sumAmounts(deductions);
  const summary = `Yo, ${teacher.firstName} ${
    teacher.lastName
  }, con la cédula de identidad N.° ${nationalId}, declaro haber recibido a conformidad la cantidad de ${mathUtils.numberToMoneyWords(
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
  }, [
    earnings,
    deductions,
    jobPosition,
    nationalId,
    mesAnio,
    fechaPago,
    summary,
    onChange,
  ]);

  // Recalcular valores ligados al sueldo (solo si no es decimotercer)
  useEffect(() => {
    if (editableType === "Decimotercer") return;

    const sueldoItem = earnings.find((e) => e.description === "Sueldo");
    if (!sueldoItem) return;

    const updatedEarnings = earnings.map((item) =>
      item.description === "Fondo de reserva"
        ? {
            ...item,
            amount: parseFloat((sueldoItem.amount * 0.0833).toFixed(2)),
          }
        : item
    );

    const updatedDeductions = deductions.map((item) =>
      item.description === "Aporte personal"
        ? {
            ...item,
            amount: parseFloat((sueldoItem.amount * 0.0945).toFixed(2)),
          }
        : item
    );

    if (JSON.stringify(updatedEarnings) !== JSON.stringify(earnings))
      setEarnings(updatedEarnings);
    if (JSON.stringify(updatedDeductions) !== JSON.stringify(deductions))
      setDeductions(updatedDeductions);
  }, [earnings, deductions, editableType]);

  if (
    (editableType === "Decimotercer" && isLoading13er) ||
    (!editableType && isLoadingLatest)
  ) {
    return <div>Cargando datos del rol de pagos...</div>;
  }

  const disableEdit = editableType === "Decimotercer";

  const specialConfig = {
    Sueldo: { lockDescription: true, lockAmount: false },
    "Fondo de reserva": { lockDescription: true, lockAmount: true },
  };
  const deductionConfig = {
    "Aporte personal": { lockDescription: true, lockAmount: true },
  };

  if (isLoadingInitialData) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center space-x-3 text-gray-800 text-base font-medium pointer-events-none bg-white p-8">
          <svg
            className="animate-spin h-6 w-6 text-purple-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v2l3-3-3-3v2a10 10 0 100 20v-2l-3 3 3 3v-2a8 8 0 01-8-8z"
            />
          </svg>
          <span className="text-purple-800">
            Cargando datos del rol de pagos...
          </span>
        </div>
      </div>
    );
  }

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
              disabled={disableEdit}
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
              disabled={disableEdit}
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
        <p>{summary}</p>
      </div>
    </div>
  );
}
