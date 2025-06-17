// App.js
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { routes } from "@/routes";
import "./App.css";

function AppContent() {
  const location = useLocation();
  const isPrintRoute = location.pathname === "/payrolls/printPayroll";

  return (
    <div className="app-container">
      {!isPrintRoute && <Navbar className="no-print"/>}
      <div className={isPrintRoute ? "center-content bg-white " : "content"}>
        <Routes>
          {routes.map((route) =>
            route.subpages
              ? route.subpages.map((subpage) => (
                  <Route
                    path={subpage.url}
                    element={<subpage.component />}
                    key={subpage.title}
                  />
                )
              )
              : (
                  <Route
                    path={route.url}
                    element={<route.component />}
                    key={route.title}
                  />
                )
          )}
        </Routes>
      </div>
    </div>
  );
}
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
