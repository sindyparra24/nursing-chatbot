import React from "react";
import { Navigate } from "react-router-dom";

const RutaProtegida = ({ children, condicion, redireccion }) => {
  return condicion ? children : <Navigate to={redireccion} replace />;
};

export default RutaProtegida;
