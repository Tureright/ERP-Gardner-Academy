// src/components/LoginButton.jsx
import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { getAuth, signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/firebase"; // asegúrate de exportar auth desde firebase.js

export default function LoginButton({ onToken }) {
const [error, setError] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-lg shadow w-full max-w-sm text-center">
        <h1 className="text-2xl font-semibold mb-4">Bienvenido</h1>
        <p className="mb-6">Inicia sesión con tu cuenta institucional</p>

        <GoogleLogin
  onSuccess={async (res) => {
    try {
      const credential = GoogleAuthProvider.credential(res.credential);
      const result = await signInWithCredential(auth, credential);
      //console.log("Usuario autenticado:", result.user);
      setError("");
      onToken(res.credential); // Puedes seguir usándolo si lo necesitas
    } catch (err) {
      console.error("Error autenticando con Firebase:", err);
      setError("No se pudo autenticar con Firebase");
    }
  }}
  onError={() => setError("No se pudo iniciar sesión con Google")}
/>


        {error && <p className="text-sm text-red-600 mt-4">{error}</p>}
      </div>
    </div>
  );
}