import Settings from "./pages/Settings";
import Home from "./pages/Home/page";
import Budgeting from "./pages/Budgeting/page";
import Dropdowns from "./pages/Dropdowns/page";
import Payrolls from "./pages/Payrolls//Pages/PayrollPage";
import Invoices from "./pages/Invoices/InvoicesPage";
import Registration from "./pages/Registration/matriculacion";
import ReservaCupo from "./pages/Registration/reservarCupo";
import Formulario from "./pages/Registration/formulario"; // este solo redirige al formulario externo
import DashboardMatricula from "./pages/Report/registrationReport";

export const routes = [
  {
    title: "Home",
    url: "/home",
    component: Home,
    showInMenu: false,
  },
  {
    title: "Budgeting",
    url: "/budgeting",
    component: Budgeting,
    showInMenu: false,
  },
  {
    title: "Manage Dropdowns",
    url: "/dropdowns",
    component: Dropdowns,
    showInMenu: false,
  },
  {
    title: "Settings",
    url: "/settings",
    component: Settings,
    showInMenu: false,
  },
  {
    title: "Roles de Pago",
    url: "/payrolls",
    component: Payrolls,
    showInMenu: true,
    allowedOUs: ["/Gestion Academica", "/Management", "/Development", "/System Manager"],
  },
  {
    title: "Facturación",
    url: "/invoices",
    component: Invoices,
    showInMenu: true,
    allowedOUs: ["/Gestion Academica", "/Management", "/Development", "/System Manager"],
  },
  {
    title: "Matriculación",
    url: "/matriculacion",
    component: Registration,
    showInMenu: true,
    allowedOUs: ["/Alumnos", "/Inscritos", "/Pendiente", "/Development", "/System Manager"],
  },
  {
    title: "Reserva Cupo",
    url: "/reserva",
    component: ReservaCupo,
    showInMenu: false,
  },
  {
    title: "Formulario Matrícula",
    url: "/formulario",
    component: Formulario,
    showInMenu: false,
  },
  {
    title: "Reportes de Matriculación",
    url: "/reporte",
    component: DashboardMatricula,
    showInMenu: true,
    allowedOUs: ["/Gestion Academica", "/Management", "/Development", "/System Manager"],
  },
];
