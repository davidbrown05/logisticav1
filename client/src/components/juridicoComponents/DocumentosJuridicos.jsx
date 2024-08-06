import React, { useState, useCallback, useContext, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { FaTrashAlt } from "react-icons/fa";
import { FcDocument } from "react-icons/fc";
import { FaPlus } from "react-icons/fa6";
import { JuridicoContext } from "../../context/JuridicoContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import moment from "moment";
import { Rings } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { UsuarioContext } from "../../context/UsuarioContext";

export const DocumentosJuridicos = ({ id }) => {
  const { juridico, setJuridico } = useContext(JuridicoContext);
  const [juridicoData, setJuridicoData] = useState(juridico);
  const [loading, setLoading] = useState(false);
  const [checkJuridico, setCheckJuridico] = useState(false);
  const [checkJuridicoDelete, setCheckJuridicoDelete] = useState(false);
  const { userCOntext } = useContext(UsuarioContext);
  const [assetid, setassetid] = useState("");

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

  const [assetToDelete, setAssetToDelete] = useState("");

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
      const newArrayObjeto = [...juridicoData.documentosLista];
      // Paso 2: Actualizar la copia con los datos de nuevaObservacion
      newArrayObjeto.push(data);

      setCheckJuridico(true);

      setJuridicoData({
        ...juridicoData,
        documentosLista: newArrayObjeto,
      });

      // handleSubmitProperty(data);
    } catch (error) {
      // Manejar errores al obtener la URL de descarga
      console.error("Error al obtener la URL de descarga:", error);
      setLoading(false);
      setCheckJuridico(true);
      console.log(error);
      toast.error(error.message);
    }
  };

  // useEffect para actualizar el formulario después de que juridicoData cambie
  useEffect(() => {
    let neData = juridicoData;
    console.log("juridicoDataDeletedActualizado", neData);

    if (checkJuridico) {
      console.log("handleUpdate2", neData);
      handleUpdate2(neData);
    }
    if (checkJuridicoDelete) {
      console.log("handleUpdate2", neData);
      console.log("logica para borrar documents");

      console.log("assetid", assetid);
      const newDataConAssetId = {
        ...neData,
        assetidToDelete: assetid,
      };

      handleUpdate2(newDataConAssetId);
      // handleUpdate2(neData);
    }

    return () => {
      console.log("fase desmintaje");
    };
  }, [juridicoData]);

  const handleUpdate2 = async (newData) => {
    console.log("newData en el handle", newData);

    try {
      // Actualizar los datos en el servidor
      const responseUpdate = await axios.put(
        `http://localhost:3000/api/juridicoData/${juridicoData._id}`,
        newData
      );

      const nuevosDatos = await responseUpdate.data;

      console.log("datos actualizados", nuevosDatos);

      // Volver a obtener los datos del servidor después de la actualización
      const response = await axios.get(
        `http://localhost:3000/api/juridicoData/${newData._id}`
      );

      // Actualizar el contexto con los nuevos datos
      // setJuridico(response.data);
      setJuridico(nuevosDatos);

      setCheckJuridico(false);
      setLoading(false);

      if (checkJuridico) {
        toast.success("DOCUMENTOS ACTUALIZADAS");
      }
      if (checkJuridicoDelete) {
        toast.success("DOCUMENTOS BORRADOS");
      }
    } catch (error) {
      setCheckJuridico(false);
      console.log(error);
      toast.error(error.message);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    const fechaVentaInput = new Date();
    const fechaLimiteFormateada = fechaVentaInput.toISOString();
    data.fecha = fechaLimiteFormateada;
    data.usuario = userCOntext.email;
    data.documento = "";
    console.log("formData", data);

    handleFileUpload(data);
  });

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
      const newArrayObjeto = [...juridicoData.documentosLista];
      const objetoAEliminar = newArrayObjeto[index]; // Obtener el objeto a eliminar por su índice
      //const assetidAEliminar = objetoAEliminar.assetid; // Obtener el assetid del objeto a eliminar

      newArrayObjeto.splice(index, 1);

      setCheckJuridicoDelete(true);
      setCheckJuridico(false);

      setJuridicoData({
        ...juridicoData,
        documentosLista: newArrayObjeto,
      });
    } catch (error) {
      setLoading(false);
      setCheckJuridicoDelete(false);
      console.log(error);
      toast.error(error.message);
    }
  };

  // Mapea los títulos de los permisos a nombres de acciones
  const permissionsMapping = {
    deleteDocuments: "Borrar Documentos Juridicos",
    addDocuments: "Agregar Documentos Jurídicos",
    // Agrega más permisos aquí según sea necesario
  };

  // Verificar si el usuario tiene permisos para eliminar documentos
  const canDeleteDocuments = userCOntext.permisos.some(
    (permit) => permit.permiso === permissionsMapping.deleteDocuments
  );

  return (
    <div className="form-container mt-10 flex flex-col items-center w-full p-1 lg:w-[1000px] max-w-[1500px] bg-[#f3f4f6]">
      <div className="form-header bg-black text-white w-full h-10 p-2 rounded-tl-md rounded-tr-md">
        DOCUMENTOS JURIDICOS
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
              Subir
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
        {juridicoData.documentosLista.length > 0 ? (
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
              {juridicoData.documentosLista.map((document, index) => (
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
