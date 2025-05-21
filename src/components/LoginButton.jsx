// src/components/LoginButton.jsx
import { GoogleLogin } from "@react-oauth/google";

export default function LoginButton({ onToken }) {
  return (
    <div>
      <h2>Inicia sesión con tu cuenta institucional</h2>
      <GoogleLogin
        onSuccess={(response) => {
          const token = response.credential;
          onToken(token);
        }}
        onError={() => {
          console.error("Error al iniciar sesión");
        }}
      />
    </div>
  );
}
