import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import LoginButton from "./components/LoginButton";
import Unauthorized from "./pages/Unauthorized";
import Invoices from "./pages/Invoices/invoicesPage";
import Payrolls from "./pages/Payrolls//Pages/PayrollPage"
import Registration from "./pages/Registration/matriculacion";
import Formulario from "./pages/Registration/formulario";
import ReservarCupo from "./pages/Registration/reservarCupo";


import "./App.css";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {
  const { idToken, setIdToken, userData, setUserData } = useAuth();

  useEffect(() => {
    if (idToken && !userData) {
      fetch("https://script.google.com/macros/s/AKfycbykD6bVSicqEgX6ok_8PhWuYqftSjcOgQrvNs0DeBKWrf_JJFYDwD0Emr8Q5OZzhvk0Tg/exec", {
        method: "POST",
        body: JSON.stringify({ idToken }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setUserData({
              email: data.email,
              nombre: data.nombre,
              ouPath: data.ouPath,
              rol: data.rol,
            });
          } else {
            console.error("Error backend:", data.error);
            setIdToken(null);
          }
        })
        .catch((err) => {
          console.error("Error conexión Apps Script:", err);
          setIdToken(null);
        });
    }
  }, [idToken, userData, setUserData, setIdToken]);

  function getAllowedModules(ouPath) {
    const allModules = ["home", "settings", "dropdown", "invoices", "payrolls", "registration"];
    const registrationOUs = ["/Alumnos", "/Inscritos", "/Pendiente"];
    const gestionAcademicaOUs = ["/GestionAcademica", "/Management"];
    const docentesOU = "/Docentes";
    const developmentOUs = ["/Development", "/PruebasDev"];

    if (developmentOUs.includes(ouPath)) {
      return allModules;
    }
    if (gestionAcademicaOUs.includes(ouPath)) {
      return allModules;
    }
    if (registrationOUs.includes(ouPath)) {
      return ["registration"];
    }
    if (ouPath === docentesOU) {
      return ["payrolls"];
    }
    return [];
  }

  if (!idToken) {
    return (
      <Router>
        <div className="app-container">
          <div className="content">
            <LoginButton onToken={setIdToken} />
          </div>
        </div>
      </Router>
    );
  }

  if (!userData) {
    return (
      <div className="loading-screen">
        <p>Cargando datos de usuario...</p>
      </div>
    );
  }

  const allowedModules = getAllowedModules(userData.ouPath);

  // 🛠️ Corrección de ruta por defecto
  let defaultRoute = "/home";
  if (allowedModules.includes("invoices")) defaultRoute = "/invoices";
  else if (allowedModules.includes("payrolls")) defaultRoute = "/payrolls";
  else if (allowedModules.includes("registration")) defaultRoute = "/matriculacion";

  if (!defaultRoute) {
    return (
      <Router>
        <div className="app-container">
          <Navbar />
          <div className="content">
            <Unauthorized />
          </div>
        </div>
      </Router>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="content">
          <Routes>
            {/* Redirige solo si entra por "/" */}
            <Route path="/" element={<Navigate to={defaultRoute} replace />} />

            {allowedModules.includes("invoices") && (
              <Route path="/invoices/*" element={<Invoices />} />
            )}
            {allowedModules.includes("payrolls") && (
              <Route path="/payrolls/*" element={<Payrolls />} />
            )}

            {allowedModules.includes("registration") && (
              <>
                {/* Vista principal de Matriculación */}
                <Route
                  path="/matriculacion"
                  element={<Registration />} // aquí Registration es tu matriculacion.jsx
                />
                {/* Páginas hijas como rutas planas */}
                <Route
                  path="/matriculacion/formulario"
                  element={<Formulario />}
                />
                <Route
                  path="/matriculacion/reserva"
                  element={<ReservarCupo />}
                />
              </>
            )}
            {/* Vista de acceso no autorizado */}
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Ruta para cualquier cosa que no esté definida */}
            <Route path="*" element={<Navigate to={defaultRoute} replace />} />
          </Routes>
        </div>
      </div>
    </Router>

  );
}

export default App;
