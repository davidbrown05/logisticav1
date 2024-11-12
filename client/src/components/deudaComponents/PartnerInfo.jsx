import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import { CorridaCard } from "./CorridaCard";
import { FaTrashAlt } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { ComentariosModal } from "./ComentariosModal";
import Swal from "sweetalert2";
import { DatosGeneralesPartner } from "./DatosGeneralesPartner";

// EXPLICACION DEL COMPONENTE:
// Se llama a partners context en el componente TabsDeuda.jsx
// Este componente se basa completamente en informacion de cada corrida activa del partnerInfo
//

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

  const [corridas, setcorridas] = useState(partnerInfo.corridas);
  const [corridaActiva, setcorridaActiva] = useState([]);

  const [comentarios, setcomentarios] = useState([]);
  const [openModal, setopenModal] = useState(false);
  const [monto, setMonto] = useState(0);
  const [abonado, setAbonado] = useState(0);
  const [reembolso, setReembolso] = useState(0);
  const [deuda, setDeuda] = useState(0);
  const [editarRonda, seteditarRonda] = useState(false);
  //const [selectedRondaTab, setSelectedRondaTab] = useState(0);
  const [selectedRondaTab, setSelectedRondaTab] = useState(corridaIndex);
  const [activeTab, setActiveTab] = useState(corridaIndex);
  const firstBtnRef = useRef();
  const isDisabledAbonado = true;
  const isDisabledReemboloso = true;
  const isDisabledDeuda = true;
  const isDisableMonto = true;
  //const [corridaIndex, setcorridaIndex] = useState(0);
  const [pagosCorridaActiva, setpagosCorridaActiva] = useState([]);

  const [timepoTrans, settimepoTrans] = useState();
  console.log("corridas", corridas);
  console.log("selectedRondaTab", selectedRondaTab);

  //Este useeffect es el encargado de cargar la informacion de cada corrida y cambia de acuerdo a pas corridas de partnerinfo
  useEffect(() => {
    generalInfo();
    timepoTranscurrido();
  }, [partnerInfo]);

  //Funcion para actualizar los datos que se mostraran en cada corrida seleccionada

  const generalInfo = () => {
    // Filtrar las corridas con status true
    const corridasActivas = partnerInfo.corridas.filter(
      (corrida) => corrida.status
    );
    console.log("corridaActiva", corridasActivas);
    const corridaIndex = partnerInfo.corridas[selectedRondaTab];
    console.log("corridaIndex", corridaIndex);

    setcorridaActiva(corridasActivas);

    //habilitar o deshabilitar el botoneditar ronda
 // Obtener el valor de la ronda del último elemento del array
 const ultimaRonda = partnerInfo.corridas[partnerInfo.corridas.length - 1]?.ronda;
 const rondaSeleccionada = corridasActivas[0].ronda
 console.log("ultima ronda", ultimaRonda)
 console.log("ronda seleccionada", rondaSeleccionada)
 
    // Verificar si la ronda de la corrida actual coincide con la última ronda

    // Verificar si la ronda de la corrida actual coincide con la última ronda
   const esUltimaRonda = rondaSeleccionada === ultimaRonda && partnerInfo.status === "activo";
   // const esUltimaRonda = partnerInfo.status === "activo" && ultimaRonda

    if (esUltimaRonda) {
      seteditarRonda(true);
    } else {
      seteditarRonda(false)
    }

    // Calcular montos
    const abonado = calcularSumaAbonos(
      corridasActivas.flatMap((corrida) => corrida.pagos)
    );
    const montoTotal = corridasActivas[0].utilidad + corridasActivas[0].suertePrincipal; // Ajusta esto con la propiedad correcta del partner que contiene el monto total
    const deuda = montoTotal - abonado;

    //hacer un nuevo y unico array con todos los arrays de pagos
    let pagosFlatOptimo = corridasActivas.flatMap((corrida) => corrida.pagos);
    console.log("arrayPagosOptimo", pagosFlatOptimo);
    //setPagos(pagosFlatOptimo);
    setpagosCorridaActiva(pagosFlatOptimo);
    setcomentarios(corridasActivas[0].comentarios);
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

  //DISEÑO DE TABS RONDAS
  const data = partnerInfo.corridas;
  // FUCNION QUE HACE CAMBIO DE TABS QUE SON LAS RONDAS Y ACTUALIZA EL STATUS DE RONDA DE FALSE A TRUE Y LUEGO PARTNERINFO PARA ACTUALIZAR DATOS DE CORRIDA SELECCIONADA
  const handleTabClick = (index) => {
    setSelectedRondaTab(index);
    setcorridaIndex(index);
    // Crear una copia del array de corridas
    const updatedCorridas = corridas.map((corrida, i) => {
      // Si el índice coincide, actualiza el status a true, si no, ponlo en false
      return {
        ...corrida,
        status: i === index, // Actualizar el status basado en el índice
      };
    });

    // Actualizar el estado de corridas con la copia modificada
    setcorridas(updatedCorridas);

    // Actualizar partnerInfo para reflejar los cambios
    setpartnerInfo((prevPartnerInfo) => ({
      ...prevPartnerInfo,
      corridas: updatedCorridas,
    }));
  };

  //FUNCION PARA FINALIZAR RONDA O FINALIZAR Y EMPEZAR NUEVA

  const handleRondas = async () => {
    const result = await Swal.fire({
      title: `FINALIZAR RONDA?`,
      text: "",
      icon: "warning",
      showCancelButton: true,
      showDenyButton: true, // Agrega un botón adicional
      confirmButtonColor: "#000000",
      denyButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Finalizar Ronda",
      denyButtonText: "Finalizar y Empezar Nueva Ronda", // Texto del segundo botón
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      setpartnerInfo((prevPartnerInfo) => {
        console.log("Antes de actualizar:", prevPartnerInfo); // Log para verificar antes de actualizar

        const newPartnerInfo = {
          ...prevPartnerInfo,
          status: "pendiente", // Actualizar el status del partner
        };

        console.log("Después de actualizar:", newPartnerInfo); // Log para verificar después de actualizar
        return newPartnerInfo;
      });

      console.log("Ronda finalizada, status actualizado a false");
      setSelectedTab(7);
    } else if (result.isDenied) {
      // Actualizar solo el status de la corrida a false
      setpartnerInfo((prevPartnerInfo) => ({
        ...prevPartnerInfo,
        corridas: prevPartnerInfo.corridas.map((corrida, index) => {
          if (index === corridaIndex) {
            return {
              ...corrida,
              status: false, // Cambiar el status a false
            };
          }
          return corrida;
        }),
      }));
      // Acción para finalizar la ronda y empezar una nueva
      setSelectedTab(6);
      console.log("Ronda finalizada y nueva ronda iniciada");
    }
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
        selectedRondaTab={selectedRondaTab}
      />
      <div className="form-container mt-10 flex flex-col items-center bg-[#f3f4f6] w-[350px] md:w-[1000px] xl:w-[1100px]">
        <div className="form-header bg-black text-white w-full h-[80px] p-2 rounded-tl-md rounded-tr-md flex items-center justify-between">
          <h1 className="text-[10px] lg:text-[20px]">
            {" "}
            PARTNER: {partnerInfo.partner}
          </h1>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                setSelectedTab(1);
              }}
              className=" bg-blue-500 rounded-lg px-4 text-[10px] lg:text-[15px]"
            >
              LISTA PARTNERS
            </button>
            <button
              onClick={() => {
                setSelectedTab(3);
              }}
              disabled={!editarRonda}
              className={`rounded-lg px-4 text-[10px] lg:text-[15px] ${
                editarRonda
                  ? "bg-blue-500"
                  : "bg-gray-200 cursor-not-allowed hidden"
              }`}
            >
              EDITAR RONDA
            </button>
          </div>
        </div>
        {/* CONTENEDOR DE RONDAS */}
        <div className=" flex flex-col items-center mt-5">
          {/* DATOS GENERALES */}

          <DatosGeneralesPartner partnerInfo={partnerInfo} />

          <h1 className=" font-bold md:text-[20px]">
            RONDAS {partnerInfo.corridas.length}
          </h1>
          {/* EMPIEZA EL CODIGO DE DISEÑO PARA TABS */}
          <div
            className={`flex p-3  justify-normal w-[300px] md:w-[800px] items-center gap-x-8 bg-gray-200 shadow-lg   mx-auto xl:mt-10 xl:rounded-lg overflow-x-auto `}
          >
            {partnerInfo.corridas.map((item, index) => (
              <div
                key={index}
                className="flex items-center flex-col justify-start gap-2 lg:gap-5"
              >
                <button
                  ref={index === selectedRondaTab ? firstBtnRef : null}
                  onClick={() => handleTabClick(index)}
                  className={`outline-none w-[100px] border-2 border-red-800 p-2 lg:hover:bg-black lg:hover:text-white rounded-xl text-center shadow-lg ${
                    selectedRondaTab === index ? "bg-black text-white" : ""
                  }`}
                >
                  <span className=" text-[15px]">{`RONDA ${index + 1}`}</span>
                </button>
              </div>
            ))}
          </div>
          {/* TERMINA DISEÑO DE TABS */}
        </div>
        {/* CONTENEDOR DE ESTADISTICAS */}
        <div className=" flex flex-col md:flex-row gap-5 items-center justify-between bg-white p-4 rounded-lg shadow-xl mt-10">
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

        {/* CONTENEDOR PARA SEPARAR COLUMNAS */}
        <div className=" grid xl:grid-cols-2 items-baseline">
          <div className=" p-5 mt-3 w-full">
            {/* CONTENEDOR DE CORRIDAS */}
            <h3 className=" font-bold bg-black p-1 rounded-md text-white">
              CORRIDA ACTUAL
            </h3>
            <div>
              {corridaActiva.map((corrida, index) => (
                <CorridaCard
                  key={index}
                  corrida={corrida}
                  setopenModal={setopenModal}
                  setcorridaIndex={setcorridaIndex}
                  index={index}
                  handleRondas={handleRondas}
                  corridaIndex={corridaIndex}
                  corridas={partnerInfo.corridas}
                  estado={partnerInfo.status}
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
              <div className="md:w-full lg:w-full xl:w-full overflow-x-auto w-[340px] p-2">
                {pagosCorridaActiva.length > 0 ? (
                  <table className="w-full mt-4 bg-white rounded-xl shadow-md mb-4 text-center justify-center">
                    <thead className="rounded-xl">
                      <tr>
                        <th className="border p-2">FECHA SIGUINETE PAGO</th>
                        <th className="border p-2">CANTIDAD</th>
                        <th className="border p-2">ABONO</th>
                        <th className="border p-2">RESTANTE</th>
                        <th className="border p-2"></th>
                      </tr>
                    </thead>
                    <tbody className="rounded-xl">
                      {pagosCorridaActiva.map((data, index) => {
                        // Calcular total abonado
                        const totalAbonado = data.abonos.reduce(
                          (total, pago) => total + pago.abonoPago,
                          0
                        );

                        // Calcular el restante
                        const restante = data.parcialidades - totalAbonado;

                        return (
                          <tr key={index} className={`mt-2`}>
                            <td
                              className={`border p-3 text-center ${
                                isPaymentOverdue(data.fechaParaPago) && data.status === "false"
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
                              {`$${totalAbonado.toLocaleString("es-MX")}`}
                            </td>
                            <td className="border p-3 text-center">
                              {" "}
                              {/* Nuevo campo */}
                              {`$${restante.toLocaleString("es-MX")}`}
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
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p className="font-bold text-xl mb-10">
                    AUN NO SE CUENTA CON PAGOS .
                  </p>
                )}
              </div>
            </div>
            {/* TABLA DE COMENTARIOS */}
            <div className=" w-full  mt-5">
              <h3 className=" font-bold bg-black p-1 rounded-md text-white">
                COMENTARIOS
              </h3>
              <div className="md:w-full lg:w-full xl:w-full overflow-x-auto w-[340px] p-2">
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
      </div>
    </>
  );
};
