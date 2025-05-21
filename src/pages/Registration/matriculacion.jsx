import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


function MatriculacionInicio() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">

      <button
        onClick={() => navigate("/formulario")}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
      >
        Formulario de Matrícula
      </button>

      <button
        onClick={() => navigate("/reserva")}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
      >
        Reservar Cupo
      </button>

    </div>
  );
}

export default MatriculacionInicio;
