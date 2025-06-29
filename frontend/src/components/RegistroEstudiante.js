import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

const RegistroEstudiante = () => {
  const [name, setName] = useState("");
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleRegistro = async () => {
    if (!name || !correo) {
      setMensaje("Por favor, completa todos los campos.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/api/register/", {
        name,
        correo,
      });

      // Si el estudiante fue registrado correctamente
      if (res.status === 200 && res.data.message) {
        localStorage.setItem("studentName", name);
        localStorage.setItem("studentEmail", correo);
        setMensaje("Estudiante registrado correctamente.");
        setTimeout(() => navigate("/pretest"), 1000);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error;

      // Si el estudiante ya está registrado, aún así redirige
      if (errorMsg === "El estudiante ya está registrado") {
        localStorage.setItem("studentName", name);
        localStorage.setItem("studentEmail", correo);
        setMensaje("Estudiante ya registrado. Redirigiendo al Pre-Test...");
        setTimeout(() => navigate("/pretest"), 1000);
      } else {
        setMensaje(errorMsg || "Error al registrar. Intenta nuevamente.");
      }
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Registro de Estudiante</h2>

      <div className="form-group">
        <label htmlFor="nombre">Nombre:</label>
        <input
          id="nombre"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-input"
          placeholder="Ingresa tu nombre completo"
        />
      </div>

      <div className="form-group">
        <label htmlFor="correo">Correo:</label>
        <input
          id="correo"
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className="form-input"
          placeholder="ejemplo@correo.com"
        />
      </div>

      <button onClick={handleRegistro} className="submit-button">
        Registrar
      </button>

      {mensaje && <p className="message">{mensaje}</p>}
    </div>
  );
};

export default RegistroEstudiante;
