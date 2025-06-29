import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";

const PrediccionIA = () => {
  const [prediccion, setPrediccion] = useState("");
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const correo = localStorage.getItem("studentEmail");
    if (!correo) {
      setPrediccion("No se encontró el correo del estudiante.");
      setCargando(false);
      return;
    }

    axios
      .post("http://localhost:8000/api/test/prediccion/", { correo })
      .then((res) => {
        setPrediccion(res.data.prediccion);
      })
      .catch(() => {
        setPrediccion("Ocurrió un error al obtener la predicción.");
      })
      .finally(() => setCargando(false));
  }, []);

  const continuar = () => {
    navigate("/chatbot");
  };

  return (
    <div className="test-container">
      <h2 style={{ textAlign: "center", color: "#0b5ed7" }}>
        Predicción de Rendimiento con IA
      </h2>

      {cargando ? (
        <p className="message">Cargando predicción...</p>
      ) : (
        <>
          <p className="message" style={{ color: "#0b5ed7" }}>
            <strong>{prediccion}</strong>
          </p>
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button className="submit-button" onClick={continuar}>
              Continuar al Chatbot
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PrediccionIA;
