// pages/Unauthorized.jsx
import { useNavigate } from "react-router-dom";
import "../styles/Unauthorized.css"; // Asegúrate de tener este archivo


function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="text-3xl font-bold text-red-600">Acceso no autorizado</h1>
        <p className="mt-4 text-gray-700 text-lg">
          No tienes permisos para ver esta sección. 
          Si crees que esto es un error, contacta con el administrador.
        </p>

        <button
        className="backButton"
          onClick={() => navigate("/")}
          
        >
          Regresar
        </button>
      </div>
    </div>
  );
}

export default Unauthorized;
