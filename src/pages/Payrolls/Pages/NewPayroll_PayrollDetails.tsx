import { useEffect, useState } from "react";
import PayrollTemplate from "../components/molecules/PayrollTemplate/PayrollTemplate";
import { PayrollFullTemplate } from "@/types";
import Button from "@/components/molecules/Button";
import { useLocation, useNavigate } from "react-router-dom";
import MoreInfo from "@/components/atoms/MoreInfo";
import { Download, Trash, Undo } from "lucide-react";
import {
  useDeletePayroll,
  useDownloadPayroll,
  useSetPayrollTemplate,
} from "@/hooks/usePayroll";

type LocationState = {
  fullPayrollData: PayrollFullTemplate;
};

export default function NewPayroll_PayrollDetails() {
  const location = useLocation();
  const state = location.state as LocationState | null;
  const fullPayrollData = state?.fullPayrollData;

  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

  const deletePayroll = useDeletePayroll();
  const { data, isLoading } = useDownloadPayroll(
    fullPayrollData?.employeeId,
    fullPayrollData?.id
  );

  useEffect(() => {
    if (!fullPayrollData) {
      navigate("/payrolls", { replace: true });
    }
  }, [fullPayrollData, navigate]);

  if (!fullPayrollData) {
    return null;
  }

  return (
    <div className="max-w-screen-xl mx-auto flex flex-col space-y-8 p-4">
      <div>
        <Button
          icon={<Undo size={20} />}
          variant="icon"
          onClick={() => navigate("/payrolls")}
          className="mb-2"
        />
      </div>

      <header className="space-y-4">
        <h1 className="text-[2.5rem] mb-4 no-print">
          Detalles del Rol de Pagos
        </h1>
      </header>

      <section className="bg-white p-6 rounded-lg shadow-md space-y-2 w-fit mx-auto">
        <div className="flex flex-row text-center justify-end text-gray-500 mt-4 gap-2">
          <div className="flex flex-row justify-center items-center gap-2">
            <MoreInfo message="Mientras carga el enlace de descarga, puedes encontrar el PDF en tu carpeta de Drive" />
            <Button
              icon={<Download />}
              variant="text-icon"
              disabled={isLoading}
              onClick={() => {
                if (!data?.data?.downloadUrl) return;
                setTimeout(() => {
                  window.open(data.data.downloadUrl, "_blank");
                }, 200);
              }}
              className="bg-dark-cyan text-white"
            />
          </div>

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

      {/* Modal de confirmación de eliminación */}
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
                  setShowConfirmDeleteModal(false)
                  setIsDeleting(true); // Inicia la animación de carga
                  deletePayroll.mutate(
                    {
                      employeeId: fullPayrollData.employeeId,
                      payrollId: fullPayrollData.id,
                    },
                    {
                      onSuccess: () => {
                        console.log("Rol de pagos eliminado exitosamente");
                        setIsDeleting(false);
                        navigate("/payrolls");
                      },
                      onError: (error) => {
                        console.error("Error al eliminar el rol de pagos:", error);
                        alert("Ocurrió un error al eliminar el rol de pagos.");
                        setIsDeleting(false);
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
      {isDeleting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg flex items-center space-x-4">
            <svg
              className="animate-spin h-5 w-5 text-dark-cyan"
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
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z"
              />
            </svg>
            <span className="text-dark-cyan font-medium">
              Eliminando rol de pagos...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
