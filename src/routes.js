
import Payrolls from "./pages/Payrolls/Pages/PayrollPage";
import NewPayroll_SelectTeacher from "@/pages/Payrolls/Pages/NewPayroll_SelectTeacher";
import NewPayroll_FillPayroll from "./pages/Payrolls/Pages/NewPayroll_FillPayroll";
import NewPayroll_PayrollDetails from "./pages/Payrolls/Pages/NewPayroll_PayrollDetails";
import Settings from "./pages/Settings";

export const routes = [

  {
    title: "Roles de Pago",
    url: "/payrolls",
    component: Payrolls,
    subpages: [
      {
        title: "Roles de Pago",
        url: "/payrolls",
        component: Payrolls,
      },
      {
        title: "Seleccionar Profesores",
        url: "/payrolls/select-teacher",
        component: NewPayroll_SelectTeacher,
      },
      {
        title: "Llenar Rol de Pago",
        url: "/payrolls/fill-payroll",
        component: NewPayroll_FillPayroll,
      },
      {
        title: "Detalles del Rol de Pago",
        url: "/payrolls/payroll-details",
        component: NewPayroll_PayrollDetails,
      },
      
    ],
  },
  
  {
    title: "Configuración",
    url: "/settings",
    component: Settings,
  },
];
