import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li><Link to="/">Registro</Link></li>
        <li><Link to="/pretest">Pre-Test</Link></li>
        <li><Link to="/prediccion">Predicción IA</Link></li>
        <li><Link to="/chatbot">Chatbot</Link></li>
        <li><Link to="/posttest">Post-Test</Link></li>
        <li><Link to="/resultados">Resultados</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;