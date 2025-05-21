import Settings from "./pages/Settings";
import Home from "./pages/Home/page";
import Budgeting from "./pages/Budgeting/page";
import Dropdowns from "./pages/Dropdowns/page";
import Payrolls from "./pages/Payrolls/PayrollPage"
import Employees from "./pages/Payrolls/EmployeePage";
import Registration from "./pages/Registration/matriculacion";
import ReservaCupo from "./pages/Registration/reservarCupo";
import Formulario from "./pages/Registration/formulario"; // este solo redirige al formulario externo

export const routes = [
  {
    title: "Home",
    url: "/home",
    component: Home,
    showInMenu: true,
  },
  {
    title: "Budgeting",
    url: "/Budgeting",
    component: Budgeting,
    showInMenu: true,
  },
  {
    title: "Manage Dropdowns",
    url: "/dropdowns",
    component: Dropdowns,
    showInMenu: true,
  },
  {
    title: "Settings",
    url: "/settings",
    component: Settings,
    showInMenu: true,
  },
  {
    title: "Facturación",
    url: "/invoices",
    component: Invoices,
  },
  {
    title: "Roles de Pago",
    url: "/payrolls",
    component: Payrolls,
    showInMenu: true,
  },
  {
    title: "Matriculación",
    url: "/matriculacion",
    component: Registration,
    showInMenu: true,
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
    title: "Empleados",
    url: "/employees",
    component: Employees,
  },
];
