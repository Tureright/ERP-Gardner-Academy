// src/pages/Registration/formulario.jsx
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import FormStyles from "../../styles/Reservation.module.css";

export default function Formulario() {
  const { userData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const ouPermitidas = ["/Alumnos", "/Inscritos", "/Pendiente"];
    if (userData === null) return; // aún cargando

    if (!ouPermitidas.includes(userData.ouPath)) {
      return navigate("/unauthorized", { replace: true });
    }

    // 1) Reemplaza la entrada actual de /matriculacion/formulario
    //    por /matriculacion en el historial:
    window.history.replaceState(null, "", "/matriculacion");

    // 2) Luego redirige al formulario externo:
    window.location.replace(
      "https://script.google.com/a/macros/gardneracademy.edu.ec/s/AKfycbwESFBRsorsDafn-vPTZp2LxcoOyTf8vmxtRIJJNuzJ4kWjlEQEM_OmvnVukBWrU92LfQ/exec"
    );
  }, [userData, navigate]);

  return (
    <div className={FormStyles.container}>
      <h2 className={FormStyles.title}>Formulario de Matrícula</h2>
      <p className={FormStyles.message}>Redirigiendo al formulario...</p>
      <p className="text-sm text-gray-500">
        Si no te redirige automáticamente,&nbsp;
        <button
          onClick={() => {
            window.history.replaceState(null, "", "/matriculacion");
            window.location.replace(
              "https://script.google.com/a/macros/gardneracademy.edu.ec/s/AKfycbwESFBRsorsDafn-vPTZp2LxcoOyTf8vmxtRIJJNuzJ4kWjlEQEM_OmvnVukBWrU92LfQ/exec"
            );
          }}
          className="underline"
        >
          haz clic aquí
        </button>
        .
      </p>
    </div>
  );
}
