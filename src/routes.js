
import Payrolls from "./pages/Payrolls/Pages/PayrollPage";
import NewPayroll_SelectTeacher from "@/pages/Payrolls/Pages/NewPayroll_SelectTeacher";
import NewPayroll_FillPayroll from "./pages/Payrolls/Pages/NewPayroll_FillPayroll";
import NewPayroll_PayrollDetails from "./pages/Payrolls/Pages/NewPayroll_PayrollDetails";
import Settings from "./pages/Settings";
import PayrollTemplate from "./pages/Payrolls/components/molecules/PayrollTemplate/PayrollTemplate";

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
      {
        title: "Impresión del Rol de Pago",
        url: "/payrolls/printPayroll",
        component: PayrollTemplate,
      },
      
    ],
  }, 
  {
    title: "Configuración",
    url: "/settings",
    component: Settings,
  },
];
