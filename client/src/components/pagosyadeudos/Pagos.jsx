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

export const Pagos = ({ setCurrentStep, setReciboInfo }) => {
  const [monto, setMonto] = useState(0);
  const [abonado, setAbonado] = useState(0);
  const [reembolso, setReembolso] = useState(0);
  const [deuda, setDeuda] = useState(0);
  const [cantidad, setCantidad] = useState("");
  const { pagos, setPagos, loadingPagos } = useContext(PagosContext);
  const [pagosData, setPagosData] = useState(pagos);
  const [checkPagos, setCheckPagos] = useState(false);
  const [loadingUpload, setloadingUpload] = useState(false);
  const isDisabledAbonado = true;
  const isDisabledReemboloso = true;
  const isDisabledDeuda = true;
  const isDisableMonto = true;
  const { userCOntext } = useContext(UsuarioContext);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  //---------------------------------------------------------------------------------CALCULOS DE PAGOS Y GASTOS
  const calcularPagos = (data) => {
    if (data.pagosLista.length > 0) {
      console.log("calcular gastos", data.pagosLista);
      setMonto(data.montoTotal);

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

      const sumareembolso = data.pagosLista
        .filter(
          (gasto) => gasto.status === true && gasto.tipoPago === "REEMBOLSO"
        )
        .reduce((total, gasto) => total + gasto.cantidadPago, 0);

      console.log("sumaPagos", sumaPagos);
      console.log("reembolsos", sumareembolso);

      setAbonado(sumaPagos);
      setReembolso(sumareembolso);
      const deuda = data.montoTotal - sumaPagos + reembolso;

      setDeuda(deuda);
    } else {
      setMonto(data.montoTotal);
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
      const newArrayObjeto = [...pagosData.pagosLista]; // Copia del arreglo original
      newArrayObjeto[index] = {
        ...newArrayObjeto[index],
        status: !newArrayObjeto[index].status, // Invertir el valor del status
      };

      console.log("newArrayStatus", newArrayObjeto);

      setCheckPagos(true);
      setloadingUpload(true);

      setPagosData({
        ...pagosData,
        pagosLista: newArrayObjeto,
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
      toast.success("PAGOS ACTUALIZADOS");
    } catch (error) {
      setCheckPagos(false);
      console.log(error);
      toast.error(error.message);
    }
  };

  const onSubmit = handleSubmit((data) => {
    console.log("formData", data);
    console.log("userContext", userCOntext);
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

    const newArrayObjeto = [...pagosData.pagosLista];
    // Paso 2: Actualizar la copia con los datos de nuevaObservacion
    newArrayObjeto.push(data);

    // Actualizar el contexto con los nuevos datos
    setPagosData((prevPagos) => ({
      ...prevPagos,
      // Actualizar los campos necesarios con los datos del formulario
      pagosLista: newArrayObjeto,
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
        const newArrayObjeto = [...pagosData.pagosLista];
        const objetoAEliminar = newArrayObjeto[index]; // Obtener el objeto a eliminar por su índice

        newArrayObjeto.splice(index, 1);

        // setCheckJuridicoDelete(true);
        // setCheckJuridico(false);
        setCheckPagos(true);

        setPagosData({
          ...pagosData,
          pagosLista: newArrayObjeto,
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
            PAGOS
          </div>

          <form onSubmit={onSubmit} className=" w-full">
            <div className="flex flex-col gap-8  p-6 w-full">
              {/* Columna ARRIBA */}
              <div className=" flex flex-col md:flex-row gap-5 items-center justify-around bg-white p-4 rounded-lg shadow-xl">
                <div className="mb-4 flex flex-col">
                  <label className=" font-medium">MONTO TOTAL</label>
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
                  <label className=" font-medium">ABONADO</label>
                  <input
                    value={`$${abonado.toLocaleString("es-MX")}`}
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
              {/* seccion del boton agregar */}
              <div className="flex items-center self-end">
                <button
                  type="submit"
                  className="bg-black text-white px-2 py-2 rounded-full shadow-lg"
                >
                  <FaPlus />
                </button>
              </div>

              {/* Columna DEBAJO */}
              <div className=" flex flex-col md:flex-row gap-10 items-center  w-full ">
                <div className="flex flex-col w-full">
                  <label className=" font-medium">TIPO DE PAGO</label>
                  <select
                    // onChange={(e) => (tipoVentaRef.current = e.target.value)}
                    className="border p-2 rounded-md shadow-sm"
                    {...register("tipoPago", { required: true })}
                  >
                    <option value="APARTADO">APARTADO</option>
                    <option value="ENGANCHE">ENGANCHE</option>
                    <option value="LIQUIDACION">LIQUIDACION</option>
                    <option value="ABONO">ABONO</option>

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
                  <label className=" font-medium">CANTIDAD</label>
                  <input
                    {...register("cantidadPago", { required: true })}
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
                <div className="flex  items-center">
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
                  {...register("observacionPago", { required: true })}
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
            {pagosData.pagosLista.length > 0 ? (
              <table className="w-full mt-4 bg-white  rounded-md shadow-md mb-4 text-center justify-center">
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
                  {pagosData.pagosLista.map((document, index) => (
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
                            onClick={() => {
                              setReciboInfo(document);
                              setCurrentStep(1);
                            }}
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
              <p className="font-bold text-xl mb-10">AUN NO HAY PAGOS.</p>
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
