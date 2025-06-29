import Payrolls from "./pages/Payrolls/Pages/PayrollPage";
import NewPayroll_SelectTeacher from "@/pages/Payrolls/Pages/NewPayroll_SelectTeacher";
import NewPayroll_FillPayroll from "./pages/Payrolls/Pages/NewPayroll_FillPayroll";
import NewPayroll_PayrollDetails from "./pages/Payrolls/Pages/NewPayroll_PayrollDetails";
import CalendarManager from "./pages/Calendar/Pages/CalendarManager";
import NewCalendar_Calendar from "@/pages/Calendar/Pages/NewCalendar_Calendar";
import CalendarDetails from "@/pages/Calendar/Pages/CalendarDetails";
import TeachersMain from "@/pages/Teachers/Pages/TeachersMain";
import TeachersPayrollDetails from "@/pages/Teachers/Pages/TeachersPayrollDetails"
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
  },
  {
    title: "Calendarios",
    url: "/calendar",
    component: CalendarManager,
    subpages: [
      {
        title: "Calendarios",
        url: "/calendar",
        component: CalendarManager,
      },
      {
        title: "Crear Calendario",
        url: "/calendar/addCalendar",
        component: NewCalendar_Calendar,
      },
      {
        title: "Detalles Horario",
        url: "/calendar/CalendarDetails",
        component: CalendarDetails,
      },
    ],
  },

  {
    title: "Perfil de Docente",
    url: "/teachersProfile",
    component: TeachersMain,
    subpages: [
      {
        title: "Perfil de Docente",
        url: "/teachersProfile",
        component: TeachersMain,
      },
      {
        title: "Datalles del rol de pagos del docente",
        url: "/teachersProfile/payrollDetails",
        component: TeachersPayrollDetails,
      },
    ],
  },
  {
    title: "Configuración",
    url: "/settings",
    component: Settings,
  },
];
