import React, { useState, useContext, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { PartnersContext } from "../../context/PartnersContext";
import { Rings } from "react-loader-spinner";
import { FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import { toast } from "react-toastify";
import { GoLinkExternal } from "react-icons/go";
import { FiEdit } from "react-icons/fi";
import { FaCircleUser } from "react-icons/fa6";

export const Partners = ({
  setSelectedTab,
  setpartnerInfo,
  partnersData,
  partners,
  setPartners,
  setcorridaIndex,
  setCorridas,
}) => {
  const [monto, setMonto] = useState(0);
  const [abonado, setAbonado] = useState(0);
  const [reembolso, setReembolso] = useState(0);
  const [deuda, setDeuda] = useState(0);

  const isDisabledAbonado = true;
  const isDisabledReemboloso = true;
  const isDisabledDeuda = true;
  const isDisableMonto = true;

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
    const montoTotal = partner.utilidad; // Cambia esto con la propiedad correcta del partner que contiene el monto total
    const deuda = montoTotal - abonado;
    return { abonado, deuda };
  };

  useEffect(() => {
    console.log("partners", partners);
    // Actualizar montos de abonado y deuda al cargar o al cambiar los partnersData
    if (partners) {
      const { abonado, deuda } = partners.reduce(
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
      setAbonado(abonado);
      setDeuda(deuda);

      setMonto(partners.reduce((total, pago) => total + pago.utilidad, 0))

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
          <div className="form-container mt-10 flex flex-col items-center w-full  lg:w-[1000px] max-w-[1500px] bg-[#f3f4f6]">
     <div className="form-header bg-black text-white w-full h-10 p-2 rounded-tl-md rounded-tr-md">
            PARTNERS
          </div>

          <div className="flex flex-col gap-10">
            {/* columna arriba */}
            <div className=" flex flex-col md:flex-row gap-5 items-center justify-between bg-white p-4 rounded-lg shadow-xl mt-10">
              <div className="mb-4 flex flex-col">
                <label className=" font-medium">MONTO GLOBAL</label>
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
                <label className=" font-medium">ANTICIPO GLOBAL</label>
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
                <label className=" font-medium">DEUDA GLOBAL</label>
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
            {/* columna abajo */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={handleTab}
                  type="submit"
                  className="bg-black text-white px-2 py-2 rounded-full shadow-lg"
                >
                  <FaPlus />
                </button>
              </div>
              <div className="flex flex-col">
                <label className=" font-medium">ESTATUS</label>
                <select
                  // onChange={(e) => (tipoVentaRef.current = e.target.value)}
                  className="border p-2 rounded-md shadow-sm"
                  //  {...register("transaccion", { required: true })}
                >
                  <option value="ACTIVOS">ACTIVOS</option>
                  <option value="ARCHIVADOS">ARCHIVADOS</option>
                </select>
              </div>
            </div>
          </div>
          {/* TABLA DE FECHAS */}
          <div className="md:w-[800px] lg:w-[900px] xl:w-[950px] overflow-x-auto w-[340px]">
            {partnersData.length > 0 ? (
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
                    <th className="border p-2"></th>
                  </tr>
                </thead>
                <tbody className="">
                  {partnersData.map((data, index) => (
                    <tr key={index} className="mt-2 ">
                      <td className="border p-3 text-center">{data.partner}</td>
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
                        <button
                          onClick={() => {
                            setpartnerInfo(data);
                            setSelectedTab(3);
                          }}
                          className="px-2 py-1 rounded shadow-lg"
                        >
                          <FiEdit />
                        </button>
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
