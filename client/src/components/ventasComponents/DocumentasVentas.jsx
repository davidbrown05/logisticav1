import React, { useState, useCallback, useContext, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { FaTrashAlt } from "react-icons/fa";
import { FcDocument } from "react-icons/fc";
import { VentasContext } from "../../context/VentasContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import moment from "moment";
import { Rings } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { UsuarioContext } from "../../context/UsuarioContext";

export const DocumentasVentas = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { ventas, setVentas } = useContext(VentasContext);
  const { userCOntext } = useContext(UsuarioContext);
  const [checkVentas, setCheckVentas] = useState(false);
  const [checkVentasDelete, setCheckVentasDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ventasData, setVentasData] = useState(ventas);
  const [assetid, setassetid] = useState("");

  const fecha = new Date();

  const onDrop = useCallback((acceptedFiles) => {
    console.log("acceptFiles", acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({ onDrop });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    data.fecha = fecha;
    data.usuario = userCOntext.email;
    data.documento = "";
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
      console.log("formData:", data);
      const newArrayObjeto = [...ventasData.documentosVenta];
      // Paso 2: Actualizar la copia con los datos de nuevaObservacion
      newArrayObjeto.push(data);

      setCheckVentas(true);

      setVentasData({
        ...ventasData,
        documentosVenta: newArrayObjeto,
      });

      // handleSubmitProperty(data);
    } catch (error) {
      // Manejar errores al obtener la URL de descarga
      console.error("Error al obtener la URL de descarga:", error);
      setLoading(false);
      setCheckVentas(false);
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    let newData = ventasData;
    console.log("juridicoDataDeletedActualizado", newData);

    if (checkVentas) {
      console.log("handleUpdate2", newData);
      handleUpdate(newData);
    }

    if (checkVentasDelete) {
      console.log("logica para borrar documents");

      console.log("assetid", assetid);
      const newDataConAssetId = {
        ...newData,
        assetidToDelete: assetid,
      };

      handleUpdate(newDataConAssetId);

      console.log("NewDatatoDelete", newDataConAssetId);
    }
  }, [ventasData]);

  const handleUpdate = async (newData) => {
    console.log("newData en el handle", newData);
    try {
      // Actualizar los datos en el servidor
      const responseUpdate = await axios.put(
        `http://localhost:3000/api/ventasData/${ventasData._id}`,
        newData
      );

      const nuevosDatos = await responseUpdate.data;

      console.log("datos actualizados", nuevosDatos);

      // Volver a obtener los datos del servidor después de la actualización
      const response = await axios.get(
        `http://localhost:3000/api/ventasData/${newData._id}`
      );
      // console.log("responseJuridicoData", response.data);
      // Actualizar el contexto con los nuevos datos
      setVentas(nuevosDatos);

      if (checkVentas) {
        toast.success("DOCUMENTOS ACTUALIZADOS");
      }

      if (checkVentasDelete) {
        toast.success("DOCUMENTOS ACTUALIZADOS");
      }

      setCheckVentasDelete(false);
      setCheckVentas(false);
      setLoading(false);
    } catch (error) {
      setCheckVentas(false);
      console.log(error);
      toast.error(error.message);
    }
  };

  //----------------------------------------------------------------------- LOGICA PARA BORRAR DOCUMENTOS
  const eliminarObservacion = async (index, assetid) => {
    console.log("index", index);
    const result = await Swal.fire({
      title: `ELIMINAR DOCUMENTO?`,
      text: "No podras recuperar estos datos",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar",
    });

    if (result.isConfirmed) {
      setassetid(assetid);
      await handleDelete(index);
      setLoading(true);
    }
  };

  const handleDelete = async (index) => {
    try {
      const newArrayObjeto = [...ventasData.documentosVenta];
      const objetoAEliminar = newArrayObjeto[index]; // Obtener el objeto a eliminar por su índice
      //  const assetidAEliminar = objetoAEliminar.assetid; // Obtener el assetid del objeto a eliminar

      newArrayObjeto.splice(index, 1);

      //setAssetToDelete(assetidAEliminar);
      setCheckVentas(false);

      setCheckVentasDelete(true);

      setVentasData({
        ...ventasData,
        documentosVenta: newArrayObjeto,
      });
    } catch (error) {
      setLoading(false);
      setCheckVentasDelete(false);
      console.log(error);
      toast.error(error.message);
    }
  };

  //PERMISOS

  const canDeleteDocuments = true;

  return (
    <div className="form-container mt-10 flex flex-col items-center w-full  lg:w-[1000px] max-w-[1500px] bg-[#f3f4f6]">
      <div className="form-header bg-black text-white w-full h-10 p-2 rounded-tl-md rounded-tr-md">
        DOCUMENTOS DE VENTAS
      </div>
      <form onSubmit={onSubmit}>
        <div className="flex flex-col md:flex-row items-start bg-gray-100 p-8 gap-2 ">
          <div className="flex flex-col">
            <label>TITULO DEL DOCUMENTO</label>
            <input
              type="text"
              className="border p-2 rounded-md shadow-sm w-[300px]"
              {...register("tituloDoc", { required: true })}
            />
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
          <div className="flex flex-col items-center">
            <button
              type="submit"
              //onClick={agregarDocumento}
              className=" bg-black text-white p-2 rounded-lg lg:w-[200px] "
            >
              Submit
            </button>
            {loading && (
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
      </form>
      {/* Formulario para eliminar observaciones */}

      <div className="md:w-[800px] lg:w-[900px] xl:w-[950px] overflow-x-auto w-[330px]">
        {ventasData.documentosVenta.length > 0 ? (
          <table className="w-full mt-4 bg-white  rounded-md shadow-md mb-4 text-center justify-center">
            <thead>
              <tr>
                <th className="border p-2">DOCUMENTO</th>
                <th className="border p-2">FECHA</th>
                <th className="border p-2">USUARIO</th>
                <th className="border p-2">ARCHIVO</th>
                <th className="border p-2"></th>
              </tr>
            </thead>
            <tbody className="">
              {ventasData.documentosVenta.map((document, index) => (
                <tr key={index} className="mt-2 ">
                  <td className="border p-3  max-w-[200px]">
                    {document.tituloDoc}
                  </td>
                  <td className="border p-3 text-center">
                    {" "}
                    {moment(document.fecha).format("YYYY-MMM-DD ")}
                  </td>
                  <td className="border p-3 text-center">{document.usuario}</td>
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
                    {canDeleteDocuments ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          eliminarObservacion(index, document.assetid);
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
          <p className="font-bold text-xl mb-10">Aún no hay Documentos.</p>
        )}
      </div>
    </div>
  );
};
