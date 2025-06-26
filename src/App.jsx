import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import LoginButton from "./components/LoginButton";
import Unauthorized from "./pages/Unauthorized";
import Invoices from "./pages/Invoices/invoicesPage";
import Payrolls from "./pages/Payrolls/Pages/PayrollPage";
import Registration from "./pages/Registration/matriculacion";
import Formulario from "./pages/Registration/formulario";
import ReservarCupo from "./pages/Registration/reservarCupo";
import DashboardMatricula from "./pages/Report/registrationReport";

import "./App.css";

// 👇 Este componente sí puede usar useLocation porque ya está dentro de <Router>
function AppRoutes() {
  const { idToken, setIdToken, userData, setUserData } = useAuth();
  const location = useLocation();

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
              cedula: data.cedula,
              nombres: data.nombres,
              apellidos: data.apellidos,
              nivel: data.nivel,
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

  const hideNavbarRoutes = ["/login"];
  const showNavbar = !hideNavbarRoutes.includes(location.pathname);

  function getAllowedModules(ouPath) {
    const allModules = ["home", "settings", "dropdown", "invoices", "payrolls", "registration", "report"];
    const registrationOUs = ["/Alumnos", "/Inscritos", "/Pendiente", "/System Manager"];
    const gestionAcademicaOUs = ["/Gestion Academica", "/Management", "/System Manager"];
    const docentesOU = ["/Docentes", "/System Manager"];
    const developmentOUs = ["/Development", "/PruebasDev", "/System Manager"];

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
      <div className="app-container">
        <div className="content" style={{ marginLeft: "0" }}>
          <LoginButton onToken={setIdToken} />
        </div>
      </div>
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

  let defaultRoute = "/home";
  
  if (allowedModules.includes("payrolls")) defaultRoute = "/payrolls";
  else if (allowedModules.includes("invoices")) defaultRoute = "/invoices";
  else if (allowedModules.includes("registration")) defaultRoute = "/matriculacion";

  return (
    <div className="app-container">
      {showNavbar && <Navbar />}
      <div className="content" style={{ marginLeft: showNavbar ? "250px" : "0" }}>
        <Routes>
          <Route path="/" element={<Navigate to={defaultRoute} replace />} />

          {allowedModules.includes("invoices") && (
            <Route path="/invoices/*" element={<Invoices />} />
          )}
          {allowedModules.includes("payrolls") && (
            <Route path="/payrolls/*" element={<Payrolls />} />
          )}
          {allowedModules.includes("report") && (
            <Route path="/reporte/*" element={<DashboardMatricula />} />
          )}
          {allowedModules.includes("registration") && (
            <>
              <Route path="/matriculacion" element={<Registration />} />
              <Route path="/matriculacion/formulario" element={<Formulario />} />
              <Route path="/matriculacion/reserva" element={<ReservarCupo />} />
            </>
          )}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<Navigate to={defaultRoute} replace />} />
        </Routes>
      </div>
    </div>
  );
}

// 👇 Este es el componente principal que monta <Router>
function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;

