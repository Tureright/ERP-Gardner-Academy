// src/components/LoginButton.jsx
import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";

export default function LoginButton({ onToken }) {
const [error, setError] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-lg shadow w-full max-w-sm text-center">
        <h1 className="text-2xl font-semibold mb-4">Bienvenido</h1>
        <p className="mb-6">Inicia sesión con tu cuenta institucional</p>

        <GoogleLogin
          onSuccess={(res) => {
            onToken(res.credential);
            setError("");
          }}
          onError={() => setError("No se pudo iniciar sesión")}
        />

        {error && <p className="text-sm text-red-600 mt-4">{error}</p>}
      </div>
    </div>
  );
}