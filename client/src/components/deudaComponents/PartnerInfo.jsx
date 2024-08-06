import React, { useEffect, useState } from "react";
import moment from "moment";
import { CorridaCard } from "./CorridaCard";
import { FaTrashAlt } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { ComentariosModal } from "./ComentariosModal";

export const PartnerInfo = ({
  partners,
  setPartners,
  partnerInfo,
  setpartnerInfo,
  setSelectedTab,
  pagos,
  setPagos,
  setpagoData,
  setpagoIndex,
  corridaIndex,
  setcorridaIndex,
}) => {
  console.log("partnerInfo", partnerInfo);
  console.log("corridaIndex", corridaIndex);
  const [corridas, setcorridas] = useState(
    partnerInfo.corridas.filter((corrida) => corrida.status)
  );

  const [comentarios, setcomentarios] = useState([]);
  const [openModal, setopenModal] = useState(false);
  const [monto, setMonto] = useState(0);
  const [abonado, setAbonado] = useState(0);
  const [reembolso, setReembolso] = useState(0);
  const [deuda, setDeuda] = useState(0);
  const isDisabledAbonado = true;
  const isDisabledReemboloso = true;
  const isDisabledDeuda = true;
  const isDisableMonto = true;
  //const [corridaIndex, setcorridaIndex] = useState(0);
  //const [pagos, setPagos] = useState([]);
  const [timepoTrans, settimepoTrans] = useState();
  console.log("corridas", corridas);
  //console.log("corridaIndex", corridaIndex);

  useEffect(() => {
    generalInfo();
    timepoTranscurrido();
  }, [partners]);

  const generalInfo = () => {
    // Filtrar las corridas con status true
    const corridasActivas = partnerInfo.corridas.filter(
      (corrida) => corrida.status
    );

    // Calcular montos
    const abonado = calcularSumaAbonos(
      corridasActivas.flatMap((corrida) => corrida.pagos)
    );
    const montoTotal = partnerInfo.utilidad; // Ajusta esto con la propiedad correcta del partner que contiene el monto total
    const deuda = montoTotal - abonado;

    console.log("corridaActiva", corridasActivas);

    //hacer un nuevo y unico array con todos los arrays de pagos
    let pagosFlatOptimo = corridas.flatMap((corrida) => corrida.pagos);
    console.log("arrayPagosOptimo", pagosFlatOptimo);
    setPagos(pagosFlatOptimo);
    setcomentarios(partnerInfo.corridas[0].comentarios);
    // Actualizar estados
    setAbonado(abonado);
    setDeuda(deuda);
    setMonto(montoTotal);
  };

  const calcularSumaAbonos = (pagos) => {
    return pagos.reduce((total, pago) => {
      return (
        total + pago.abonos.reduce((acc, abono) => acc + abono.abonoPago, 0)
      );
    }, 0);
  };

  const timepoTranscurrido = () => {
    const fechaInicioInversion = moment(partnerInfo.fechaInicioInversion);
    const fechaActual = moment();
    const tiempoTranscurrido = fechaActual.diff(fechaInicioInversion, "days");
    settimepoTrans(tiempoTranscurrido);
  };

  const getStatusColorClass = (status) => {
    switch (status) {
      case "false":
        return "bg-yellow-100";
      case "true":
        return "bg-green-100";
      case "cancelado":
        return "bg-red-100";

      // Agrega más casos según sea necesario para otros estados
      default:
        return "";
    }
  };

  const isPaymentOverdue = (paymentDate) => {
    return moment(paymentDate).isBefore(moment(), "day");
  };

  //----------------------------------PERMISOS

  return (
    <>
      <ComentariosModal
        openModal={openModal}
        setopenModal={setopenModal}
        setPartners={setPartners}
        comentarios={comentarios}
        setcomentarios={setcomentarios}
        partnerInfo={partnerInfo}
        setpartnerInfo={setpartnerInfo}
        partners={partners}
        corridaIndex={corridaIndex}
      />
      <div className="form-container mt-10 flex flex-col items-center bg-[#f3f4f6]">
        <div className="form-header bg-black text-white w-[1000px] h-10 p-2 rounded-tl-md rounded-tr-md flex items-center justify-between">
          <h1> PARTNER: {partnerInfo.partner}</h1>
          <button
            onClick={() => {
              setSelectedTab(1);
            }}
            className=" bg-blue-500 rounded-lg px-4"
          >
            LISTA PARTNERS
          </button>
        </div>
        {/* CONTENEDOR DE ESTADISTICAS */}
        <div className=" flex gap-5 items-center justify-between bg-white p-4 rounded-lg shadow-xl mt-10">
          <div className="mb-4 flex flex-col">
            <label className=" font-medium">MONTO</label>
            <input
              value={`$${monto.toLocaleString("es-MX")}`}
              // onChange={(e) => {
              //   handlePrecioChange(e);
              // }}
              type="text"
              className={` p-2 rounded-md font-medium text-white shadow-sm ${
                isDisableMonto ? " bg-green-800" : ""
              }`}
              disabled={isDisableMonto}
            />
          </div>
          <div className="mb-4 flex flex-col">
            <label className=" font-medium">ANTICIPO</label>
            <input
              value={`$${abonado.toLocaleString("es-MX")}`}
              // onChange={(e) => {
              //   handlePrecioChange(e);
              // }}
              type="text"
              className={` p-2 rounded-md text-white shadow-sm ${
                isDisabledAbonado ? " bg-yellow-500" : ""
              }`}
              disabled={isDisabledAbonado}
            />
          </div>
          <div className="mb-4 flex flex-col">
            <label className=" font-medium">DEUDA</label>
            <input
              value={`$${deuda.toLocaleString("es-MX")}`}
              // onChange={(e) => {
              //   handlePrecioChange(e);
              // }}
              type="text"
              className={` p-2 rounded-md text-white shadow-sm ${
                isDisabledReemboloso ? " bg-red-900" : ""
              }`}
              disabled={isDisabledDeuda}
            />
          </div>
        </div>
        {/* CONTENEDOR DE LA INFORMACION GENERAL */}
        <div className=" font-bold mt-5 ">
          <h3 className="font-bold bg-black p-1 rounded-md text-white">
            DATOS GENERALES
          </h3>
          <div className=" bg-white  rounded-lg shadow-md p-3 mt-3 ">
            <div className=" flex gap-5 ">
              <p className="font-semibold"> FECHA DE INVERSION INICIAL</p>
              <p className=" font-semibold text-gray-500">
                {" "}
                {moment(partnerInfo.fechaInicioInversion).format("DD-MMM-YYYY")}
              </p>
            </div>
            <div className=" flex gap-5 ">
              <p className="font-semibold">TIMEPO TRANSCURRIDO</p>
              <p className=" font-semibold text-gray-500">
                {" "}
                {timepoTrans} Dias
              </p>
            </div>
            <div className=" flex gap-5 ">
              <p className="font-semibold">UTILIDAD A GENERAR</p>
              <p className=" font-semibold text-gray-500">
                {" "}
                ${partnerInfo.utilidad.toLocaleString("es-MX")} MXN
              </p>
            </div>
          </div>
        </div>
        {/* CONTENEDOR PARA SEPARAR COLUMNAS */}
        <div className=" grid xl:grid-cols-2 items-baseline">
          <div className=" p-5 mt-3 w-full">
            {/* CONTENEDOR DE CORRIDAS */}
            <h3 className=" font-bold bg-black p-1 rounded-md text-white">
              CORRIDA ACTUAL
            </h3>
            <div>
              {corridas.map((corrida, index) => (
                <CorridaCard
                  key={index}
                  corrida={corrida}
                  setopenModal={setopenModal}
                  setcorridaIndex={setcorridaIndex}
                  index={index}
                />
              ))}
            </div>
          </div>

          {/* CONTENEDRO DE LA TABLA */}
          <div>
            <div className=" w-full  mt-5">
              <h3 className=" font-bold bg-black p-1 rounded-md text-white">
                PROXIMOS PAGOS
              </h3>
              {pagos.length > 0 ? (
                <table className="w-full mt-4 bg-white rounded-xl shadow-md mb-4 text-center justify-center">
                  <thead className="rounded-xl">
                    <tr>
                      <th className="border p-2">FECHA SIGUINETE PAGO</th>
                      <th className="border p-2">CANTIDAD</th>
                      <th className="border p-2">ABONO</th>

                      <th className="border p-2"></th>
                    </tr>
                  </thead>
                  <tbody className="rounded-xl">
                    {pagos.map((data, index) => (
                      <tr key={index} className={`mt-2 `}>
                        <td
                          className={`border p-3 text-center  ${
                            isPaymentOverdue(data.fechaParaPago)
                              ? "bg-red-300"
                              : ""
                          }`}
                        >
                          {moment(data.fechaParaPago).format("DD-MMM-YYYY")}
                        </td>
                        <td className="border p-3 text-center">
                          {`$${data.parcialidades.toLocaleString("es-MX")}`}
                        </td>
                        <td
                          className={`border p-3 text-center ${getStatusColorClass(
                            data.status
                          )}`}
                        >
                          {/* {`$${data.abono.toLocaleString()}`} */}
                          {`$${data.abonos
                            .reduce((total, pago) => total + pago.abonoPago, 0)
                            .toLocaleString("es-MX")}`}
                        </td>

                        <td className="border p-3 text-center">
                          <button
                            onClick={() => {
                              setpagoIndex(index);
                              setpagoData(data);
                              setSelectedTab(5);
                            }}
                            className="px-2 py-1 rounded shadow-lg"
                          >
                            <FiEdit />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="font-bold text-xl mb-10">
                  AUN NO SE CUENTA CON PAGOS .
                </p>
              )}
            </div>
            {/* TABLA DE COMENTARIOS */}
            <div className=" w-full  mt-5">
              <h3 className=" font-bold bg-black p-1 rounded-md text-white">
                COMENTARIOS
              </h3>
              {comentarios.length > 0 ? (
                <table className="w-full mt-4 bg-white rounded-xl shadow-md mb-4 text-center justify-center">
                  <thead className="rounded-xl">
                    <tr>
                      <th className="border p-2">FECHA COMENTARIO</th>
                      <th className="border p-2">COMENTARIO</th>

                      <th className="border p-2"></th>
                    </tr>
                  </thead>
                  <tbody className="rounded-xl">
                    {comentarios.map((data, index) => (
                      <tr key={index} className={`mt-2 `}>
                        <td className="border p-3 text-center">
                          {moment(data.fechaComentario).format("DD-MMM-YYYY")}
                        </td>
                        <td className="border p-3 text-center">
                          {data.comentarioCorrida}
                        </td>

                        <td className="border p-3 text-center">
                          <button
                            onClick={() => {
                              setpagoData(data);
                              setSelectedTab(5);
                            }}
                            className="px-2 py-1 rounded shadow-lg"
                          >
                            <FaTrashAlt />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="font-bold text-xl mb-10">
                  AUN NO HAY COMENTARIOS.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
