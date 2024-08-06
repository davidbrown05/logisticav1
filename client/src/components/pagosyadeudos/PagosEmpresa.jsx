import React, { useState, useEffect, useContext, useCallback } from "react";
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
import { useDropzone } from "react-dropzone";

export const PagosEmpresa = () => {
  const { pagos, setPagos, loadingPagos } = useContext(PagosContext);
  const [pagosData, setPagosData] = useState(pagos);
  const [cantidad, setCantidad] = useState("");
  const { userCOntext } = useContext(UsuarioContext);
  const [monto, setMonto] = useState(0);
  const [abonado, setAbonado] = useState(0);
  const [reembolso, setReembolso] = useState(0);
  const [deuda, setDeuda] = useState(0);
  const [loadingUpload, setloadingUpload] = useState(false);
  const [checkPagos, setcheckPagos] = useState(false);
  const [checkPagosDelete, setcheckPagosDelete] = useState(false);
  const [assetid, setassetid] = useState("");

  const isDisabledAbonado = true;

  const isDisabledDeuda = true;
  const isDisableMonto = true;
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onDrop = useCallback((acceptedFiles) => {
    console.log("acceptFiles", acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({ onDrop });

  const calcularPagos = (data) => {
    if (data.empresaLista.length > 0) {
      console.log("calcular gastos", data.empresaLista);

      const sumaPagos = data.empresaLista.reduce(
        (total, pago) => total + pago.cantidad,
        0
      );

      setMonto(sumaPagos);
    } else {
      setMonto(0);
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

  const onSubmit = handleSubmit((data) => {
    setloadingUpload(true);
    const fechaVentaInput = new Date();
    const fechaLimiteFormateada = fechaVentaInput.toISOString();

    data.fecha = fechaLimiteFormateada;
    data.usuario = userCOntext.email;
    data.documento = "";
    const cleanedValue = data.cantidad.replace(/[$,]/g, ""); // Remove $ and ,
    const numberValue = Number(cleanedValue);
    data.cantidad = numberValue;
    console.log("formData", data);
    handleFileUpload(data);
  });

  const handleFileUpload = async (data) => {
    // e.preventDefault();
    const formData = new FormData();
    formData.append("file", acceptedFiles[0]);
    formData.append("upload_preset", "gpfngq7n");
    formData.append("api_key", "646432361532954");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/ddjajfmtw/auto/upload",
        { method: "POST", body: formData }
      );

      const dataDocumento = await res.json();
      console.log("datosDocumento", dataDocumento);
      // Actualizar el estado de foto en data con la URL de descarga
      data.documento = dataDocumento.secure_url;
      data.assetid = dataDocumento.public_id;
      console.log("formDataFile:", data);
      const newArrayObjeto = [...pagosData.empresaLista];
      // Paso 2: Actualizar la copia con los datos de nuevaObservacion
      newArrayObjeto.push(data);

      setcheckPagos(true);

      setPagosData({
        ...pagosData,
        empresaLista: newArrayObjeto,
      });

      // handleSubmitProperty(data);
    } catch (error) {
      // Manejar errores al obtener la URL de descarga
      console.error("Error al obtener la URL de descarga:", error);
      setloadingUpload(false);
      setcheckPagos(false);
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    let newData = pagosData;
    console.log("juridicoDataDeletedActualizado", newData);
    calcularPagos(newData);
    if (checkPagos) {
      console.log("handleUpdate2", newData);
      handleUpdate(newData);
    }

    if (checkPagosDelete) {
      console.log("logica para borrar documents");

      console.log("assetid", assetid);
      const newDataConAssetId = {
        ...newData,
        assetidToDelete: assetid,
      };

      handleUpdate(newDataConAssetId);

      console.log("NewDatatoDelete", newDataConAssetId);
    }
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

      if (checkPagos) {
        // obtener la comision correspondiente
        const responseComision = await axios.get(
          `http://localhost:3000/api/comisionesData/${newData.propertyId}`
        );

        const comisionData = responseComision.data[0];
        console.log("comisionData", comisionData);

        // Actualizar el campo estatusVenta del inmueble
        const updatedComision = {
          ...comisionData,
          empresaLista: newData.empresaLista,
        };

        // Actualizar los datos del Inmueble
        const responseUpdateComision = await axios.put(
          `http://localhost:3000/api/comisionesData/${comisionData._id}`,
          updatedComision
        );
      }

      if (checkPagosDelete) {
        // obtener la comision correspondiente
        // obtener la comision correspondiente
        const responseComision = await axios.get(
          `http://localhost:3000/api/comisionesData/${newData.propertyId}`
        );

        const comisionData = responseComision.data[0];
        console.log("comisionData", comisionData);

        // Actualizar el campo estatusVenta del inmueble
        const updatedComision = {
          ...comisionData,
          empresaLista: newData.empresaLista,
        };

        // Actualizar los datos del Inmueble
        const responseUpdateComision = await axios.put(
          `http://localhost:3000/api/comisionesData/${comisionData._id}`,
          updatedComision
        );
      }

      setPagos(nuevosDatos);

      if (checkPagos) {
        toast.success("DOCUMENTOS ACTUALIZADOS");
      }

      if (checkPagosDelete) {
        toast.success("DOCUMENTOS ACTUALIZADOS");
      }

      setcheckPagosDelete(false);
      setcheckPagos(false);
      setloadingUpload(false);
    } catch (error) {
      setcheckPagosDelete(false);
      setcheckPagos(false);
      setloadingUpload(false);
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleDeletePagoEmpresa = async (index, assetid) => {
    console.log("index", index);
    const result = await Swal.fire({
      title: `ELIMINAR ESTE PAGO A EMPRESA?`,
      text: "No podras recuperar esta información",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar",
    });

    if (result.isConfirmed) {
      setassetid(assetid);
      try {
        const newArrayObjeto = [...pagosData.empresaLista];
        const objetoAEliminar = newArrayObjeto[index]; // Obtener el objeto a eliminar por su índice

        newArrayObjeto.splice(index, 1);

        // setCheckJuridicoDelete(true);
        // setCheckJuridico(false);
        setcheckPagosDelete(true);
        // setSwitchCOmision(true);

        setPagosData({
          ...pagosData,
          empresaLista: newArrayObjeto,
        });

        // setJuridicoDeleteData({
        //   ...juridicoDeleteData,
        //   documentosLista: newArrayObjeto,
        //   assetid: assetidAEliminar,
        // });
      } catch (error) {
        setloadingUpload(false);
        setcheckPagosDelete(false);
        // setSwitchCOmision(false);
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

          <form onSubmit={onSubmit}>
           
          <div className="flex flex-col gap-8  p-6 w-full">
              {/* Columna ARRIBA */}
              <div className=" flex gap-5 items-center justify-around bg-white p-4 rounded-lg shadow-xl">
                <div className="mb-4 flex flex-col">
                  <label className=" font-medium">MONTO TOTAL EMPRESA</label>
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
                {/* <div className="mb-4 flex flex-col">
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
                </div> */}
              </div>
              {/* seccion de boton */}
              <div className="flex items-center self-end">
                <button
                  type="submit"
                  className="bg-black text-white px-2 py-2 rounded-full shadow-lg"
                >
                  <FaPlus />
                </button>
              </div>

              {/* Columna DEBAJO */}
              <div className=" flex flex-col md:flex-row gap-5 items-center justify-start w-full ">
                <div className=" flex flex-col w-full">
                  <label className=" font-medium">CANTIDAD</label>
                  <input
                    {...register("cantidad", { required: true })}
                    value={cantidad}
                    onChange={(e) => {
                      handlePrecioChange(e);
                    }}
                    type="text"
                    className={` p-2 rounded-md font-medium shadow-s`}
                  />
                  {errors.cantidad && (
                    <p className=" text-red-500">CANTIDAD REQUERIDA</p>
                  )}
                </div>
                <div className=" flex flex-col w-full">
                  <label className=" font-medium">CONCEPTO</label>
                  <input
                    {...register("concepto", { required: true })}
                    type="text"
                    className={` p-2 rounded-md font-medium shadow-s`}
                  />
                  {errors.concepto && (
                    <p className=" text-red-500">CONCEPTO REQUERIDA</p>
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
               {/* react dropzone */}
               <div className="flex flex-col">
                  <div
                    {...getRootProps()}
                    className="relative border-dashed border-2 border-gray-300 rounded-md p-6 bg-white h-[100px] hover:bg-slate-200"
                  >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                      <p className="w-[400px]">Suelte los archivos aqui...</p>
                    ) : (
                      <p>
                        Arrastra archivos aquí, o haz clic para seleccionar
                        archivos
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
            {pagosData.empresaLista.length > 0 ? (
              <table className="w-full mt-4 bg-white rounded-md shadow-md mb-4 overflow-x-auto">
                <thead>
                  <tr>
                    <th className="border p-2">USUARIO</th>
                    <th className="border p-2">FECHA</th>

                    <th className="border p-2">CANTIDAD</th>
                    <th className="border p-2">CONCEPTO</th>
                    <th className="border p-2">OBSERVACION</th>

                    <th className="border p-2">RECIBO</th>
                    <th className="border p-2"></th>
                  </tr>
                </thead>
                <tbody className="">
                  {pagosData.empresaLista.map((document, index) => (
                    <tr key={index} className="mt-2 ">
                      <td className="border p-3  max-w-[200px]">
                        {document.usuario}
                      </td>
                      <td className="border p-3 text-center">
                        {" "}
                        {moment(document.fecha).format("YYYY-MMM-DD ")}
                      </td>

                      <td className="border p-3 text-center">
                        ${document.cantidad.toLocaleString("es-MX")}
                      </td>
                      <td className="border p-3 text-center">
                        {document.concepto}
                      </td>
                      <td className="border p-3 text-center">
                        {document.observacionPago}
                      </td>

                      <td className="border p-3 text-center">
                        {document.documento ? (
                          <a
                            className=" text-[25px] rounded shadow-lg"
                            href={document.documento}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <button>
                              <FcDocument />
                            </button>
                          </a>
                        ) : (
                          <span>N/A</span> // Puedes cambiar esto por cualquier otro contenido que desees mostrar cuando no haya documento
                        )}
                      </td>
                      <td className="border p-3 text-center">
                        {canDeletePagos ? (
                          <button
                            onClick={(e) => {
                              // e.stopPropagation();
                              handleDeletePagoEmpresa(index, document.assetid);
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
                AUN NO HAY PAGOS A EMPRESA.
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
