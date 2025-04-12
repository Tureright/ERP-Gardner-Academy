import Settings from "./pages/Settings";
import Home from "./pages/Home/page";
import Budgeting from "./pages/Budgeting/page";
import Dropdowns from "./pages/Dropdowns/page";
import Invoices from "./pages/Invoices/invoicesPage";

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
];
