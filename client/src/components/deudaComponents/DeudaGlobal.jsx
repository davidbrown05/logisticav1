import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { FiEdit } from "react-icons/fi";
import { FaTrashAlt } from "react-icons/fa";
// import {
//   selectAllLists,
//   getListsErrors,
//   getListsStatus,
//   fetchLists,
//   forceUpdateLists,
// } from "../../redux/juridico/deudaGlobalSlice";
import { DeudaGlobalContext } from "../../context/DeudaGlobalContext";

export const DeudaGlobal = () => {
  const {
    deudaGlobalContext,
    loadingdeudaGlobalContext,
    setdeudaGlobalContext,
  } = useContext(DeudaGlobalContext);
  const dispatch = useDispatch();
  // const lists = useSelector(selectAllLists);
  // const listsStatus = useSelector(getListsStatus);
  // const listsErors = useSelector(getListsErrors);
  // console.log("listaDeudas", lists);
  console.log("listaDeudasContext", deudaGlobalContext);

  const [loading, setloading] = useState(false);
  const [loadingUpload, setloadingUpload] = useState(false);
  const [montoTotal, setmontoTotal] = useState(0);
  const [anticipoTotal, setanticipoTotal] = useState(0);
  const [deudaGlobal, setdeudaGlobal] = useState(0);
  const [selectedConcepto, setSelectedConcepto] = useState("Todos");

  const isDisabledAbonado = true;
  const isDisabledDeuda = true;
  const isDisableMonto = true;

  // Aplana la estructura de deudaLista
  //const flattenedDeudaList = lists.flatMap((list) => list.deudaLista);
  const flattenedDeudaList = deudaGlobalContext.flatMap((list) => list.deudaLista);

  const calcularPagos = (data) => {
    console.log("calculando pagos", data);
    if (data.length > 0) {
      const sumaMontoTotal = data.reduce(
        (total, pago) => total + pago.cantidad,
        0
      );
      setmontoTotal(sumaMontoTotal);

      // Primero aplanamos la lista principal
      let deudaListaAplanada = data.flatMap((deuda) => deuda.abonado);

      // Paso 2: Aplanar las listas en un solo array
      let abonosAplanados = deudaListaAplanada.flat();

      // Usamos reduce para sumar todos los montos
      let sumaTotalAbonos = abonosAplanados.reduce(
        (total, abono) => total + abono.cantidadAnticipo,
        0
      );

      setanticipoTotal(sumaTotalAbonos);

      const deuda = sumaMontoTotal - sumaTotalAbonos;

      setdeudaGlobal(deuda);
    } else {
      setmontoTotal(0);
      setanticipoTotal(0);
      setdeudaGlobal(0);
    }
  };

  // useEffect(() => {
  //   if (listsStatus === "idle") {
  //     dispatch(fetchLists());
  //   }
  //   if (listsStatus === "succeeded") {
  //     console.log("calcular datos");
  //   }
  // }, [listsStatus, dispatch]);

  useEffect(() => {
    console.log("filteredData", flattenedDeudaList);
    calcularPagos(flattenedDeudaList);
  }, [flattenedDeudaList]);

  const handleConceptoChange = (e) => {
    const concepto = e.target.value;
    setSelectedConcepto(concepto);
    const filteredData =
      concepto === "Todos"
        ? flattenedDeudaList
        : flattenedDeudaList.filter((dato) => dato.concepto === concepto);

    console.log("filteredLista", filteredData);
    calcularPagos(filteredData);
  };

  // Obtener la lista de conceptos únicos para el filtro
  const conceptos = [
    ...new Set(flattenedDeudaList.map((dato) => dato.concepto)),
  ];

  // Visualiza el array aplanado en la consola
  console.log("listaDeudas aplanada", flattenedDeudaList);

  return (
    <>
      <div className="form-container mt-10 flex flex-col items-center w-full  lg:w-[1000px] max-w-[1500px] bg-[#f3f4f6]">
        <div className="form-header bg-black text-white w-full h-10 p-2 rounded-tl-md rounded-tr-md">
          DEUDA GLOBAL
        </div>
        <form className="  flex flex-col gap-5 mt-5 mb-5 font-semibold xl:items-end">
          {/* Columna ARRIBA */}
          <div className=" flex flex-col md:flex-row gap-5 items-center justify-around bg-white p-4 rounded-lg shadow-xl">
            <div className="mb-4 flex flex-col">
              <label className=" font-medium">MONTO GLOBAL</label>
              <input
                value={`$${montoTotal.toLocaleString("es-MX")}`}
                // onChange={(e) => {
                //   handlePrecioChange(e);
                // }}
                type="text"
                className={` p-2 rounded-md font-medium shadow-sm ${
                  isDisableMonto ? " bg-gray-300" : ""
                }`}
                disabled={isDisableMonto}
              />
            </div>
            <div className="mb-4 flex flex-col">
              <label className=" font-medium">ABONO GLOBAL</label>
              <input
                value={`$${anticipoTotal.toLocaleString("es-MX")}`}
                // onChange={(e) => {
                //   handlePrecioChange(e);
                // }}
                type="text"
                className={` p-2 rounded-md text-white shadow-sm ${
                  isDisabledAbonado ? " bg-green-900" : ""
                }`}
                disabled={isDisabledAbonado}
              />
            </div>

            <div className="mb-4 flex flex-col">
              <label className=" font-medium"> DEUDA GLOBAL</label>
              <input
                value={`$${deudaGlobal.toLocaleString("es-MX")}`}
                // onChange={(e) => {
                //   handlePrecioChange(e);
                // }}
                type="text"
                className={` p-2 rounded-md text-white shadow-sm ${
                  isDisabledDeuda ? " bg-yellow-500" : ""
                }`}
                disabled={isDisabledDeuda}
              />
            </div>
          </div>

          {/* COLUMNA DE ARRIBA */}
          <div className="flex flex-col xl:flex-row items-center justify-between gap-10">
            {/* seccion de filtros */}
            <div className="mb-4 flex flex-col">
              <label className="font-medium">Filtrar por Concepto</label>
              <select
                value={selectedConcepto}
                onChange={handleConceptoChange}
                className="p-2 rounded-md shadow-sm"
              >
                <option value="Todos">Todos</option>
                {conceptos.map((concepto, index) => (
                  <option key={index} value={concepto}>
                    {concepto}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* COLUMNA DE ABAJO */}
        </form>
        {/* TABLA */}
        <div className="md:w-[800px] lg:w-[900px] xl:w-[950px] overflow-x-auto w-[340px]">
          {flattenedDeudaList && flattenedDeudaList.length > 0 ? (
            <table className="w-full mt-4 bg-white rounded-md shadow-md mb-4">
              <thead>
                <tr>
                  <th className="border p-2">DIRECCION</th>
                  <th className="border p-2">EMPRESA</th>
                  <th className="border p-2">CONTACTO</th>
                  <th className="border p-2">FECHA</th>
                  <th className="border p-2">CONCEPTO</th>
                  <th className="border p-2">MONTO</th>
                  <th className="border p-2">ANTICIPO</th>
                  <th className="border p-2">SALDO</th>
                  <th className="border p-2"></th>
                </tr>
              </thead>
              <tbody className="">
                {flattenedDeudaList.map((dato, index) => {
                  const totalAbonado = dato.abonado.reduce(
                    (total, abono) => total + abono.cantidadAnticipo,
                    0
                  );
                  const saldo = dato.cantidad - totalAbonado;

                  return (
                    <tr key={index} className="mt-2">
                      <td className="border p-3 text-center">
                        {dato.direccion}
                      </td>
                      <td className="border p-3 text-center">{dato.empresa}</td>
                      <td className="border p-3 text-center">
                        {dato.contacto}
                      </td>
                      <td className="border p-3 text-center">
                        {moment(dato.fecha).format("DD-MMM-YYYY")}
                      </td>
                      <td className="border p-3 text-center">
                        {dato.concepto}
                      </td>
                      <td className="border p-3 text-center">
                        ${dato.cantidad.toLocaleString("es-MX")}
                      </td>
                      <td className="border p-3 text-center">
                        ${totalAbonado.toLocaleString("es-MX")}
                      </td>
                      <td className="border p-3 text-center">
                        ${saldo.toLocaleString("es-MX")}
                      </td>
                      <td className="border p-3 text-center">
                        <button
                          onClick={() => {
                            window.location.href = dato.url;
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
            <p className="font-bold text-xl mb-10">Aún no hay Adeudos.</p>
          )}
        </div>
      </div>
    </>
  );
};
