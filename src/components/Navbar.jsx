import { routes } from "../routes";
import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {
  const location = useLocation();

  return (
    <nav>
      <div style={{ margin: 10 }}>
        <img
          src="https://drive.google.com/thumbnail?id=1eUwEZQwika0OzusArZe7-cJNUlri2Bzm&sz=w1000"
          alt="logo"
          width={48}
        />
      </div>
      <ul>
        {routes.map((route) => (
          <li key={route.title}>
            <Link
              to={route.url}
              className={location.pathname === route.url ? "active" : ""}
            >
              {route.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
