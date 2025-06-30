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
import DashboardMatricula from "./pages/Report/registrationReport";
import Registration from "./pages/Registration/matriculacion";
import Formulario from "./pages/Registration/formulario";
import ReservarCupo from "./pages/Registration/reservarCupo";
import Invoices from "./pages/Invoices/InvoicesPage";

import Payrolls from "./pages/Payrolls/Pages/PayrollPage";
import NewPayroll_SelectTeacher from "./pages/Payrolls/Pages/NewPayroll_SelectTeacher";
import NewPayroll_FillPayroll from "./pages/Payrolls/Pages/NewPayroll_FillPayroll";
import NewPayroll_PayrollDetails from "./pages/Payrolls/Pages/NewPayroll_PayrollDetails";

import CalendarManager from "./pages/Calendar/Pages/CalendarManager";
import NewCalendar_Calendar from "./pages/Calendar/Pages/NewCalendar_Calendar";
import CalendarDetails from "./pages/Calendar/Pages/CalendarDetails";

import TeachersMain from "./pages/Teachers/Pages/TeachersMain";
import TeachersPayrollDetails from "./pages/Teachers/Pages/TeachersPayrollDetails";

import { Toaster } from "@/components/ui/toaster";
import "./App.css";
import CenteredSpinner from "./components/atoms/CenteredSpinner";

function AppRoutes() {
  const { idToken, setIdToken, userData, setUserData } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (idToken && !userData) {
      fetch(
        "https://script.google.com/macros/s/AKfycbykD6bVSicqEgX6ok_8PhWuYqftSjcOgQrvNs0DeBKWrf_JJFYDwD0Emr8Q5OZzhvk0Tg/exec",
        {
          method: "POST",
          body: JSON.stringify({ idToken }),
        }
      )
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
              adminId: data.adminId,
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
    const allModules = [
      "home",
      "settings",
      "dropdown",
      "invoices",
      "payrolls",
      "registration",
      "report",
      "calendar"
    ];
    const registrationOUs = ["/Alumnos", "/Inscritos", "/Pendiente", "/System Manager"];
    const gestionAcademicaOUs = ["/Gestion Academica", "/Management", "/System Manager"];
    const docentesOUs = ["/Docentes", "/System Manager"];
    const developmentOUs = ["/Development", "/PruebasDev", "/System Manager"];

    if (developmentOUs.includes(ouPath)) return allModules;
    if (gestionAcademicaOUs.includes(ouPath)) return allModules;
    if (registrationOUs.includes(ouPath)) return ["registration"];
    if (docentesOUs.includes(ouPath)) return ["teachersProfile"];
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
    return (<CenteredSpinner text="Cargando datos de usuario..." />);
  }

  const allowedModules = getAllowedModules(userData.ouPath);

  let defaultRoute = "/home";
  if (allowedModules.includes("payrolls")) defaultRoute = "/payrolls";
  else if (allowedModules.includes("invoices")) defaultRoute = "/invoices";
  else if (allowedModules.includes("registration")) defaultRoute = "/matriculacion";
  else if (allowedModules.includes("teachersProfile")) defaultRoute = "/teachersProfile";

  return (
    <div className="app-container">
      {showNavbar && <Navbar />}
      <div
        className="content"
        style={{ marginLeft: showNavbar ? "250px" : "0" }}
      >
        <Routes>
          <Route path="/" element={<Navigate to={defaultRoute} replace />} />

          {allowedModules.includes("invoices") && (
            <Route path="/invoices" element={<Invoices />} />
          )}
          {allowedModules.includes("payrolls") && (
            <>
              <Route path="/payrolls" element={<Payrolls />} />
              <Route path="/payrolls/selectTeacher" element={<NewPayroll_SelectTeacher />} />
              <Route path="/payrolls/fillPayroll" element={<NewPayroll_FillPayroll />} />
              <Route path="/payrolls/payrollDetails" element={<NewPayroll_PayrollDetails />} />
            </>
          )}
          {allowedModules.includes("calendar") && (
            <>
              <Route path="/calendar" element={<CalendarManager />} />
              <Route path="/calendar/addCalendar" element={<NewCalendar_Calendar />} />
              <Route path="/calendar/CalendarDetails" element={<CalendarDetails />} />
            </>
          )}
          {allowedModules.includes("teachersProfile") && (
            <>
              <Route path="/teachersProfile" element={<TeachersMain />} />
              <Route path="/teachersProfile/payrollDetails" element={<TeachersPayrollDetails />} />
            </>
          )}
          {allowedModules.includes("registration") && (
            <>
              <Route path="/matriculacion" element={<Registration />} />
              <Route path="/matriculacion/formulario" element={<Formulario />} />
              <Route path="/matriculacion/reserva" element={<ReservarCupo />} />
            </>
          )}
          {allowedModules.includes("report") && (
            <Route path="/reporte" element={<DashboardMatricula />} />
          )}

          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<Navigate to={defaultRoute} replace />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
      <Toaster />
    </Router>
  );
}

export default App;
