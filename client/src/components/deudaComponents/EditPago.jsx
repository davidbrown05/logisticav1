import React, { useEffect, useState, useCallback } from "react";
import { RiCloseCircleFill } from "react-icons/ri";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { Rings } from "react-loader-spinner";
import moment from "moment";
import Swal from "sweetalert2";
import { FaTrashAlt } from "react-icons/fa";
import { FcDocument } from "react-icons/fc";
import { useDropzone } from "react-dropzone";

export const EditPago = ({
  setSelectedTab,
  pagoData,
  pagoIndex,
  corridaIndex,
  setpartnerInfo,
  partnerInfo,
  setPartners,
  partners,
  setloaderContext,
}) => {
  console.log("pagoData", pagoData);
  console.log("pagoIndex", pagoIndex);
  const [selectedOption, setSelectedOption] = useState(pagoData.status);
  const [cantidad, setCantidad] = useState("");
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [abonos, setAbonos] = useState(pagoData.abonos);
  const [checkPartner, setcheckPartner] = useState(false);
  const [checkStatus, setcheckStatus] = useState(false);
  const [loadingUpload, setloadingUpload] = useState(false);
  const [assetid, setassetid] = useState("");
  const [checkPagosDelete, setcheckPagosDelete] = useState(false);

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

  const handleOptionChange = (event) => {
    //  setSelectedOption(event.target.value);
    handleStatusPago(event.target.value);
  };
  const handlePrecioChange = (event) => {
    // Eliminar caracteres no numéricos
    const inputPrecio = event.target.value.replace(/[^0-9]/g, "");

    // Formatear con comas y agregar el símbolo de peso
    const formattedPrecio = `${inputPrecio.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ","
    )}`;

    // Actualizar el estado del precio
    setCantidad(formattedPrecio);

    setIsButtonEnabled(inputPrecio.length >= 1);
  };

  const onSubmit = handleSubmit((data) => {
    setloaderContext(true);
    const inputPrecio = data.abonoPago.replace(/[^0-9]/g, "");
    const fechaVentaInput = new Date();
    const fechaLimiteFormateada = fechaVentaInput.toISOString();
    data.abonoPago = parseFloat(inputPrecio);
    data.fechaAbonoPago = fechaLimiteFormateada;
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
      // Crear una copia del array de corridas
      const nuevosAbonos = [...abonos];

      // Agregar la nueva corrida al array
      nuevosAbonos.push(data);

      // Actualizar el estado con el nuevo array de corridas
      setAbonos(nuevosAbonos);

      setcheckPartner(true);

      // Actualizar el abono en el estado
      setpartnerInfo({
        ...partnerInfo,
        corridas: partnerInfo.corridas.map((corrida, corridaInd) => {
          if (corridaInd === corridaIndex) {
            return {
              ...corrida,
              pagos: corrida.pagos.map((pago, pagoInd) => {
                if (pagoInd === pagoIndex) {
                  return {
                    ...pago,
                    abonos: nuevosAbonos,
                  };
                }
                return pago;
              }),
            };
          }
          return corrida;
        }),
      });

      // handleSubmitProperty(data);
    } catch (error) {
      // Manejar errores al obtener la URL de descarga
      console.error("Error al obtener la URL de descarga:", error);
      setloadingUpload(false);
      setloaderContext(false);
      setcheckPagos(false);
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const newDataPartner = partnerInfo;
    console.log("newDataParter", newDataPartner);

    if (checkPartner) {
      handleUpdate(newDataPartner);
    }
    if (checkPagosDelete) {
      console.log("logica para borrar documents");

      console.log("assetid", assetid);
      const newDataConAssetId = {
        ...newDataPartner,
        assetidToDelete: assetid,
      };

      handleUpdate(newDataConAssetId);

      console.log("NewDatatoDelete", newDataConAssetId);
    }
  }, [partnerInfo]);

  const handleUpdate = async (newData) => {
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

      if (checkPartner) {
        toast.success("ABONO AGREGADO");
      }
      if (checkPagosDelete) {
        toast.success("ESTADO DE PAGO ACTUALIZADO");
      }

      setcheckPartner(false);
      setloadingUpload(false);
      setcheckStatus(false);
      setloaderContext(false);
      setcheckPagosDelete(false);
    } catch (error) {
      setcheckPartner(false);
      setcheckStatus(false);
      setloaderContext(false);
      setcheckPagosDelete(false);
      console.log(error);
      toast.error(error.message);
    }
  };

  //-----------------------------------------------------------------------CAMBIAR STATUS DE PAGO
  const handleStatusPago = async (event) => {
    // console.log("_id", id);

    const result = await Swal.fire({
      title: `ACTUALIZAR ESTADO DE PAGO?`,
      text: "Estos datos se pueden cambiar",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Actualizar",
    });

    if (result.isConfirmed) {
      setSelectedOption(event);
      setcheckPartner(true);
      setloaderContext(true);

      try {
        // Actualizar el abono en el estado
        setpartnerInfo({
          ...partnerInfo,
          corridas: partnerInfo.corridas.map((corrida, corridaInd) => {
            if (corridaInd === corridaIndex) {
              return {
                ...corrida,
                pagos: corrida.pagos.map((pago, pagoInd) => {
                  if (pagoInd === pagoIndex) {
                    return {
                      ...pago,
                      status: event,
                    };
                  }
                  return pago;
                }),
              };
            }
            return corrida;
          }),
        });
      } catch (error) {
        setcheckStatus(false);
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const handleDeleteAbono = async (indexToDelete, assetid) => {
    const result = await Swal.fire({
      title: `ELIMINAR ESTE PAGO?`,
      text: "No se podra recuperar este dato",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar",
    });

    if (result.isConfirmed) {
      setassetid(assetid);
      setSelectedOption(indexToDelete);

      setloaderContext(true);
      setcheckPagosDelete(true);

      try {
        const nuevosAbonos = abonos.filter(
          (_, index) => index !== indexToDelete
        );
        setAbonos(nuevosAbonos);

        setpartnerInfo({
          ...partnerInfo,
          corridas: partnerInfo.corridas.map((corrida, corridaInd) => {
            if (corridaInd === corridaIndex) {
              return {
                ...corrida,
                pagos: corrida.pagos.map((pago, pagoInd) => {
                  if (pagoInd === pagoIndex) {
                    return {
                      ...pago,
                      abonos: nuevosAbonos,
                    };
                  }
                  return pago;
                }),
              };
            }
            return corrida;
          }),
        });
      } catch (error) {
        setcheckStatus(false);
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="form-container mt-10 flex flex-col items-center bg-[#f3f4f6] w-[300px] md:w-[1000px]">
      <div className="form-header bg-black text-white w-full h-10 p-2 rounded-tl-md rounded-tr-md flex items-center justify-between">
        <h1>ACTUALIZAR PAGO</h1>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setSelectedTab(4);
            }}
            className="bg-red-600 rounded-lg px-4"
          >
            REGRESAR
          </button>
        </div>
      </div>

      <div className="w-full p-5 flex flex-col gap-5">
        <h3 className="font-bold underline">INFORMACION</h3>
        {/* CONTENEDOR DATOS */}
        <div className="flex flex-col gap-2">
          <div>
            <p className="font-medium">FECHA PARA PAGO</p>
            <p>{moment(pagoData.fechaParaPago).format("DD-MMM-YYYY")}</p>
          </div>
          <div>
            <p className="font-medium">CANTIDAD</p>
            <p>${pagoData.parcialidades.toLocaleString("es-MX")}</p>
          </div>
          <div>
            <p className="font-medium">ESTADO DEL PAGO</p>
            <p>ESTADO</p>
          </div>
        </div>

        {/* CONTENEDOR RADIO BUTTONS */}
        <div className="flex flex-col items-start justify-between gap-5">
          <div className="flex gap-3">
            <input
              type="radio"
              value="false"
              checked={selectedOption === "false"}
              onChange={handleOptionChange}
            />
            <label className="font-bold text-yellow-600">NO PAGADO</label>
          </div>
          <div className="flex gap-3">
            <input
              type="radio"
              value="true"
              checked={selectedOption === "true"}
              onChange={handleOptionChange}
            />
            <label className="font-bold text-green-600">PAGADO</label>
          </div>
          <div className="flex gap-3">
            <input
              type="radio"
              value="cancelado"
              checked={selectedOption === "cancelado"}
              onChange={handleOptionChange}
            />
            <label className="font-bold text-red-600">CANCELADO</label>
          </div>
        </div>

        {/* INPUTS */}
        <form onSubmit={onSubmit} className="w-full">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col">
              <label>ABONO DE PAGO</label>
              <input
                {...register("abonoPago", { required: true })}
                value={`$${cantidad}`}
                onChange={(e) => {
                  handlePrecioChange(e);
                }}
                type="text"
                className="border p-2 rounded-md shadow-sm"
              />
            </div>
            <div className="flex flex-col">
              <label>COMENTARIO</label>
              <textarea
                className="border p-2 rounded-md shadow-sm"
                {...register("comentarioPago", { required: true })}
              />
            </div>
            {/* react dropzone */}
            <div className="flex flex-col cursor-pointer">
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
            <button
              type="submit"
              className={`bg-green-700 text-white font-semibold rounded-lg px-4 w-[200px] md:w-[300px] self-center ${
                isButtonEnabled ? "" : "opacity-50  cursor-not-allowed"
              }`}
              disabled={!isButtonEnabled}
            >
              AGREGAR PAGO
            </button>
          </div>
        </form>

        {/* CONTENEDRO DE LA TABLA */}
        <div className="w-full mt-5">
          <h3 className="font-bold">ABONOS</h3>
          {abonos.length > 0 ? (
            <table className="w-full mt-4 bg-white rounded-xl shadow-md mb-4 text-center justify-center">
              <thead className="rounded-xl">
                <tr>
                  <th className="border p-2">FECHA ABONO</th>
                  <th className="border p-2">CANTIDAD</th>
                  <th className="border p-2">COMENTARIO</th>
                  <th className="border p-2">RECIBO</th>
                  <th className="border p-2"></th>
                </tr>
              </thead>
              <tbody className="rounded-xl">
                {abonos.map((data, index) => (
                  <tr key={index} className={`mt-2`}>
                    <td className="border p-3 text-center">
                      {moment(data.fechaAbonoPago).format("DD-MMM-YYYY")}
                    </td>
                    <td className="border p-3 text-center">
                      {`$${data.abonoPago.toLocaleString("es-MX")}`}
                    </td>
                    <td className="border p-3 text-center">
                      {`${data.comentarioPago}`}
                    </td>
                    <td className="border p-3 text-center">
                      {data.documento ? (
                        <a
                          className=" text-[25px] rounded shadow-lg"
                          href={data.documento}
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
                      <button
                        onClick={() => {
                          handleDeleteAbono(index, data.assetid);
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
              AUN NO SE CUENTA CON ABONOS.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
