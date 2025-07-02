// src/pages/PostTest.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";

const questions = [
  {
    id: 1,
    question: "¿Qué es la asepsia?",
    options: [
      "Es una enfermedad infecciosa",
      "El conjunto de procedimientos para eliminar microorganismos y evitar infecciones",
      "Una técnica de relajación",
      "Una vacuna preventiva"
    ],
    answer: "b"
  },
  {
    id: 2,
    question: "¿Qué incluyen los signos vitales?",
    options: [
      "Temperatura, pulso, frecuencia respiratoria y presión arterial",
      "Color de piel y altura",
      "Frecuencia urinaria y glucosa",
      "Presión ocular y dental"
    ],
    answer: "a"
  },
  {
    id: 3,
    question: "¿Qué es una inyección?",
    options: [
      "Una pastilla tomada por vía oral",
      "Una forma de lavar heridas",
      "Una forma de administrar medicamentos mediante una aguja",
      "Un examen de laboratorio"
    ],
    answer: "c"
  },
  {
    id: 4,
    question: "¿Qué es la bioseguridad?",
    options: [
      "Medir la temperatura con termómetro",
      "Una técnica para el control de peso",
      "Un tipo de vacuna",
      "Normas para prevenir riesgos biológicos en procedimientos de salud"
    ],
    answer: "d"
  },
  {
    id: 5,
    question: "¿Cuál es la forma correcta de hacer el lavado de manos?",
    options: [
      "Solo con agua durante 10 segundos",
      "Con jabón en seco",
      "Con agua y jabón durante al menos 40 segundos",
      "No es necesario si usamos guantes"
    ],
    answer: "c"
  }
];

const PostTest = () => {
  const [answers, setAnswers] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleOptionChange = (qId, option) => {
    setAnswers({ ...answers, [qId]: option });
  };

  const handleSubmit = async () => {
    const name = localStorage.getItem("studentName");
    const correo = localStorage.getItem("studentEmail");

    const respuestasFormateadas = Object.entries(answers).map(([key, value]) => {
      const index = questions.find(q => q.id === parseInt(key)).options.indexOf(value);
      const letra = String.fromCharCode(97 + index);
      return {
        pregunta: key,
        respuesta: letra
      };
    });

    try {
      await axios.post("http://localhost:8000/api/test/", {
        name,
        correo,
        testType: "post",
        respuestas: respuestasFormateadas
      });

      localStorage.setItem("postTestCompletado", "true"); // ✅ flag para rutas protegidas
      setMessage("Post-test enviado correctamente");
      setTimeout(() => {
        navigate("/resultados");
      }, 1500);
    } catch (error) {
      setMessage("Error al enviar tus respuestas. Intenta nuevamente.");
    }
  };

  return (
    <div className="test-container">
      <h2 style={{ textAlign: "center", color: "#0b5ed7", marginBottom: "25px" }}>Post-Test</h2>
      {questions.map((q) => (
        <div key={q.id} className="question-block">
          <p>{q.id}. {q.question}</p>
          {q.options.map((option, index) => (
            <label key={index} className="option-label">
              <input
                type="radio"
                name={`question_${q.id}`}
                value={option}
                checked={answers[q.id] === option}
                onChange={() => handleOptionChange(q.id, option)}
              />{" "}
              {option}
            </label>
          ))}
        </div>
      ))}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button className="submit-button" onClick={handleSubmit}>Enviar</button>
      </div>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default PostTest;
