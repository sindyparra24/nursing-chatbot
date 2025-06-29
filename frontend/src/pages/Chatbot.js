import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const respuestasPorTema = {
  "asepsia": "La asepsia es el conjunto de procedimientos para eliminar microorganismos y evitar infecciones.",
  "signos vitales": "Los signos vitales incluyen la temperatura, el pulso, la frecuencia respiratoria y la presión arterial.",
  "inyeccion": "Una inyección es una forma de administrar medicamentos mediante una aguja en el cuerpo.",
  "bioseguridad": "La bioseguridad implica normas para prevenir riesgos biológicos en procedimientos de salud.",
  "lavado de manos": "El lavado de manos debe hacerse con agua y jabón durante al menos 40 segundos para prevenir infecciones."
};

const normalizar = (texto) => {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

const Chatbot = () => {
  const [errores, setErrores] = useState([]);
  const [mensajes, setMensajes] = useState([]);
  const [input, setInput] = useState("");
  const [cargando, setCargando] = useState(true);
  const [mostrarBotonPostTest, setMostrarBotonPostTest] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const correo = localStorage.getItem("studentEmail");
    if (!correo) {
      setMensajes([{ autor: "bot", texto: "No se encontró información del estudiante." }]);
      setCargando(false);
      return;
    }

    const obtenerErrores = async () => {
      try {
        const res = await axios.post("http://localhost:8000/api/test/errores/", { correo });

        if (res.data && res.data.errores.length > 0) {
          setErrores(res.data.errores);
          const bienvenida = {
            autor: "bot",
            texto: "¡Hola! Noté que tuviste errores en algunos temas. Puedes preguntarme sobre cualquiera y te ayudaré a repasarlo."
          };

          const listaTemas = res.data.errores.map((err) => ({
            autor: "bot",
            texto: `Fallaste en el tema: ${err.tema}.`
          }));

          setMensajes([bienvenida, ...listaTemas]);
        } else {
          setMensajes([{ autor: "bot", texto: "¡Felicidades! No cometiste errores en el Pre-Test." }]);
          setMostrarBotonPostTest(true);
        }
      } catch (error) {
        setMensajes([{ autor: "bot", texto: "Ocurrió un error al cargar tus resultados." }]);
      } finally {
        setCargando(false);
      }
    };

    obtenerErrores();
  }, []);

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (input.trim() === "") return;

    const mensajeEstudiante = { autor: "tú", texto: input };
    setMensajes((prev) => [...prev, mensajeEstudiante]);

    const respuesta = generarRespuesta(input);
    setTimeout(() => {
      setMensajes((prev) => [...prev, { autor: "bot", texto: respuesta }]);
      setMostrarBotonPostTest(true);
    }, 500);

    setInput("");
  };

  const generarRespuesta = (mensaje) => {
    const mensajeNormalizado = normalizar(mensaje);

    for (let err of errores) {
      const temaNormalizado = normalizar(err.tema);
      if (mensajeNormalizado.includes(temaNormalizado)) {
        return respuestasPorTema[temaNormalizado] || "Ese tema aún no tiene una explicación disponible.";
      }
    }

    return "No detecté un tema que hayas fallado en tu mensaje. Intenta preguntarme sobre uno de los temas en los que tuviste errores.";
  };

  return (
    <div className="chatbot-container">
      <h2 style={{ textAlign: "center", color: "#0b5ed7" }}>Chatbot Educativo</h2>

      <div className="chatbox">
        {mensajes.map((msg, idx) => (
          <div
            key={idx}
            className={msg.autor === "bot" ? "bot-message" : "user-message"}
          >
            {msg.texto}
          </div>
        ))}
      </div>

      {!cargando && (
        <>
          <form onSubmit={manejarEnvio} className="chat-input">
            <input
              type="text"
              placeholder="Escribe tu pregunta..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit">Enviar</button>
          </form>

          {mostrarBotonPostTest && (
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <button
                onClick={() => navigate("/posttest")}
                className="submit-button"
              >
                Ir al Post-Test
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Chatbot;