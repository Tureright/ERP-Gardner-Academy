import Settings from "./pages/Settings";
import Home from "./pages/Home/page";
import Budgeting from "./pages/Budgeting/page";
import Dropdowns from "./pages/Dropdowns/page";
import Invoices from "./pages/Invoices/InvoicesPage";
import Payrolls from "./pages/Payrolls/PayrollPage";
import Employees from "./pages/Payrolls/EmployeePage";

export const routes = [
  {
    title: "Home",
    url: "/",
    component: Home,
  },
  {
    title: "Budgeting",
    url: "/Budgeting",
    component: Budgeting,
  },
  {
    title: "Manage Dropdowns",
    url: "/dropdowns",
    component: Dropdowns,
  },
  {
    title: "Settings",
    url: "/settings",
    component: Settings,
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
  },
  {
    title: "Empleados",
    url: "/employees",
    component: Employees,
  },
];
