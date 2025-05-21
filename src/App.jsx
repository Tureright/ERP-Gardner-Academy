// App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { routes } from "@/routes";
import { useAuth } from "@/context/AuthContext";
import LoginButton from "@/components/LoginButton"; // Agrega tu botón de login
import "./App.css";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {
  const { idToken, setIdToken } = useAuth();

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="content">
          {!idToken ? (
            <LoginButton onToken={setIdToken} />
          ) : (
            <Routes>
              {routes.map((route) => (
                <Route path={`${route.url}/*`} element={<route.component />} key={route.title} />
              ))}
            </Routes>
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;
