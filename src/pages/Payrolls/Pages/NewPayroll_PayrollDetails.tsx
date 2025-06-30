import { useEffect, useRef, useState } from "react";
import PayrollTemplate from "../components/molecules/PayrollTemplate/PayrollTemplate";
import { PayrollFullTemplate } from "@/types";
import Button from "@/components/molecules/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { Download, Trash, Undo } from "lucide-react";
import {
  useDeletePayroll,
  useDownloadPayroll,
  useSetPayrollTemplate,
} from "@/hooks/usePayroll";

type LocationState = {
  fullPayrollData: PayrollFullTemplate;
};

type Props = {};

export default function NewPayroll_PayrollDetails({}: Props) {
  // const { state } = useLocation();
  // const { fullPayrollData } = state as LocationState;
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
  const deletePayroll = useDeletePayroll();

  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const { data, isLoading } = useDownloadPayroll(
    fullPayrollData?.employeeId,
    fullPayrollData?.id
  );
  const { mutate: generatePDF, isPending: isGenerating } =
    useSetPayrollTemplate();

  return (
    <div className="max-w-screen-xl mx-auto flex flex-col space-y-8 px-4">
      <div>
        <Button
          icon={<Undo size={20} />}
          variant="icon"
          onClick={() => navigate("/payrolls")}
          className="mb-2 "
        />
      </div>

      <header className="space-y-4">
        <h1 className="text-[2.5rem] mb-4 no-print">
          Detalles del Rol de Pagos
        </h1>
      </header>
      <section className="bg-white p-6 rounded-lg shadow-md space-y-2 w-fit mx-auto">
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
              console.log(data?.data?.downloadUrl);
              if (!data?.data?.downloadUrl) return;
              setLoading(true);
              setTimeout(() => {
                window.open(data.data.downloadUrl, "_blank");
                setLoading(false);
              }, 200);
            }}
            className="bg-dark-cyan text-white"
          />

          <Button
            text="Eliminar Rol de Pagos"
            icon={<Trash />}
            variant="icon"
            onClick={() => {
              setShowConfirmDeleteModal(true);
            }}
            className="bg-dark-cyan text-white"
          />
        </div>

        <PayrollTemplate payrollFullTemplate={fullPayrollData} />
      </section>
      {showConfirmDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4">Confirmar Eliminación</h2>
            <p className="mb-6">
              ¿Estás seguro de que deseas eliminar este rol de pagos?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                text="Cancelar"
                variant="text"
                onClick={() => setShowConfirmDeleteModal(false)}
                className="bg-gray-300 text-gray-800"
              />
              <Button
                text="Eliminar"
                variant="text"
                onClick={() => {
                  deletePayroll.mutate(
                    {
                      employeeId: fullPayrollData.employeeId,
                      payrollId: fullPayrollData.id,
                    },
                    {
                      onSuccess: () => {
                        console.log("Rol de pagos eliminado exitosamente");
                        navigate("/payrolls");
                      },
                      onError: (error) => {
                        console.error(
                          "Error al eliminar el rol de pagos:",
                          error
                        );
                        alert("Ocurrió un error al eliminar el rol de pagos.");
                      },
                    }
                  );
                }}
                className="bg-dark-cyan text-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
