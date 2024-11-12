import React from "react";
import moment from "moment";
import * as XLSX from "xlsx"; // Importamos la librería para exportar a Excel

export const DatosGeneralesPartner = ({ partnerInfo }) => {
  // Calcular el total de utilidades
  const totalUtilidades = partnerInfo.corridas.reduce(
    (total, corrida) => total + corrida.utilidad,
    0
  );

  // Obtener el último valor de inversión
  const ultimaInversion =
    partnerInfo.corridas[partnerInfo.corridas.length - 1].suertePrincipal;

  // Calcular el total final (utilidades + última inversión)
  const totalFinal = totalUtilidades + ultimaInversion;

  // Función para exportar a Excel
  const exportToExcel = () => {
    const dataToExport = [];

    // Agregar las filas de datos corridas
    partnerInfo.corridas.forEach((data, index) => {
      const totalAbonado = data.pagos.reduce((total, pago) => {
        return (
          total +
          pago.abonos.reduce((subTotal, abono) => subTotal + abono.abonoPago, 0)
        );
      }, 0);

      dataToExport.push({
        Ronda: index + 1,
        Meses: data.plazo,
        "Fecha Contrato": moment(data.fechaContratoVigente).format(
          "DD-MMM-YYYY"
        ),
        "Fecha Finalización": moment(data.fechaFinalizacion).format(
          "DD-MMM-YYYY"
        ),
        Inversión: `$${data.suertePrincipal.toLocaleString("es-MX")}`,
        Utilidad: `$${data.utilidad.toLocaleString("es-MX")}`,
        Abonado: `$${totalAbonado.toLocaleString("es-MX")}`,
      });
    });

    // Agregar la fila de totales al final
    dataToExport.push({
      Ronda: "TOTALES",
      Meses: "-", // Total de meses
      "Fecha Contrato": "-", // Puedes poner el contrato más antiguo si aplica
      "Fecha Finalización": "-", // Puedes poner la fecha más reciente si aplica
      Inversión: `$${partnerInfo.corridas
        .reduce((total, corrida) => total + corrida.suertePrincipal, 0)
        .toLocaleString("es-MX")}`, // Total de inversión
      Utilidad: `$${totalUtilidades.toLocaleString("es-MX")}`, // Total de utilidades
      Abonado: `$${totalFinal.toLocaleString("es-MX")}`, // Total final
    });

    // Crear el libro de Excel
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `TR-${partnerInfo.partner}`);

    // Descargar el archivo Excel
    XLSX.writeFile(workbook, `TR-${partnerInfo.partner}.xlsx`);
  };

  return (
    <div className="w-[300px] md:w-[800px] lg:w-[900px] xl:w-[1000px] mt-5">
      <h3 className="font-bold bg-black p-1 rounded-md text-white">
        DATOS GLOBALES DE RONDAS
      </h3>
      <div className="md:w-[800px] lg:w-[900px] xl:w-[1000px] overflow-x-auto w-[300px]">
        {partnerInfo.corridas.length > 0 ? (
          <table className="w-full xl:w-full mt-4 bg-white rounded-xl shadow-md mb-4 text-center justify-center">
            <thead className="rounded-xl">
              <tr>
                <th className="border p-2">RONDA</th>
                <th className="border p-2">MESES</th>
                <th className="border p-2">FECHA CONTRATO</th>
                <th className="border p-2">FECHA FINALIZACION</th>
                <th className="border p-2">INVERSION</th>
                <th className="border p-2">UTILIDAD</th>
                <th className="border p-2">ABONADO</th>
              </tr>
            </thead>
            <tbody className="rounded-xl">
              {partnerInfo.corridas.map((data, index) => {
                // Calcular la suma de los abonos
                const totalAbonado = data.pagos.reduce((total, pago) => {
                  return (
                    total +
                    pago.abonos.reduce(
                      (subTotal, abono) => subTotal + abono.abonoPago,
                      0
                    )
                  );
                }, 0);

                return (
                  <tr key={index} className={`mt-2`}>
                    {/* <td className="border p-3 text-center">{data.ronda + 1}</td> */}
                    <td className="border p-3 text-center">{index + 1}</td>
                    <td className="border p-3 text-center">{data.plazo}</td>
                    <td className="border p-3 text-center">
                      {moment(data.fechaContratoVigente).format("DD-MMM-YYYY")}
                    </td>
                    <td className="border p-3 text-center">
                      {moment(data.fechaFinalizacion).format("DD-MMM-YYYY")}
                    </td>
                    <td className="border p-3 text-center">
                      {`$${data.suertePrincipal.toLocaleString("es-MX")}`}
                    </td>
                    <td className="border p-3 text-center">
                      {`$${data.utilidad.toLocaleString("es-MX")}`}
                    </td>
                    <td className="border p-3 text-center">
                      {`$${totalAbonado.toLocaleString("es-MX")}`}
                    </td>
                  </tr>
                );
              })}
              {/* Fila de totales */}
              <tr className="font-bold">
                <td className="border p-3 text-center" colSpan="4">
                  TOTALES
                </td>
                <td className="border p-3 text-center">
                  {`Total de Utilidad: $${totalUtilidades.toLocaleString(
                    "es-MX"
                  )}`}
                </td>
                <td className="border p-3 text-center">
                  {`Total Final: $${totalFinal.toLocaleString("es-MX")}`}
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p className="font-bold text-xl mb-10">AUN NO SE CUENTA CON PAGOS.</p>
        )}
      </div>
      <button
        onClick={exportToExcel}
        className="bg-green-700 text-white text-[12px] md:text-[13px] font-bold py-2 px-4 rounded mt-4 mb-4"
      >
        Exportar a Excel
      </button>
    </div>
  );
};
