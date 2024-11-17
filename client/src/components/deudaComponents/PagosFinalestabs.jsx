import React, { useEffect, useState, useRef, useCallback } from "react";
import { FiEdit } from "react-icons/fi";
import moment from "moment";
import { PagosFinalesModal } from "./PagosFinalesModal";
import Swal from "sweetalert2";
import { PiWarningFill, PiPaperclip } from "react-icons/pi";
import { toast } from "react-toastify";
import axios from "axios";
import { PagosAdicionalesModal } from "./PagosAdicionalesModal";
import { useDropzone } from "react-dropzone";

export const PagosFinalestabs = ({
  setSelectedTab,
  partnerInfo,
  setpartnerInfo,
  partners,
  setPartners,
  setloaderContext,
}) => {
  const [pagoData, setpagoData] = useState({});
  const [pagoIndex, setpagoIndex] = useState(0);
  const [pagosFinales, setpagosFinales] = useState(
    partnerInfo?.pagosFinales || []
  );
  const [checkStatus, setcheckStatus] = useState(false);
  const [documento, setdocumento] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    console.log("acceptFiles", acceptedFiles[0]);
    setdocumento(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({ onDrop });

  console.log("pagosFinales", pagosFinales);

  const [openPagosFInalModal, setopenPagoasFinalModal] = useState(false);
  const [openPagosAdicionalesModal, setopenPagosAdicionalesModal] =
    useState(false);

  // const [totales, setTotales] = useState(calcularTotales());

  // Verifica si todos los pagos tienen status "true"
  const allPagosCompletados = pagosFinales.every(
    (pago) => pago.status === "true"
  );

  const isPaymentOverdue = (paymentDate) => {
    return moment(paymentDate).isBefore(moment(), "day");
  };

  const getStatusColorClass = (status) => {
    return status === "true" ? "bg-green-200" : "bg-yellow-100";
  };

  // Calcular sumatorias totales
  const totalParcialidades = pagosFinales.reduce(
    (sum, pago) => sum + pago.parcialidades,
    0
  );
  const totalAbonos = pagosFinales.reduce((sum, pago) => {
    const totalAbonado = (pago.abonos || []).reduce(
      (total, abono) => total + abono.abonoPago,
      0
    );
    return sum + totalAbonado;
  }, 0);
  const totalRestante = pagosFinales.reduce((sum, pago) => {
    const totalAbonado = (pago.abonos || []).reduce(
      (total, abono) => total + abono.abonoPago,
      0
    );
    return sum + (pago.parcialidades - totalAbonado);
  }, 0);

  const calcularTotales = () => {
    const totalParcialidades = pagosFinales.reduce(
      (sum, pago) => sum + pago.parcialidades,
      0
    );
    const totalAbonos = pagosFinales.reduce((sum, pago) => {
      const totalAbonado = (pago.abonos || []).reduce(
        (total, abono) => total + abono.abonoPago,
        0
      );
      return sum + totalAbonado;
    }, 0);
    const totalRestante = pagosFinales.reduce((sum, pago) => {
      const totalAbonado = (pago.abonos || []).reduce(
        (total, abono) => total + abono.abonoPago,
        0
      );
      return sum + (pago.parcialidades - totalAbonado);
    }, 0);

    return { totalParcialidades, totalAbonos, totalRestante };
  };

  // useEffect(() => {
  //   setTotales(calcularTotales());
  // }, [pagosFinales]);

  useEffect(() => {
    let newDataPartner = partnerInfo;
    if (pagoData && pagoData.status) {
      setpagosFinales(partnerInfo.pagosFinales); // Actualiza selectedOption cuando pagoData esté disponible
    }

    if (checkStatus) {
      handleUpdate(newDataPartner);
    }
  }, [partnerInfo]);

  const handleUpdate = async (newData) => {
    setloaderContext(true);
    console.log("newData en el handle", newData);
    try {
      // Actualizar los datos en el servidor
      const responseUpdate = await axios.put(
        `http://localhost:3000/api/partners/${partnerInfo._id}`,
        newData
      );

      //  const nuevosDatos = await responseUpdate.data;
      const nuevosDatos = responseUpdate.data;
      const updatedPartners = partners.map((partner) =>
        partner._id === nuevosDatos._id ? nuevosDatos : partner
      );

      console.log("datos actualizados", nuevosDatos);

      // Volver a obtener los datos del servidor después de la actualización
      const response = await axios.get(
        `http://localhost:3000/api/partners/${newData._id}`
      );

      // Actualizar el contexto con los nuevos datos

      setPartners(updatedPartners);
      // setPartners([...partners, updatedPartners]);

      if (checkStatus) {
        toast.success("PARTNER ACTUALIZADO");
      }

      // setcheckPartner(false);
      //  setloadingUpload(false);
      setcheckStatus(false);
      setloaderContext(false);
      setSelectedTab(0);
    } catch (error) {
      //  setcheckPartner(false);
      setcheckStatus(false);
      setloaderContext(false);
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleStatusPartner = async (event) => {
    // console.log("_id", id);

    const result = await Swal.fire({
      title: `FINALIZAR PARTNER?`,
      text: "Estos datos no podran revertirse",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Finalizar",
    });

    if (result.isConfirmed) {
      setcheckStatus(true);

      try {
        // Subir documento
        const fileData = await handleFileUpload();
        console.log("fileData", fileData);
        // Verificar si hay un error en la carga del archivo
        if (fileData?.error) {
          console.error(
            "Error en la carga del archivo:",
            fileData.error.message
          );
          toast.error(
            "Error en la carga del archivo: " + fileData.error.message
          );
          return; // Detener el proceso si hay un error en el archivo
        }

        // Actualizar el status de partnerInfo a "finalizado"
        setpartnerInfo({
          ...partnerInfo,
          status: "done", // Cambiamos el status directamente
          assetid: fileData.public_id,
          documento: fileData.secure_url,
        });
      } catch (error) {
        setcheckStatus(false);
        console.log(error);
        toast.error(error.message);
      }
    }
  };
  const handleEliminarTabla = async (event) => {
    // console.log("_id", id);

    const result = await Swal.fire({
      title: `ELIMINAR TABLA DEL PARTNER?`,
      text: "Estos datos no podran revertirse",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar",
    });

    if (result.isConfirmed) {
      setcheckStatus(true);
      setloaderContext(true);

      try {
        // Actualizar el status de partnerInfo a "finalizado"
        setpartnerInfo({
          ...partnerInfo,
          status: "activo", // Cambiamos el status directamente
          pagosFinales: [],
        });
      } catch (error) {
        setcheckStatus(false);
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const handleFileUpload = async (data) => {
    // e.preventDefault();
    const formData = new FormData();
    formData.append("file", documento);
    formData.append("upload_preset", "gpfngq7n");
    formData.append("api_key", "646432361532954");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/ddjajfmtw/auto/upload",
        { method: "POST", body: formData }
      );

      const dataDocumento = await res.json();
      console.log("datosDocumento", dataDocumento);
      return dataDocumento; // Retorna el archivo subido
      // Actualizar el estado de foto en data con la URL de descarga
      data.documento = dataDocumento.secure_url;
      data.assetid = dataDocumento.public_id;
      console.log("formDataFile:", data);

      // setTimeout(async () => {
      //   const response = await axios.post(
      //     "http://localhost:3000/api/partners",
      //     data
      //   );

      //   const responseUpdate = response.data;
      //   console.log("nuevosPartners", responseUpdate);
      //   setPartners([...partners, responseUpdate]);
      //   setloadingPartner(false);
      //   setloaderContext(false);
      //   toast.success("NUEVO PARTNER AGREGADO");
      //   setSelectedTab(1);
      // }, 100);
    } catch (error) {
      // Manejar errores al obtener la URL de descarga
      console.error("Error al obtener la URL de descarga:", error);

      // setloadingPartner(false);
      setloaderContext(false);
      setchecPartners(false);
      console.log(error);
      toast.error(error.message);
    }
  };

  let saldoFinalAnterior = 0;

  return (
    <>
      <div className=" flex flex-col gap-10">
        <div className=" md:w-[800px] lg:w-[1200px] xl:w-[1200px]  w-[345px]  mt-5">
          <h3 className=" font-bold bg-black p-1 rounded-md text-white">
            PROXIMOS PAGOS DE INVERSION DE {partnerInfo.partner}
          </h3>
          <div className="md:w-[800px] lg:w-[1200px] xl:w-[1200px] overflow-x-auto w-[345px]">
            {pagosFinales.length > 0 ? (
              // <table className="w-full mt-4 bg-white rounded-xl shadow-md mb-4 text-center justify-center overflow-x-auto">
              //   <thead className="rounded-xl">
              //     <tr>
              //       <th className="border p-2">FECHA SIGUIENTE PAGO</th>
              //       <th className="border p-2">CANTIDAD</th>
              //       <th className="border p-2">ABONO</th>
              //       <th className="border p-2">RESTANTE</th>
              //       <th className="border p-2"></th>
              //     </tr>
              //   </thead>
              //   <tbody className="rounded-xl">
              //     {pagosFinales.map((data, index) => {
              //       const totalAbonado = (data.abonos || []).reduce(
              //         (total, pago) => total + pago.abonoPago,
              //         0
              //       );
              //       const restante = data.parcialidades - totalAbonado;

              //       return (
              //         <tr key={index} className={`mt-2`}>
              //           <td
              //             className={`border p-3 text-center ${
              //               isPaymentOverdue(data.fechaParaPago)
              //                 ? "bg-red-300"
              //                 : ""
              //             }`}
              //           >
              //             {moment(data.fechaParaPago).format("DD-MMM-YYYY")}
              //           </td>
              //           <td className="border p-3 text-center">
              //             {`$${data.parcialidades.toLocaleString("es-MX")}`}
              //           </td>
              //           <td
              //             className={`border p-3 text-center font-semibold ${getStatusColorClass(
              //               data.status
              //             )}`}
              //           >
              //             {`$${totalAbonado.toLocaleString("es-MX")}`}
              //           </td>
              //           <td className="border p-3 text-center">
              //             {`$${restante.toLocaleString("es-MX")}`}
              //           </td>
              //           <td className="border p-3 text-center">
              //             <button
              //               onClick={() => {
              //                 setpagoIndex(index);
              //                 setpagoData(data);
              //                 setTimeout(() => {
              //                   setopenPagoasFinalModal(true);
              //                 }, 200);
              //               }}
              //               className="px-2 py-1 rounded shadow-lg"
              //             >
              //               <FiEdit />
              //             </button>
              //           </td>
              //         </tr>
              //       );
              //     })}

              //     {/* Fila para totales */}
              //     <tr className="font-bold">
              //       <td className="border p-3 text-center">Total</td>
              //       <td className="border p-3 text-center">{`$${totalParcialidades.toLocaleString(
              //         "es-MX"
              //       )}`}</td>
              //       <td className="border p-3 text-center">{`$${totalAbonos.toLocaleString(
              //         "es-MX"
              //       )}`}</td>
              //       <td className="border p-3 text-center">{`$${totalRestante.toLocaleString(
              //         "es-MX"
              //       )}`}</td>
              //       <td className="border p-3"></td>
              //     </tr>
              //   </tbody>
              // </table>
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2">N°</th>
                    <th className="px-4 py-2">Fecha de Pago</th>
                    <th className="px-4 py-2">Días</th>
                    <th className="px-4 py-2">Saldo Inicial</th>
                    <th className="px-4 py-2">Pago Capital</th>
                    <th className="px-4 py-2">Pago Interés</th>
                    <th className="px-4 py-2">Pago Total</th>
                    <th className="border p-2">ABONO</th>
                    <th className="border p-2">RESTANTE</th>
                    <th className="px-4 py-2">Saldo Final</th>

                    <th className="border p-2">PAGO ANTICIPADO A CAPITAL</th>
                  </tr>
                </thead>
                <tbody>
                  {pagosFinales.map((pago, index) => {
                    const totalAbonado = (pago.abonos || []).reduce(
                      (total, pago) => total + pago.abonoPago,
                      0
                    );
                    const totalPagoAdicional = (
                      pago.pagoAdicionalArray || []
                    ).reduce((total, pago) => total + pago.abonoPago, 0);

                    // const saldoInicialAjustado = index === 0 ? pago.saldoInicial : pago.saldoFinal;
                    // Usa saldoInicial del primer pago o saldoFinal del pago anterior

                    const saldoInicialAjustado =
                      index === 0 ? pago.saldoInicial : saldoFinalAnterior;

                    // Guarda el saldoFinalAjustado para que se use como saldoInicial en la siguiente fila

                    // // Calcular el saldo final ajustado
                    // const saldoFinalAjustado =
                    //   pago.saldoFinal - totalPagoAdicional;

                    // // Calcular el saldo final ajustado

                    const pagoCapitalAjustado =
                      pago.capital + totalPagoAdicional;

                    const pagoCapitalAjustado1 =
                      index !== pagosFinales.length - 1
                        ? pagoCapitalAjustado
                        : saldoFinalAnterior;

                    const saldoFinalAjustado =
                      saldoInicialAjustado - pagoCapitalAjustado;

                    const pagosAdicionalesGlobal = pagosFinales
                      .flatMap((pago) => pago.pagoAdicionalArray) // Extrae todos los arrays `pagoAdicionalArray` de cada objeto `pago`
                      .reduce(
                        (total, pagoAdicional) =>
                          total + (pagoAdicional.abonoPago || 0),
                        0
                      ); // Suma el campo `abonoPago`, considerando 0 si no existe

                    //console.log("pagosAdicionalesGlobal",pagosAdicionalesGlobal)

                    const saldoFinalAjustado1 =
                      index !== pagosFinales.length - 1
                        ? saldoFinalAjustado
                        : saldoFinalAjustado + pagosAdicionalesGlobal;

                    saldoFinalAnterior = saldoFinalAjustado;
                    // console.log("tasaInteres", partnerInfo.porcentajeUtilidad);

                    const tasaInteres = partnerInfo.porcentajeUtilidad;

                    let pagoInteres;
                    if (pago.tipoTabla === "pagomensual") {
                      pagoInteres =
                        (saldoInicialAjustado * (tasaInteres / 100)) / 10;
                    }
                    if (pago.tipoTabla === "pagounico") {
                      //CUANDO ES PAGO UNICO EN VES DE SER ENTRE 10 TIENE QUE SER ENTRE EL NUMERO DE MESES
                      pagoInteres =
                        (saldoInicialAjustado * (tasaInteres / 100)) /
                        pagosFinales.length;
                    }

                    const pagoTotal = pagoCapitalAjustado1 + pagoInteres;

                    const restante = pagoTotal - totalAbonado;

                    // // Determinamos el saldo inicial ajustado del mes siguiente, si existe
                    // const saldoInicialSiguienteMes =
                    //   index < pagosFinales.length - 1
                    //     ? pagosFinales[index + 1].saldoInicial -
                    //       totalPagoAdicional
                    //     : pagosFinales[pagosFinales.length - 1].saldoInicial;

                    //     //CALCULOS DE CUANDO SE CREA LA TABLA
                    //     let saldoInicial = 600000;

                    //   // const pagoCapitalPorParcialidad = monto / parcialidades;
                    //     const pagoCapitalPorParcialidad = 600000 / 5;
                    //     const interes = (pago.saldoInicial * (20 / 100)) / 10;
                    //     let capital = pagoCapitalPorParcialidad;

                    //     // Aplicar pago adicional si existe
                    //     const pagoAdicional = totalPagoAdicional || 0;
                    //     capital += pagoAdicional;

                    //     // Asegurarse de que el capital no exceda el saldo inicial
                    //     capital = Math.min(capital, saldoInicial);

                    //     const pagoTotal = capital + interes;
                    //     const saldoFinal = saldoInicial - capital;

                    //     saldoInicial = saldoFinal;

                    return (
                      <tr
                        key={pago.numero}
                        className={pago.pagoCapital ? "bg-blue-100" : ""}
                      >
                        <td className="border px-4 py-2">{pago.numero}</td>
                        <td
                          className={`border p-3 text-center ${
                            isPaymentOverdue(pago.fechaParaPago) &&
                            data.status === "false"
                              ? "bg-red-300"
                              : ""
                          }`}
                        >
                          {moment(pago.fechaParaPago).format("DD-MMM-YYYY")}
                        </td>
                        <td className="border px-4 py-2">{pago.dias}</td>
                        <td className="border px-4 py-2">
                          {" "}
                          {`$${Number(saldoInicialAjustado).toLocaleString(
                            "es-MX",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}`}
                        </td>
                        <td className="border px-4 py-2">{`$${Number(
                          pagoCapitalAjustado1
                        ).toLocaleString("es-MX", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`}</td>
                        <td className="border px-4 py-2">{`$${Number(
                          pagoInteres
                        ).toLocaleString("es-MX", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`}</td>
                        <td className="border px-4 py-2">{`$${Number(
                          pagoTotal
                        ).toLocaleString("es-MX", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`}</td>
                        <td
                          className={`border p-3 text-center font-semibold flex flex-col gap-2 ${getStatusColorClass(
                            pago.status
                          )}`}
                        >
                          {`$${totalAbonado.toLocaleString("es-MX")}`}

                          <button
                            onClick={() => {
                              setpagoIndex(index);
                              setpagoData(pago);
                              setTimeout(() => {
                                setopenPagoasFinalModal(true);
                              }, 200);
                            }}
                            className="px-2 py-1 text-[10px] rounded shadow-lg bg-black  text-white  flex items-center gap-2"
                          >
                            <FiEdit /> {"abonar"}
                          </button>
                        </td>
                        <td className="border p-3 text-center">{`$${restante.toLocaleString(
                          "es-MX"
                        )}`}</td>
                        <td className="border px-4 py-2">{`$${Number(
                          saldoFinalAjustado1
                        ).toLocaleString("es-MX", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`}</td>

                        <td className="border p-3 text-center font-semibold flex flex-col gap-2">
                          {`$${totalPagoAdicional.toLocaleString("es-MX")}`}
                          <button
                            onClick={() => {
                              setpagoIndex(index);
                              setpagoData(pago);
                              setTimeout(() => {
                                setopenPagosAdicionalesModal(true);
                              }, 200);
                            }}
                            className="px-2 py-1 text-[10px] rounded shadow-lg bg-black  text-white  flex items-center gap-2 justify-center"
                          >
                            <FiEdit /> {"abonar"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p className="font-bold text-xl mb-10">
                AUN NO SE CUENTA CON PAGOS.
              </p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-5 justify-between ">
          <div className=" flex flex-col gap-5 ">
            <button
              onClick={() => {
                handleStatusPartner();
              }}
              className={`bg-black text-white p-3 rounded-lg shadow-xl w-[200px]  ${
                allPagosCompletados ? "" : "opacity-50 cursor-not-allowed"
              }`}
              disabled={!allPagosCompletados}
            >
              FINALIZAR PARTNER
            </button>

            {/* react dropzone */}

            <div className="flex flex-col cursor-pointer">
              <label className="font-semibold flex items-center gap-2">
                <PiPaperclip />
                ADJUNTAR CONTRATO FINALIZACION
              </label>
              <div
                {...getRootProps()}
                className="relative border-dashed border-2 border-gray-300 rounded-md p-6 bg-white h-[100px] hover:bg-slate-200"
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p className="w-[400px]">Suelte los archivos aqui...</p>
                ) : (
                  <p>
                    Arrastra archivos aquí, o haz clic para seleccionar archivos
                  </p>
                )}
              </div>

              <div className="mt-4">
                {acceptedFiles[0] && (
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">
                      <span className=" text-blue-600 font-semibold">
                        {" "}
                        Archivo seleccionado: {acceptedFiles[0].name}
                      </span>
                    </p>
                    <p className="text-sm text-blue-600 font-semibold">
                      Tipo: {acceptedFiles[0].type}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              handleEliminarTabla();
            }}
            className={`bg-black text-white p-3 rounded-lg shadow-xl w-[200px]  `}
          >
            ELIMINAR TABLA
          </button>
        </div>
      </div>

      <PagosFinalesModal
        openPagosFInalModal={openPagosFInalModal}
        setopenPagoasFinalModal={setopenPagoasFinalModal}
        partnerInfo={partnerInfo}
        setpartnerInfo={setpartnerInfo}
        partners={partners}
        setPartners={setPartners}
        pagoData={pagoData}
        pagoIndex={pagoIndex}
        setloaderContext={setloaderContext}
      />
      <PagosAdicionalesModal
        openPagosAdicionalesModal={openPagosAdicionalesModal}
        setopenPagosAdicionalesModal={setopenPagosAdicionalesModal}
        partnerInfo={partnerInfo}
        setpartnerInfo={setpartnerInfo}
        partners={partners}
        setPartners={setPartners}
        pagoData={pagoData}
        pagoIndex={pagoIndex}
        setloaderContext={setloaderContext}
      />
    </>
  );
};
