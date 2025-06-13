// App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { routes } from "@/routes";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="content">
          <Routes>
            {routes.map((route) => {
              // If the route has subpages, render them as nested routes
              if (route.subpages) {
                return route.subpages.map((subpage) => (
                  <Route
                    path={subpage.url}
                    element={<subpage.component />}
                    key={subpage.title}
                  />
                ));
              }
              // Otherwise, render the main route
              return (
                <Route
                  path={route.url}
                  element={<route.component />}
                  key={route.title}
                />
              );
            })}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
