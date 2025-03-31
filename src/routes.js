import Settings from "./pages/Settings";
import Home from "./pages/Home/page";
import Budgeting from "./pages/Budgeting/page";
import Dropdowns from "./pages/Dropdowns/page";

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
];
