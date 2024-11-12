import React, { useState, useEffect, useContext } from "react";
import RecordatoriosProvider from "../context/RecordatoriosContext";
import { CrearRecordatorio } from "../components/recordatorioComponents/CrearRecordatorio";

import { useSelector } from "react-redux";

function Recordatorios() {
  const { currentUser } = useSelector((state) => state.user);
  // Verificar si el currentUser tiene el correo sergio@gmail.com
  const isSergio = currentUser.email === "sergio@gmail.com";
  console.log("currentUser", currentUser)
  
  return (
   
    <div className="bg-slate-900 h-screen text-white ">
    {isSergio ? (
      <CrearRecordatorio />
    ) : (
      <h1 className="text-2xl font-bold">Sección no disponible</h1>
    )}
  </div>
   
  );
}

export default Recordatorios;
