import React, { useState, useEffect, useContext } from "react";
import { FaPlus } from "react-icons/fa6";
import { PagosContext } from "../../context/PagosContext";
import { useForm } from "react-hook-form";
import { Rings } from "react-loader-spinner";
import { UsuarioContext } from "../../context/UsuarioContext";
import moment from "moment";
import { FaTrashAlt } from "react-icons/fa";
import { Switch } from "@nextui-org/react";
import Swal from "sweetalert2";
import axios from "axios";
import { toast } from "react-toastify";
import { FcDocument } from "react-icons/fc";

export const Reembolsos = ({ setCurrentStep }) => {
  const [monto, setMonto] = useState(0);
  const [abonado, setAbonado] = useState(0);
  const [reembolso, setReembolso] = useState(0);
  const [deuda, setDeuda] = useState(0);
  const [cantidad, setCantidad] = useState("");
  const { pagos, setPagos, loadingPagos } = useContext(PagosContext);
  const [pagosData, setPagosData] = useState(pagos);
  const [checkPagos, setCheckPagos] = useState(false);
  const [loadingUpload, setloadingUpload] = useState(false);
  const [porcentaje, setporcentaje] = useState(false);
  const isDisabledAbonado = true;
  const isDisabledReemboloso = true;
  const isDisabledDeuda = true;
  const isDisableMonto = true;
  const isDisablePorcentaje = false;
  const { userCOntext } = useContext(UsuarioContext);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  //---------------------------------------------------------------------------------CALCULOS DE PAGOS Y GASTOS
  const calcularPagos = (data) => {
    console.log("calculandoPagos...");
    if (data.reembolsosLista.length > 0) {
      console.log("calcular gastos", data.reembolsosLista);

      const porcentajeExtra = data.porcentajePenalizacion ?? 0;

      console.log("porcentajeExtra", porcentajeExtra);

      const sumaReembolsos = data.reembolsosLista
        .filter((pago) => pago.status === true)
        .reduce((total, pago) => total + pago.cantidadPago, 0);

      const sumaPagos = data.pagosLista
        .filter(
          (pago) =>
            pago.status === true &&
            (pago.tipoPago === "ABONO" ||
              pago.tipoPago === "APARTADO" ||
              pago.tipoPago === "ENGANCHE" ||
              pago.tipoPago === "LIQUIDACION")
        )
        .reduce((total, pago) => total + pago.cantidadPago, 0);

      // Agrega el porcentajeExtra al total de sumaPagos
      const montoConPorcentaje = sumaPagos * (1 + porcentajeExtra / 100);

      setMonto(montoConPorcentaje);

      setReembolso(sumaReembolsos);

      console.log("sumaReembolsos", sumaReembolsos);

      setAbonado(sumaPagos);

      const deuda = sumaPagos - sumaReembolsos;

      setDeuda(deuda);
    } else {
      const porcentajeExtra = data.porcentajePenalizacion ?? 0;
      const sumaPagos = data.pagosLista
        .filter(
          (pago) =>
            pago.status === true &&
            (pago.tipoPago === "ABONO" ||
              pago.tipoPago === "APARTADO" ||
              pago.tipoPago === "ENGANCHE" ||
              pago.tipoPago === "LIQUIDACION")
        )
        .reduce((total, pago) => total + pago.cantidadPago, 0);

      const montoConPorcentaje = sumaPagos * (1 + porcentajeExtra / 100);
      setMonto(montoConPorcentaje);
    }
  };

  const handlePrecioChange = (event) => {
    // Eliminar caracteres no numéricos
    const inputPrecio = event.target.value.replace(/[^0-9]/g, "");

    // Formatear con comas y agregar el símbolo de peso
    const formattedPrecio = `$${inputPrecio.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ","
    )}`;

    // Actualizar el estado del precio
    setCantidad(formattedPrecio);

    // setValue("cantidadPago", inputPrecio, { shouldValidate: true });
  };

  const handleOnchangeSwitch = async (index) => {
    console.log("index", index);
    const result = await Swal.fire({
      title: `CONFIRMAR CAMBIO DE PAGO?`,
      text: "Puedes cambiar el estado en cualquier momento",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar",
    });

    if (result.isConfirmed) {
      console.log("index", index);
      const newArrayObjeto = [...pagosData.reembolsosLista]; // Copia del arreglo original
      newArrayObjeto[index] = {
        ...newArrayObjeto[index],
        status: !newArrayObjeto[index].status, // Invertir el valor del status
      };

      console.log("newArrayStatus", newArrayObjeto);

      setCheckPagos(true);
      setloadingUpload(true);

      setPagosData({
        ...pagosData,
        reembolsosLista: newArrayObjeto,
      });
    }
  };

  // useEffect para actualizar el formulario después de que juridicoData cambie
  useEffect(() => {
    let newData = pagosData;
    calcularPagos(newData);
    console.log("pagosNewData", newData);

    if (checkPagos) {
      console.log("handleUpdate", newData);
      handleUpdate(newData);
    }

    return () => {
      console.log("fase desmintaje");
    };
  }, [pagosData]);

  const handleUpdate = async (newData) => {
    console.log("newData en el handle", newData);
    try {
      // Actualizar los datos en el servidor
      const responseUpdate = await axios.put(
        `http://localhost:3000/api/pagosData/${pagosData._id}`,
        newData
      );

      const nuevosDatos = await responseUpdate.data;

      console.log("datos actualizados", nuevosDatos);

      // Volver a obtener los datos del servidor después de la actualización
      const response = await axios.get(
        `http://localhost:3000/api/pagosData/${newData._id}`
      );
      // console.log("responseJuridicoData", response.data);
      // Actualizar el contexto con los nuevos datos
      setPagos(nuevosDatos);

      setCheckPagos(false);
      setloadingUpload(false);
      toast.success("REEMBOLSOS ACTUALIZADOS");
    } catch (error) {
      setCheckPagos(false);
      console.log(error);
      toast.error(error.message);
    }
  };

  const onSubmit = handleSubmit((data) => {
    console.log("formData", data);
    console.log("userContext", userCOntext);

    if (porcentaje) {

      console.log("Cambiando %")
      const inputPorcentaje = data.porcentajePenalizacion.replace(
        /[^0-9]/g,
        ""
      );
      data.porcentajePenalizacion = parseFloat(inputPorcentaje);
      console.log("inputPorcentaje", inputPorcentaje);
      setCheckPagos(true);
      // Actualizar el contexto con los nuevos datos
      setPagosData((prevPagos) => ({
        ...prevPagos,
        // Actualizar los campos necesarios con los datos del formulario
        porcentajePenalizacion: data.porcentajePenalizacion,
      }));

      return;
    }

    setloadingUpload(true);
    setCheckPagos(true);
    const fechaVentaInput = new Date();
    const fechaLimiteFormateada = fechaVentaInput.toISOString();
    data.fechaPago = fechaLimiteFormateada;
    data.usuario = userCOntext.email;
    const cleanedValue = data.cantidadPago.replace(/[$,]/g, ""); // Remove $ and ,
    const numberValue = Number(cleanedValue);
    data.cantidadPago = numberValue;
    data.status = false;

    const newArrayObjeto = [...pagosData.reembolsosLista];
    // Paso 2: Actualizar la copia con los datos de nuevaObservacion
    newArrayObjeto.push(data);

    // Actualizar el contexto con los nuevos datos
    setPagosData((prevPagos) => ({
      ...prevPagos,
      // Actualizar los campos necesarios con los datos del formulario
      reembolsosLista: newArrayObjeto,
    }));
  });

  //-----------------------------------------------------------------------FUNCIONES PARA BORRAR PAGOS
  const eliminarPago = async (index) => {
    console.log("index", index);
    const result = await Swal.fire({
      title: `ELIMINAR PAGO?`,
      text: "No podras recuperar estos datos",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar",
    });

    if (result.isConfirmed) {
      try {
        const newArrayObjeto = [...pagosData.reembolsosLista];
        const objetoAEliminar = newArrayObjeto[index]; // Obtener el objeto a eliminar por su índice

        newArrayObjeto.splice(index, 1);

        // setCheckJuridicoDelete(true);
        // setCheckJuridico(false);
        setCheckPagos(true);

        setPagosData({
          ...pagosData,
          reembolsosLista: newArrayObjeto,
        });

        // setJuridicoDeleteData({
        //   ...juridicoDeleteData,
        //   documentosLista: newArrayObjeto,
        //   assetid: assetidAEliminar,
        // });
      } catch (error) {
        setloadingUpload(false);
        setCheckPagos(false);
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  //----------------------------------------------PERMISOS
  const canDeletePagos = true;

  return (
    <>
      {pagosData ? (
        <div className="form-container mt-10 flex flex-col items-center w-full  lg:w-[1000px] max-w-[1500px] bg-[#f3f4f6]">
          <div className="form-header bg-black text-white w-full h-10 p-2 rounded-tl-md rounded-tr-md">
            REEMBOLSOS
          </div>

          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-8  p-6 w-full">
              <div className="flex gap-5 items-end">
                <div className="flex flex-col">
                  <label className="font-semibold">
                    PORCENTAJE PENALIZACION
                  </label>
                  <input
                    value={`%${pagosData.porcentajePenalizacion ?? 0}`}
                    {...register("porcentajePenalizacion", { required: true })}
                    type="text"
                    className="border p-2 rounded-md shadow-sm"
                    onChange={(e) => {
                      const newValue = e.target.value;
                      const inputPrecio = e.target.value.replace(/[^0-9]/g, "");
                      console.log("inputPrecio", inputPrecio);
                      // Formatear con comas y agregar el símbolo de peso
                      const formattedPrecio = `${inputPrecio.replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        ","
                      )}`;
                      setPagosData((prevDatos) => ({
                        ...prevDatos,
                        porcentajePenalizacion: formattedPrecio,
                      }));
                      // setValue("precioFinal", inputPrecio);
                    }}
                    // {...register("precioFinal", { required: true })}
                  />
                </div>
                <button
                  onClick={() => {
                    setporcentaje(true);
                  }}
                  className=" text-white bg-black p-2 text-[13px] rounded-md"
                >
                  Actualizar %
                </button>
              </div>

              {/* Columna ARRIBA */}
              <div className=" flex flex-col md:flex-row gap-5 items-center justify-around bg-white p-4 rounded-lg shadow-xl">
                <div className="mb-4 flex flex-col">
                  <label className=" font-medium">MONTO PAGADO CLIENTE</label>
                  <input
                    value={`$${monto.toLocaleString("es-MX")}`}
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
                  <label className=" font-medium">REEMBOLSO</label>
                  <input
                    value={`$${reembolso.toLocaleString("es-MX")}`}
                    // onChange={(e) => {
                    //   handlePrecioChange(e);
                    // }}
                    type="text"
                    className={` p-2 rounded-md text-white shadow-sm ${
                      isDisabledAbonado ? " bg-red-900" : ""
                    }`}
                    disabled={isDisabledAbonado}
                  />
                </div>

                <div className="mb-4 flex flex-col">
                  <label className=" font-medium"> DEUDA</label>
                  <input
                    value={`$${deuda.toLocaleString("es-MX")}`}
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
              {/* seccion de botones */}
              <div className="flex items-center  self-end">
                <button
                  type="submit"
                  className="bg-black text-white px-2 py-2 rounded-full shadow-lg"
                >
                  <FaPlus />
                </button>
              </div>

              {/* Columna DEBAJO */}
              <div className=" flex flex-col md:flex-row gap-5 items-center justify-start w-full ">
                <div className="flex flex-col w-full">
                  <label className=" font-medium ">TIPO DE PAGO</label>
                  <select
                    // onChange={(e) => (tipoVentaRef.current = e.target.value)}
                    className="border p-2 rounded-md shadow-sm"
                    {...register("tipoPago", { required: true })}
                  >
                    <option value="REEMBOLSO">REEMBOLSO</option>
                  </select>
                </div>
                <div className="flex flex-col w-full">
                  <label className=" font-medium">TRANSACCION</label>
                  <select
                    // onChange={(e) => (tipoVentaRef.current = e.target.value)}
                    className="border p-2 rounded-md shadow-sm"
                    {...register("transaccion", { required: true })}
                  >
                    <option value="CHEQUE">CHEQUE</option>
                    <option value="EFECTIVO">EFECTIVO</option>
                    <option value="TRANSFERENCIA">TRANSFERENCIA</option>
                  </select>
                </div>
                <div className=" flex flex-col w-full">
                  <label className=" font-medium w-full">CANTIDAD</label>
                  <input
                    {...register("cantidadPago", { required: false })}
                    value={cantidad}
                    onChange={(e) => {
                      handlePrecioChange(e);
                    }}
                    type="text"
                    className={` p-2 rounded-md font-medium shadow-s`}
                  />
                  {errors.cantidadPago && (
                    <p className=" text-red-500">CANTIDAD REQUERIDA</p>
                  )}
                </div>
                <div className="flex  items-center w-full">
                  {loadingUpload && (
                    <div className=" flex flex-col gap-2 mx-auto items-center w-[80px] h-[80px]">
                      {/* <h1 className=" font-semibold"> loading...</h1> */}
                      <Rings
                        visible={true}
                        height="100%"
                        width="100%"
                        color="#e43434"
                        ariaLabel="rings-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                      />
                    </div>
                  )}
                </div>
              </div>
              {/* TEXTBOX AREA */}
              <div className=" flex flex-col">
                <label className=" font-medium">OBSERVACIONES</label>
                <textarea
                  {...register("observacionPago", { required: false })}
                  // value={`$${monto.toLocaleString()}`}
                  // onChange={(e) => {
                  //   handlePrecioChange(e);
                  // }}
                  type="text"
                  className={` p-2 rounded-md font-medium shadow-s`}
                />
                {errors.observacionPago && (
                  <p className=" text-red-500">OBSERVACION REQUERIDA</p>
                )}
              </div>
            </div>
          </form>
          {/* DISEÑO DE TABLA PAR AMOSTRAR INFORMACION */}
          <div className="md:w-[800px] lg:w-[900px] xl:w-[950px] overflow-x-auto w-[340px]">
            {pagosData.reembolsosLista.length > 0 ? (
              <table className="w-full mt-4 bg-white rounded-md shadow-md mb-4 overflow-x-auto">
                <thead>
                  <tr>
                    <th className="border p-2">USUARIO</th>
                    <th className="border p-2">FECHA</th>
                    <th className="border p-2">TIPO PAGO</th>
                    <th className="border p-2">TRANSACCION</th>
                    <th className="border p-2">CANTIDAD</th>
                    <th className="border p-2">OBSERVACION</th>
                    <th className="border p-2">ESTADO</th>
                    <th className="border p-2">RECIBO</th>
                    <th className="border p-2"></th>
                  </tr>
                </thead>
                <tbody className="">
                  {pagosData.reembolsosLista.map((document, index) => (
                    <tr key={index} className="mt-2 ">
                      <td className="border p-3  max-w-[200px]">
                        {document.usuario}
                      </td>
                      <td className="border p-3 text-center">
                        {" "}
                        {moment(document.fechaPago).format("YYYY-MMM-DD ")}
                      </td>
                      <td className="border p-3 text-center">
                        {document.tipoPago}
                      </td>
                      <td className="border p-3 text-center">
                        {document.transaccion}
                      </td>
                      <td className="border p-3 text-center">
                        ${document.cantidadPago.toLocaleString("es-MX")}
                      </td>
                      <td className="border p-3 text-center">
                        {document.observacionPago}
                      </td>
                      <td className="border p-3 text-center">
                        <Switch
                          isSelected={document.status}
                          onChange={(e) => {
                            handleOnchangeSwitch(index);
                          }}
                        ></Switch>
                      </td>
                      <td className="border p-3 text-center">
                        {document.status ? (
                          <button
                            onClick={() => setCurrentStep(1)}
                            className=" text-[30px]  rounded shadow-lg"
                            // href={document.documento}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FcDocument />
                          </button>
                        ) : (
                          <button
                            className=" text-[30px] text-gray-800 rounded shadow-lg "
                            // href={document.documento}
                            target="_blank"
                            rel="noopener noreferrer"
                          ></button>
                        )}
                      </td>
                      <td className="border p-3 text-center">
                        {canDeletePagos ? (
                          <button
                            onClick={(e) => {
                              // e.stopPropagation();
                              eliminarPago(index);
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
              <p className="font-bold text-xl mb-10">AUN NO HAY REEMBOLSOS.</p>
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
