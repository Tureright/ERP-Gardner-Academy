import { useEffect, useState } from "react";
import PayrollTemplate from "@/pages/Payrolls/components/molecules/PayrollTemplate/PayrollTemplate";
import { PayrollFullTemplate } from "@/types";
import Button from "@/components/molecules/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { Download, Undo } from "lucide-react";
import {
  useDownloadPayroll,
  useSetPayrollTemplate,
} from "@/hooks/usePayroll";

type LocationState = {
  fullPayrollData: PayrollFullTemplate;
};

type Props = {};

export default function TeachersPayrollDetails({}: Props) {
  const location = useLocation();
  const state = location.state as LocationState | null;
  const fullPayrollData = state?.fullPayrollData;

  const navigate = useNavigate();

  useEffect(() => {
    if (!fullPayrollData) {
      navigate("/payrolls", { replace: true });
    }
  }, [fullPayrollData, navigate]);

  if (!fullPayrollData) {
    return null;
  }

  const [loading, setLoading] = useState(false);

  const { data, isLoading } = useDownloadPayroll(
    fullPayrollData.employeeId,
    fullPayrollData.id
  );

  const { mutate: generatePDF, isPending: isGenerating } =
    useSetPayrollTemplate();

  return (
    <div className="max-w-screen-xl mx-auto flex flex-col space-y-8 px-4">
      {/* 🔙 Botón volver */}
      <div>
        <Button
          icon={<Undo size={20} />}
          variant="icon"
          onClick={() => navigate("/teachersProfile")}
          className="mb-2"
        />
      </div>

      {/* 🧾 Encabezado */}
      <header className="space-y-4">
        <h1 className="text-[2.5rem] mb-4 no-print">
          Detalles del Rol de Pagos
        </h1>
      </header>

      {/* 📄 Sección principal */}
      <section className="bg-white p-6 rounded-lg shadow-md space-y-2 w-fit mx-auto">
        {/* 📥 Botón para descargar PDF */}
        <div className="flex flex-row text-center justify-end text-gray-500 mt-4 gap-2">
          <Button
            text={
              isLoading || loading
                ? "Generando PDF..."
                : "Descargar Rol de Pagos"
            }
            icon={<Download />}
            variant="icon"
            disabled={isLoading || !data?.data?.downloadUrl}
            onClick={() => {
              if (!data?.data?.downloadUrl) return;
              setLoading(true);
              setTimeout(() => {
                window.open(data.data.downloadUrl, "_blank");
                setLoading(false);
              }, 200);
            }}
            className="bg-dark-cyan text-white"
          />
        </div>

        {/* 📑 Plantilla de rol de pagos */}
        <PayrollTemplate payrollFullTemplate={fullPayrollData} />
      </section>
    </div>
  );
}
