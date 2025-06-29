import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RegistroEstudiante from "./components/RegistroEstudiante";
import PreTest from "./pages/PreTest";
import PostTest from "./pages/PostTest";
import Chatbot from "./pages/Chatbot";
import Resultados from "./pages/Resultados";
import PrediccionIA from "./pages/PrediccionIA";
import './App.css'; // Importación del estilo

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <Link className="nav-link" to="/">📝 Registro</Link>
          <Link className="nav-link" to="/pretest">✅ Pre-Test</Link>
          <Link className="nav-link" to="/prediccion">🤖 Predicción IA</Link>
          <Link className="nav-link" to="/chatbot">💬 Chatbot</Link>
          <Link className="nav-link" to="/posttest">📊 Post-Test</Link>
          <Link className="nav-link" to="/resultados">📈 Resultados</Link>
        </nav>

        <div className="page-content">
          <Routes>
            <Route path="/" element={<RegistroEstudiante />} />
            <Route path="/pretest" element={<PreTest />} />
            <Route path="/prediccion" element={<PrediccionIA />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/posttest" element={<PostTest />} />
            <Route path="/resultados" element={<Resultados />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
