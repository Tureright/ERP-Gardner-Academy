// App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { routes } from "@/routes";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="content">
          <Routes>
            {routes.map((route) => (
              <Route path={route.url} element={<route.component />} key={route.title} />
            ))}
          </Routes>
        </div>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
