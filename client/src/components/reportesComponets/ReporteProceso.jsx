import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

export const ReporteProceso = () => {
  const [proceso, setProceso] = useState("JUDICIAL"); // Estado para almacenar el proceso seleccionado
  const [informe, setInforme] = useState(null); // Estado para almacenar el informe obtenido del backend
  const [loading, setLoading] = useState(false);

  const handleGenerarReporte = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/reportejuridico/${proceso}`
      ); // Hacer solicitud al endpoint del backend con el proceso seleccionado
      let dataReport = await response.data;
      setInforme(dataReport); // Actualizar el estado con los datos del informe obtenidos del backend
      console.log("reporte", dataReport);
      report(dataReport);
    } catch (error) {
      console.error("Error al generar el reporte:", error);
    }
  };

  //funcion para generar reporte
  const report = (dataReport) => {
    const titulo = [{ A: "LOGISTICA INMOBILIARIA: REPORTE JURIDICO" }, {}];
   // const titulo = [{ A: { t: "s", v: "LOGISTICA INMOBILIARIA: REPORTE JURIDICO", s: { bold: true } } }, {}];

    const informacionAdicional = {
      A: "Creado por: iTana el Martes, 04 de Abril del 2023",
    };

    const longitudes = [35, 35];

    setLoading(true);

    const tabla = [
      { A: "PROCESO", B: "PROPIEDAD" }, // Encabezados de las columnas
      ...dataReport.map((producto) => ({
        A: producto.encargadoProceso,
        B: producto.direccion,
      })),
      // Mapear los datos para obtener solo los campos necesarios
    ];

    const dataFinal = [...titulo, ...tabla];

    setTimeout(() => {
      creandoArchivo(dataFinal, longitudes);
      setLoading(false);
    }, 1000);
  };

  const creandoArchivo = (dataFinal,longitudes) => {
    
    const libro = XLSX.utils.book_new();

    const hoja = XLSX.utils.json_to_sheet(dataFinal, { skipHeader: true });

    hoja["!merges"] = [
      XLSX.utils.decode_range("A1:B1"), // Fusionar encabezados
    ];

    const propiedades = longitudes.map((col) => ({ width: col })); // Crear arreglo de propiedades de columnas

    hoja["!cols"] = propiedades;

    XLSX.utils.book_append_sheet(libro, hoja, "ReporteProcesoJuridico");

    XLSX.writeFile(libro, "ReporteProcesoJuridico.xlsx");
  };

  return (
    <>
      <div className=" bg-gray-200 lg:w-[700px] lg:h-[300px] flex flex-col items-center justify-center rounded-lg gap-6">
        <div className="flex flex-col">
          <label>Proceso</label>
          <select
            value={proceso}
            onChange={(e) => setProceso(e.target.value)}
            className="border p-2 rounded-md shadow-sm lg:w-[200px]"
          >
            <option value="JUDICIAL">JUDICIAL</option>
            <option value="EXTRAJUDICIAL">EXTRAJUDICIAL</option>
            <option value="SIN PROCESO">SIN PROCESO</option>
            <option value="CONCLUIDO">CONCLUIDO</option>
          </select>
        </div>
        <button
          onClick={handleGenerarReporte}
          className="bg-black text-white p-2 rounded-lg"
        >
          Generar Reporte
        </button>
        <p>Proceso: Propiedades que están en determinado proceso.</p>
      </div>
    </>
  );
};
