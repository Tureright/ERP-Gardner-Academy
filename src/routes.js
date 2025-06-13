import Settings from "./pages/Settings";
import Home from "./pages/Home/page";
import Budgeting from "./pages/Budgeting/page";
import Dropdowns from "./pages/Dropdowns/page";
import Payrolls from "./pages/Payrolls/Pages/PayrollPage";
import NewPayroll_SelectTeacher from "@/pages/Payrolls/Pages/NewPayroll_SelectTeacher";
import NewPayroll_FillPayroll from "./pages/Payrolls/Pages/NewPayroll_FillPayroll";
import NewPayroll_PayrollDetails from "./pages/Payrolls/Pages/NewPayroll_PayrollDetails";
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
    subpages: [
      {
        title: "Roles de Pago",
        url: "/payrolls",
        component: Payrolls,
      },
      {
        title: "Seleccionar Profesores",
        url: "/payrolls/selectTeacher",
        component: NewPayroll_SelectTeacher,
      },
      {
        title: "Llenar Rol de Pago",
        url: "/payrolls/fillPayroll",
        component: NewPayroll_FillPayroll,
      },
      {
        title: "Detalles del Rol de Pago",
        url: "/payrolls/payrollDetails",
        component: NewPayroll_PayrollDetails,
      },
    ],
    allowedOUs: ["/GestionAcademica", "/Management", "/Development"],
  },
  {
    title: "Matriculación",
    url: "/matriculacion",
    component: Registration,
    showInMenu: true,
    allowedOUs: ["/Alumnos", "/Inscritos", "/Pendiente", "/Development"],
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
    allowedOUs: ["/GestionAcademica", "/Management", "/Development"],
  },
];
