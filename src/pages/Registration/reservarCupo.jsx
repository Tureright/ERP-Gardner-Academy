// pages/ReservaCupo.jsx
import React, { useState } from "react";

const ReservaCupo = () => {
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
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensaje("");

        try {
            const response = await fetch("https://script.google.com/macros/s/AKfycby6fChAzvmuZM3R0gGODUQud2iG7SoO1arx-DVK89ADGcxnQwVIJR8fLnXJ_vmcvkIC/exec", {
                method: "POST",
               // headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (data.ok) {
                setMensaje("Reserva guardada correctamente.");
                setFormData({
                    nombres: "",
                    apellidos: "",
                    cedula: "",
                    nivel: ""
                });
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
        <div className="p-4 max-w-md mx-auto bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-4">Reserva de Cupo</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="nombres"
                    placeholder="Nombres"
                    value={formData.nombres}
                    onChange={handleChange}
                    required
                    className="input mb-2"
                />
                <input
                    type="text"
                    name="apellidos"
                    placeholder="Apellidos"
                    value={formData.apellidos}
                    onChange={handleChange}
                    required
                    className="input mb-2"
                />
                <input
                    type="text"
                    name="cedula"
                    placeholder="Cédula"
                    value={formData.cedula}
                    onChange={handleChange}
                    required
                    className="input mb-2"
                />
                <input
                    type="text"
                    name="nivel"
                    placeholder="Nivel (Ej. Inicial 2)"
                    value={formData.nivel}
                    onChange={handleChange}
                    required
                    className="input mb-2"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="btn bg-blue-500 text-white w-full"
                >
                    {loading ? "Enviando..." : "Reservar cupo"}
                </button>
            </form>
            {mensaje && <p className="mt-4 text-center text-sm">{mensaje}</p>}
        </div>
    );
};

export default ReservaCupo;