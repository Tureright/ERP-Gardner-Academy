import { routes } from "../routes";
import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {
  const location = useLocation();

  return (
    <nav>
      <div style={{ margin: 10 }}>
        <img
          src="https://cdigardnermini.edu.ec/img/header/centro-infantil-gardner-mini-academy-quito-valle-de-los-chillos.png"
          alt="logo"
          width={48}
        />
      </div>
      <ul>
        {routes
          .filter(route => route.showInMenu)
          .map((route) => (
            <li key={route.title}>
              <Link
                to={route.url}
                className={location.pathname === route.url ? "active" : ""}
              >
                {route.title}
              </Link>
            </li>
          ))
        }
      </ul>
    </nav>
  );
};