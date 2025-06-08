import Settings from "./pages/Settings";
import Home from "./pages/Home/page";
import Budgeting from "./pages/Budgeting/page";
import Dropdowns from "./pages/Dropdowns/page";
import Payrolls from "./pages/Payrolls//Pages/PayrollPage"
import Employees from "./pages/Payrolls/Pages/EmployeePage";
import Registration from "./pages/Registration/matriculacion";
import ReservaCupo from "./pages/Registration/reservarCupo";
import Formulario from "./pages/Registration/formulario"; // este solo redirige al formulario externo

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
    showInMenu: false
  },
];
