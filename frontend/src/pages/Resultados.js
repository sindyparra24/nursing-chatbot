import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import "../App.css";

const Resultados = () => {
  const [datos, setDatos] = useState([]);
  const [analisis, setAnalisis] = useState("");

  useEffect(() => {
    const correo = localStorage.getItem("studentEmail");

    const fetchData = async () => {
      try {
        const res = await axios.post("http://localhost:8000/api/test/comparar/", { correo });
        const data = res.data;

        const resultados = Object.entries(data).map(([tema, valores]) => ({
          tema,
          PreTest: valores.pre,
          PostTest: valores.post
        }));

        setDatos(resultados);

        const analisisIA = resultados.map(r => {
          if (r.PreTest === 0 && r.PostTest === 0) {
            return `Aún necesitas repasar el tema <strong>${r.tema}</strong>.`;
          } else if (r.PreTest === 0 && r.PostTest === 1) {
            return `Mejoraste en <strong>${r.tema}</strong>. ¡Buen trabajo!`;
          } else if (r.PreTest === 1 && r.PostTest === 0) {
            return `Hubo un retroceso en <strong>${r.tema}</strong>. Revisa nuevamente ese tema.`;
          } else {
            return `Dominaste correctamente <strong>${r.tema}</strong>.`;
          }
        }).join("<br>");

        setAnalisis(analisisIA);

      } catch (error) {
        console.error("Error al obtener resultados:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="resultados-container">
      <h2 style={{ textAlign: "center", color: "#0b5ed7", marginBottom: "25px" }}>Resultados Comparativos</h2>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={datos}>
            <XAxis dataKey="tema" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="PreTest" fill="#b39ddb" />
            <Bar dataKey="PostTest" fill="#81c784" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="analisis-box">
        <h3 style={{ color: "#0b5ed7", marginBottom: "10px" }}>Análisis Inteligente</h3>
        <p dangerouslySetInnerHTML={{ __html: analisis }} />
      </div>
    </div>
  );
};

export default Resultados;
