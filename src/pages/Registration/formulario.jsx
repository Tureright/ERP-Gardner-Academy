/*import { useEffect } from "react";

export default function FormularioMatricula(){
    useEffect(() => {
        window.location.href ="script.google.com/a/macros/gardneracademy.edu.ec/s/AKfycbwESFBRsorsDafn-vPTZp2LxcoOyTf8vmxtRIJJNuzJ4kWjlEQEM_OmvnVukBWrU92LfQ/exec";
    }, []);

    return (
        <div>
            <p>Redirigiendo al formulario de matrícula</p>
        </div>
    );
}
*/
// src/pages/Registration/Formulario.jsx
import { useEffect } from "react";

export default function Formulario() {
  useEffect(() => {
    // URL de tu Web App apps script, con restricción de dominio
    window.location.assign(
        "https://script.google.com/a/macros/gardneracademy.edu.ec/s/AKfycbwESFBRsorsDafn-vPTZp2LxcoOyTf8vmxtRIJJNuzJ4kWjlEQEM_OmvnVukBWrU92LfQ/exec"
    );
  }, []);

  return (
    <div className="p-6 text-center">
      <p className="text-xl">Redirigiendo al formulario de matrícula…</p>
      <p className="text-sm text-gray-500">
        Asegúrate de estar autenticado con tu cuenta de dominio.
      </p>
    </div>
  );
}
