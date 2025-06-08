// src/pages/Registration/reservarCupo.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormStyles from "../../styles/Reservation.module.css";

const ReservaCupo = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombres: "",
        apellidos: "",
        cedula: "",
        nivel: "",
    });

    const [mensaje, setMensaje] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensaje("");

        try {
            const response = await fetch(
                "https://script.google.com/macros/s/AKfycby6fChAzvmuZM3R0gGODUQud2iG7SoO1arx-DVK89ADGcxnQwVIJR8fLnXJ_vmcvkIC/exec",
                {
                    method: "POST",
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();
            if (data.ok) {
                setMensaje("Reserva guardada correctamente.");
                setFormData({ nombres: "", apellidos: "", cedula: "", nivel: "" });
            } else {
                setMensaje(`Error: ${data.error || "No se pudo guardar la reserva."}`);
            }
        } catch (err) {
            setMensaje("Error al conectar con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className={FormStyles.container}>
                <h2 className={FormStyles.title}>Reserva de Cupo</h2>

                <form onSubmit={handleSubmit} className={FormStyles.form}>
                    <input
                        type="text"
                        name="nombres"
                        placeholder="Nombres"
                        value={formData.nombres}
                        onChange={handleChange}
                        required
                        className={FormStyles.input}
                    />
                    <input
                        type="text"
                        name="apellidos"
                        placeholder="Apellidos"
                        value={formData.apellidos}
                        onChange={handleChange}
                        required
                        className={FormStyles.input}
                    />
                    <input
                        type="text"
                        name="cedula"
                        placeholder="Cédula"
                        value={formData.cedula}
                        onChange={handleChange}
                        required
                        className={FormStyles.input}
                    />
                    <select
                        name="nivel"
                        value={formData.nivel}
                        onChange={handleChange}
                        required
                        className={FormStyles.input}
                    >
                        <option value="seleccion">Seleccione el nivel</option>
                        <option value="Maternal I">Maternal I (1 a 2 años)</option>
                        <option value="Maternal II">Maternal II (2 a 3 años)</option>
                        <option value="Inicial I">Inicial I (3 a 4 años)</option>
                        <option value="Inicial II">Inicial II (4 a 5 años)</option>
                        <option value="Primero de básica">Primero de básica</option>
                        <option value="Segundo de básica">Segundo de básica</option>
                        <option value="Tercero de básica">Tercero de básica</option>
                        <option value="Cuarto de básica">Cuarto de básica</option>
                        <option value="Quinto de básica">Quinto de básica</option>
                        <option value="Sexto de básica">Sexto de básica</option>
                        <option value="Séptimo de básica">Séptimo de básica</option>
                    </select>


                    <button
                        type="submit"
                        disabled={loading}
                        className={FormStyles.submitButton}
                    >
                        {loading ? "Enviando..." : "Reservar cupo"}
                    </button>
                </form>

                {mensaje && <p className={FormStyles.message}>{mensaje}</p>}
            </div>

            {/* Botón de regreso fuera del contenedor */}
            <div className="flex justify-center mt-4">
                <button
                    onClick={() => navigate('/matriculacion')}
                    className={FormStyles.backButton}
                >
                    ← Regresar
                </button>
            </div>
        </>
    );
};

export default ReservaCupo;
