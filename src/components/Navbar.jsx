import { routes } from "../routes";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const Navbar = () => {
  const location = useLocation();
  const { userData } = useAuth();

  return (
    <nav>
      <div style={{ margin: 10 }}>
        <img
          src="https://cdigardnermini.edu.ec/img/header/centro-infantil-gardner-mini-academy-quito-valle-de-los-chillos.png"
          alt="Gardner Mini Academy Logo"
          width={48}
        />
      </div>
      <ul>
        {routes
          .filter((route) => {
            if (!route.showInMenu) return false;
            if (!route.allowedOUs) return true; // público
            return userData && route.allowedOUs.includes(userData.ouPath);
          })
          .map((route) => (
            <li key={route.title}>
              <Link
                to={route.url}
                className={
                  location.pathname.toLowerCase().startsWith(route.url.toLowerCase())
                    ? "active"
                    : ""
                }
              >
                {route.title}
              </Link>
            </li>
          ))}
      </ul>
    </nav>
  );
};
