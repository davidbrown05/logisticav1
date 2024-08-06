import React, { useState } from "react";
import { ResportesSeccion } from "../components/reportesComponets/ResportesSeccion";
import { ReporteProceso } from "../components/reportesComponets/ReporteProceso";

function Reportes() {
  const [selectedReport, setSelectedReport] = useState("");
  const renderReportContent = () => {
    switch (selectedReport) {
      case "":
        return <ResportesSeccion/>;
      case "VISITADA":
        return <div>Contenido para VISITADA</div>;
      case "EMPRESA":
        return <div>Contenido para EMPRESA</div>;
      case "VENTAS":
        return <div>Contenido para VENTAS</div>;
      case "COMPRADOR":
        return <div>Contenido para COMPRADOR</div>;
      case "CIUDAD":
        return <div>Contenido para CIUDAD</div>;
      case "PROCESO":
        return <ReporteProceso/>;
      case "SEGUIMIENTO PROCESAL":
        return <div>Contenido para SEGUIMIENTO PROCESAL</div>;
      default:
        return null;
    }
  };
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-6">
        <h1 className=" font-semibold lg:text-[30px]">REPORTES</h1>
        <div className="flex flex-col">
          <label>Seleccione un resporte</label>
          <select
            value={selectedReport} // Valor seleccionado
            onChange={(e) => setSelectedReport(e.target.value)}
            className="border p-2 rounded-md shadow-sm"
          >
              <option value="">SELECCIONE UN REPORTE</option>
            <option value="VISITADA">VISITADA</option>
            <option value="EMPRESA">EMPRESA</option>
            <option value="VENTAS">VENTAS</option>
            <option value="COMPRADOR">COMPRADOR</option>
            <option value="CIUDAD">CIUDAD</option>
            <option value="PROCESO">PROCESO</option>
            <option value="SEGUIMIENTO PROCESAL">SEGUIMIENTO PROCESAL</option>
          </select>
        </div>
        {/* Mostrar contenido dinámico según el paso actual */}
        <div className="step-content  p-4 mt-1">{renderReportContent()}</div>
      </div>
    </>
  );
}

export default Reportes;
