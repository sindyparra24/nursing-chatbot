import React, { useState } from "react";
import axios from "axios";
import "./../App.css";

const Resultados = () => {
  const [email, setEmail] = useState("");
  const [resultados, setResultados] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const obtenerResultados = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/results/?email=${email}`);
      setResultados(res.data);
      setMensaje("");
    } catch (error) {
      setMensaje("No se encontraron resultados o hubo un error al buscar.");
      setResultados([]);
    }
  };

  return (
    <div className="resultados-container">
      <h2 className="resultados-title">Resultados del Estudiante</h2>

      <div className="form-group">
        <label htmlFor="email">Correo del estudiante:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-input"
          placeholder="ejemplo@correo.com"
        />
      </div>

      <button onClick={obtenerResultados} className="submit-button" style={{ marginBottom: "20px" }}>
        Buscar Resultados
      </button>

      {mensaje && <p className="mensaje-error">{mensaje}</p>}

      {resultados.length > 0 && (
        <ul className="analisis-container">
          {resultados.map((r, i) => (
            <li key={i}>
              <strong>{r.type === "pre" ? "Pre-Test" : "Post-Test"}:</strong> Puntaje: {r.score}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Resultados;
