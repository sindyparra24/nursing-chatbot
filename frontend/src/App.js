import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegistroEstudiante from "./components/RegistroEstudiante";
import PreTest from "./pages/PreTest";
import PostTest from "./pages/PostTest";
import Chatbot from "./pages/Chatbot";
import Resultados from "./pages/Resultados";
import PrediccionIA from "./pages/PrediccionIA";
import './App.css';

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;
