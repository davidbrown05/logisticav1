import React, { useState, useContext, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { PartnersContext } from "../../context/PartnersContext";
import { Rings } from "react-loader-spinner";
import { FaTrashAlt, FaCalendarAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import { toast } from "react-toastify";
import { GoLinkExternal } from "react-icons/go";
import { FiEdit } from "react-icons/fi";
import { FaCircleUser } from "react-icons/fa6";
import moment from "moment";
import { set } from "react-hook-form";

export const Partners = ({
  setSelectedTab,
  setpartnerInfo,
  partnersData,
  partners,
  setPartners,
  setcorridaIndex,
  setCorridas,
}) => {
  const [reembolsoTotal, setreembolsoTotal] = useState(0);
  const [reembolsoTotalF, setreembolsoTotalF] = useState(0);
  const [monto, setMonto] = useState(0);
  const [montoF, setMontoF] = useState(0);
  const [montoGlobalInversion, setmontoGlobalInversion] = useState(0);
  const [montoGlobalInversionF, setmontoGlobalInversionF] = useState(0);
  const [abonado, setAbonado] = useState(0);
  const [abonadoPagosFinales, setabonadoPagosFinales] = useState(0);
  const [abonadoF, setAbonadoF] = useState(0);
  const [reembolso, setReembolso] = useState(0);
  const [deuda, setDeuda] = useState(0);
  const [deudaF, setDeudaF] = useState(0);

  const [filterStatus, setFilterStatus] = useState("activo"); // Estado para el filtro
  const [filteredPartners, setFilteredPartners] = useState([]); // Datos filtrados
  const [filterName, setFilterName] = useState(""); // Filtro por nombre
  const [filterTitle, setfilterTitle] = useState(""); // Filtro por nombre

  const isDisabledAbonado = true;
  const isDisabledReemboloso = true;
  const isDisabledDeuda = true;
  const isDisableMonto = true;

  // Aplicar los filtros (estado y nombre) sobre los datos
  //  useEffect(() => {
  //   let filtered = partnersData;

  //   // Filtro por nombre
  //   if (filterName) {
  //     filtered = filtered.filter((partner) =>
  //       partner.partner.toLowerCase().includes(filterName.toLowerCase())
  //     );
  //   }

  //   // Filtro por estado solo si no hay filtro de nombre
  //   if (!filterName && filterStatus) {
  //     filtered = filtered.filter((partner) => partner.status === filterStatus);
  //   }

  //   setFilteredPartners(filtered);
  // }, [partnersData, filterStatus, filterName]);

  useEffect(() => {
    let filtered = partnersData;

    // Filtro por nombre
    if (filterName) {
      filtered = filtered.filter((partner) =>
        partner.partner.toLowerCase().includes(filterName.toLowerCase())
      );
    }

    // Filtrar por estado solo si no hay filtro de nombre
    if (!filterName && filterStatus) {
      filtered = filtered.filter((partner) => partner.status === filterStatus);
    }

    if (filterStatus === "activo") {
      // Calcular nextPaymentDate para los partners activos
      const sortedActivePartners = filtered.map((partner) => {
        let nextPaymentDate = null;

        const activeCorrida = partner.corridas.find(
          (corrida) => corrida.status === true
        );

        // Obtener la fecha del próximo pago de los pagos
        if (activeCorrida) {
          const pagos = activeCorrida.pagos; // Obtener el array de pagos

          // Buscar el primer pago con status "false"
          for (const pago of pagos) {
            if (pago.status === "false") {
              nextPaymentDate = moment(pago.fechaParaPago); // Asignar la fecha del primer pago pendiente
              break; // Salir del bucle una vez encontrado
            }
          }
        }

        return {
          ...partner,
          nextPaymentDate, // Agregar la fecha de pago a la información del partner
        };
      });

      sortedActivePartners.forEach((partner) => {
        if (
          partner.nextPaymentDate &&
          partner.nextPaymentDate.isBefore(moment())
        ) {
          toast.error(
            `El pago de "RONDA" al partner ${partner.partner} está pendiente!`,
            {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: false,
              closeOnClick: true,
              draggable: false,
              theme: "colored",
            }
          );
        }
      });

      // Ordenar todos los partners activos por nextPaymentDate
      const finalSortedActivePartners = sortedActivePartners.sort((a, b) => {
        // Si nextPaymentDate es null, colocarlo al final
        const dateA = a.nextPaymentDate
          ? a.nextPaymentDate.valueOf()
          : Infinity;
        const dateB = b.nextPaymentDate
          ? b.nextPaymentDate.valueOf()
          : Infinity;
        return dateA - dateB;
      });

      // Actualizar el estado con los partners activos ordenados
      setFilteredPartners(finalSortedActivePartners);

      const { abonado, deuda } = filtered.reduce(
        (acc, partner) => {
          const { abonado: abonadoParcial, deuda: deudaParcial } =
            filtrarCorridasYCalcularMontos(partner);
          return {
            abonado: acc.abonado + abonadoParcial,
            deuda: acc.deuda + deudaParcial,
          };
        },
        { abonado: 0, deuda: 0 }
      );
      setAbonadoF(abonado);
      setDeudaF(deuda);

      setMontoF(filtered.reduce((total, pago) => total + pago.utilidad, 0));
      setmontoGlobalInversionF(
        filtered.reduce((total, pago) => total + pago.suertePrincipal, 0)
      );
      setreembolsoTotalF(
        filtered.reduce((total, pago) => total + pago.totalReembolzo, 0)
      );

      setfilterTitle("DATOS DE DE DEUDAS GLOBALES ACTIVOS ");

      console.log("abonado", abonado);
    } else if (filterStatus === "pendiente") {
      // Calcular nextPaymentDate para los partners pendientes
      const sortedPendingPartners = filtered.map((partner) => {
        let nextPaymentDate = null;

        // Obtener la fecha del próximo pago de los pagos
        const pagos = partner.pagosFinales; // Obtener el array de pagos

        // Buscar el primer pago con status "false"
        for (const pago of pagos) {
          if (pago.status === "false") {
            nextPaymentDate = moment(pago.fechaParaPago); // Asignar la fecha del primer pago pendiente
            break; // Salir del bucle una vez encontrado
          }
        }

        return {
          ...partner,
          nextPaymentDate, // Agregar la fecha de pago a la información del partner
        };
      });

      sortedPendingPartners.forEach((partner) => {
        if (
          partner.nextPaymentDate &&
          partner.nextPaymentDate.isBefore(moment())
        ) {
          toast.error(
            `El pago de "INVERSION" al partner ${partner.partner} está pendiente!`,
            {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: false,
              closeOnClick: true,
              draggable: false,
              theme: "colored",
            }
          );
        }
      });

      // Ordenar todos los partners pendientes por nextPaymentDate
      const finalSortedPendingPartners = sortedPendingPartners.sort((a, b) => {
        // Si nextPaymentDate es null, colocarlo al final
        const dateA = a.nextPaymentDate
          ? a.nextPaymentDate.valueOf()
          : Infinity;
        const dateB = b.nextPaymentDate
          ? b.nextPaymentDate.valueOf()
          : Infinity;
        return dateA - dateB;
      });

      // Actualizar el estado con los partners pendientes ordenados
      setFilteredPartners(finalSortedPendingPartners);

      const { abonado, deuda } = filtered.reduce(
        (acc, partner) => {
          const { abonado: abonadoParcial, deuda: deudaParcial } =
            filtrarCorridasYCalcularMontos(partner);
          return {
            abonado: acc.abonado + abonadoParcial,
            deuda: acc.deuda + deudaParcial,
          };
        },
        { abonado: 0, deuda: 0 }
      );
      setAbonadoF(abonado);
      setDeudaF(deuda);

      setMontoF(filtered.reduce((total, pago) => total + pago.utilidad, 0));
      setmontoGlobalInversionF(
        filtered.reduce((total, pago) => total + pago.suertePrincipal, 0)
      );
      setreembolsoTotalF(
        filtered.reduce((total, pago) => total + pago.totalReembolzo, 0)
      );

      setfilterTitle("DATOS DE DE DEUDAS GLOBALES EN LIQUIDACION ");
    } else if (filterStatus === "done") {
      // Para los finalizados, también usar los datos filtrados sin ordenar
      setFilteredPartners(filtered);
    }
  }, [partnersData, filterStatus, filterName]);

  // Función para calcular la suma total de abonos
  const calcularSumaAbonos = (pagos) => {
    return pagos.reduce((total, pago) => {
      return (
        total + pago.abonos.reduce((acc, abono) => acc + abono.abonoPago, 0)
      );
    }, 0);
  };

  // Función para filtrar las corridas con status "true" y calcular montos
  const filtrarCorridasYCalcularMontos = (partner) => {
    const corridasConStatusTrue = partner.corridas.filter(
      (corrida) => corrida.status === true
    );
    const abonado = calcularSumaAbonos(
      corridasConStatusTrue.flatMap((corrida) =>
        corrida.pagos.filter((pago) => pago.status !== "cancelado")
      )
    );

    // Calcular el total abonado en los pagos finales
    const abonadoPagosFinales = partner.pagosFinales
      .flatMap((pago) => pago.abonos.map((abono) => abono.abonoPago))
      .reduce((total, abonoPago) => total + abonoPago, 0);
    console.log("abonadoPagosFinales", abonadoPagosFinales);

    const montoTotal = partner.utilidad + partner.suertePrincipal; // Cambia esto con la propiedad correcta del partner que contiene el monto total
    const deuda = montoTotal - abonado - abonadoPagosFinales;
    return { abonado, deuda, abonadoPagosFinales };
  };

  // Calcula la suma de todos los abonoPago de cada abono en pagosFinales de todos los partners
  const calcularSumaAbonosPagosFinales = (partners) => {
    return partners
      .flatMap((partner) =>
        partner.pagosFinales.flatMap((pago) =>
          pago.abonos.map((abono) => abono.abonoPago)
        )
      )
      .reduce((total, abonoPago) => total + abonoPago, 0);
  };

  useEffect(() => {
    console.log("partners", partners);
    // Actualizar montos de abonado y deuda al cargar o al cambiar los partnersData
    if (partners) {
      // Actualiza el estado abonadoPagosFinales
     // setabonadoPagosFinales(calcularSumaAbonosPagosFinales(partners));
      const { abonado, deuda,  } = partners.reduce(
        (acc, partner) => {
          const {
            abonado: abonadoParcial,
            deuda: deudaParcial,
            abonadoPagosFinales,
          } = filtrarCorridasYCalcularMontos(partner);
          return {
            abonado: acc.abonado + abonadoParcial,
            deuda: acc.deuda + deudaParcial,
            abonadoPagosFinales: acc.abonadoPagosFinales + abonadoPagosFinales,
          };
        },
        { abonado: 0, deuda: 0 ,abonadoPagosFinales: 0 }
      );
      setAbonado(abonado);
      setDeuda(deuda);
      console.log("abonadoPagosFinalesP", abonadoPagosFinales);
       setabonadoPagosFinales(abonadoPagosFinales);

      setMonto(partners.reduce((total, pago) => total + pago.utilidad, 0));
      setmontoGlobalInversion(
        partners.reduce((total, pago) => total + pago.suertePrincipal, 0)
      );
      setreembolsoTotal(
        partners.reduce((total, pago) => total + pago.totalReembolzo, 0)
      );

      console.log("abonado", abonado);
    }
  }, [partners]);

  const handleTab = () => {
    setSelectedTab(2);
  };

  const handlePartnerinfo = (data) => {
    // Filtrar las corridas con status true
    setpartnerInfo(data);

    const corridasActivas = data.corridas.filter((corrida) => corrida.status);

    // Encontrar el índice de la primera corrida activa
    const indiceCorridaActiva = data.corridas.findIndex(
      (corrida) => corrida.status
    );

    console.log("corridaActiva", corridasActivas);
    console.log("InidicecorridaActiva", indiceCorridaActiva);

    setcorridaIndex(indiceCorridaActiva);

    setSelectedTab(4);
  };

  //-----------------------------------------------------------------------FUNCIONES PARA BORRAR PAGOS
  const eliminarPartner = async (id) => {
    console.log("_id", id);

    const result = await Swal.fire({
      title: `ELIMINAR PARTNER?`,
      text: "No podras recuperar estos datos",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar",
    });

    if (result.isConfirmed) {
      try {
        const responseDeletePartner = await axios.delete(
          `http://localhost:3000/api/partners/${id}`
        );

        console.log("responseDeletePartner", responseDeletePartner.data);

        // Actualizar el estado de partners excluyendo el partner eliminado
        const updatedPartners = partners.filter(
          (partner) => partner._id !== id
        );
        setPartners(updatedPartners);

        toast.success("PARTNER ELIMINADO");

        // setPagosData({
        //   ...pagosData,
        //   pagosLista: newArrayObjeto,
        // });

        // setJuridicoDeleteData({
        //   ...juridicoDeleteData,
        //   documentosLista: newArrayObjeto,
        //   assetid: assetidAEliminar,
        // });
      } catch (error) {
        // setloadingUpload(false);
        //setCheckPagos(false);
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  //-------------------------------------------permisos
  const deletePartners = true;
  return (
    <>
      {partnersData ? (
        <div className="form-container mt-10 flex flex-col items-center w-full  lg:w-[1200px] max-w-[1500px] bg-[#f3f4f6]">
          <div className="form-header bg-black text-white w-full h-10 p-2 rounded-tl-md rounded-tr-md">
            PARTNERS
          </div>

          <div className="flex flex-col gap-5">
            {/* columna arriba */}

            <div className="flex items-center ">
              <button
                onClick={handleTab}
                type="submit"
                className="bg-black text-white px-2 py-2 rounded-full shadow-lg self-end mt-5"
              >
                <FaPlus />
              </button>
            </div>
            <h3 className=" mx-auto font-bold text-[13px] md:text-[20px] ">
              DATOS DE DE DEUDAS GLOBALES "ACTIVOS Y LIQUIDACION"
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5  gap-5 items-center justify-between bg-white p-4 rounded-lg shadow-xl ">
              <div className="mb-4 flex flex-col">
                <label className=" font-medium text-[13px]">REEMBOLSO GLOBAL</label>
                <input
                  value={`$${reembolsoTotal.toLocaleString("es-MX")}`}
                  // onChange={(e) => {
                  //   handlePrecioChange(e);
                  // }}
                  type="text"
                  className={` p-2 rounded-md font-medium text-white shadow-sm  ${
                    isDisableMonto ? " bg-blue-800 " : ""
                  }`}
                  disabled={isDisableMonto}
                />
              </div>
              <div className="mb-4 flex flex-col">
                <label className=" font-medium text-[13px]">INVERSION GLOBAL</label>
                <input
                  value={`$${montoGlobalInversion.toLocaleString("es-MX")}`}
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
                <label className=" font-medium text-[13px]">
                  ANTICIPO INVERSION GLOBAL
                </label>
                <input
                  value={`$${abonadoPagosFinales.toLocaleString("es-MX")}`}
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
                <label className=" font-medium text-[13px]">UTILIDAD GLOBAL</label>
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
                <label className=" font-medium text-[13px]">ANTICIPO UTILIDAD GLOBAL</label>
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
                <label className=" font-medium text-[13px]">DEUDA GLOBAL</label>
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
            <h3 className=" mx-auto font-bold text-[13px] md:text-[20px] ">
              {filterTitle}
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5  gap-5 items-center justify-between bg-white p-4 rounded-lg shadow-xl ">
              <div className="mb-4 flex flex-col">
                <label className=" font-medium text-[13px]">REEMBOLSO TOTAL</label>
                <input
                  value={`$${reembolsoTotalF.toLocaleString("es-MX")}`}
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
                <label className=" font-medium text-[13px]">INVERSION TOTAL</label>
                <input
                  value={`$${montoGlobalInversionF.toLocaleString("es-MX")}`}
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
                <label className=" font-medium text-[13px]">UTILIDAD TOTAL</label>
                <input
                  value={`$${montoF.toLocaleString("es-MX")}`}
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
                <label className=" font-medium text-[13px]">ANTICIPO UTILIDAD TOTAL</label>
                <input
                  value={`$${abonadoF.toLocaleString("es-MX")}`}
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
                <label className=" font-medium text-[13px]">DEUDA TOTAL</label>
                <input
                  value={`$${deudaF.toLocaleString("es-MX")}`}
                  // onChange={(e) => {
                  //   handlePrecioChange(e);
                  // }}
                  type="text"
                  className={` p-2 rounded-md text-white shadow-sm ${
                    isDisabledReemboloso ? " text-white bg-red-900" : ""
                  }`}
                  disabled={isDisabledDeuda}
                />
              </div>
            </div>
            {/* columna abajo */}
            <div className="flex flex-col md:flex-row gap-5 items-center justify-start">
              {/* Filtro por nombre */}
              <div className="flex flex-col">
                <label className="font-medium">NOMBRE DEL PARTNER</label>
                <input
                  type="text"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  placeholder="Buscar por nombre"
                  className="border p-2 rounded-md shadow-sm"
                />
              </div>
              <div className="flex flex-col">
                <label className=" font-medium">ESTADO DEL PARTNER</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border p-2 rounded-md shadow-sm"
                  //  {...register("transaccion", { required: true })}
                >
                  <option value="activo">ACTIVOS</option>
                  <option value="pendiente"> EN LIQUIDACION</option>
                  <option value="done">FINALIZADOS</option>
                </select>
              </div>
            </div>
          </div>
          {/* TABLA DE FECHAS */}
          <div className="md:w-[800px] lg:w-[1200px] xl:w-[950px] overflow-x-auto w-[340px]">
            {filteredPartners.length > 0 ? (
              <table className="w-full mt-4 bg-white  rounded-md shadow-md mb-4 text-center justify-center">
                <thead>
                  <tr>
                    <th className="border p-2">PARTNER</th>
                    <th className="border p-2">SUESTE PRINCIPAL</th>
                    <th className="border p-2">% UTILIDAD</th>
                    <th className="border p-2">UTILIDAD TOTAL</th>
                    <th className="border p-2">REEMBOLSO</th>
                    <th className="border p-2"></th>
                    <th className="border p-2"></th>
                  </tr>
                </thead>
                <tbody className="">
                  {filteredPartners.map((data, index) => (
                    <tr key={index} className="mt-2 ">
                      <td
                        className={`border p-3 text-center ${
                          data.nextPaymentDate
                            ? data.nextPaymentDate.isBefore(moment()) // Si la fecha ya pasó
                              ? "bg-red-500 text-white"
                              : data.nextPaymentDate.diff(moment(), "days") <= 5 // Si faltan 5 días o menos
                              ? "bg-orange-500 text-white"
                              : data.nextPaymentDate.diff(moment(), "days") <=
                                15 // Si faltan 15 días o menos
                              ? "bg-yellow-500 text-black"
                              : "bg-green-500 text-white" // Si faltan más de 15 días
                            : ""
                        }`}
                      >
                        {data.partner}
                      </td>
                      <td className="border p-3 text-center">
                        {`$${data.suertePrincipal.toLocaleString("es-MX")}`}
                      </td>
                      <td className="border p-3 text-center">
                        {`%${data.porcentajeUtilidad.toLocaleString("es-MX")}`}
                      </td>
                      <td className="border p-3 text-center">
                        {`$${data.utilidad.toLocaleString("es-MX")}`}
                      </td>
                      <td className="border p-3 text-center">
                        {`$${data.totalReembolzo.toLocaleString("es-MX")}`}
                      </td>

                      <td className="border p-3 text-center">
                        <button
                          onClick={() => {
                            handlePartnerinfo(data);
                          }}
                          className="px-2 py-1 rounded shadow-lg"
                        >
                          <FaCircleUser />
                        </button>
                      </td>

                      <td className="border p-3 text-center">
                        {(data.status === "pendiente" ||
                          data.status === "done") && (
                          <button
                            onClick={() => {
                              setpartnerInfo(data);
                              setSelectedTab(8);
                            }}
                            className="px-2 py-1 rounded shadow-lg"
                          >
                            <FaCalendarAlt className="text-blue-800" />
                          </button>
                        )}
                      </td>

                      <td className="border p-3 text-center">
                        {deletePartners ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              eliminarPartner(data._id);
                            }}
                            className="bg-red-500 text-white px-2 py-1 rounded shadow-lg"
                          >
                            <FaTrashAlt />
                          </button>
                        ) : (
                          <button className="bg-gray-300 text-white px-2 py-1 rounded shadow-lg cursor-not-allowed">
                            <FaTrashAlt />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="font-bold text-xl mb-10">
                AUN NO SE CUENTA CON PARTNERS .
              </p>
            )}
          </div>
        </div>
      ) : (
        <Rings
          visible={true}
          height="100%"
          width="100%"
          color="#e43434"
          ariaLabel="rings-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      )}
    </>
  );
};
