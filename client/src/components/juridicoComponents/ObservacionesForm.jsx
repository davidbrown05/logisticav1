import React, { useState, useContext, useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { JuridicoContext } from "../../context/JuridicoContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { Rings } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { UsuarioContext } from "../../context/UsuarioContext";
import moment from "moment";

const observacionesDatos = [
  {
    observacion:
      "Dentro del proceso se cuenta con un juicio Hipotecraio con monto a recuperar $2774,900.40 pesos con una notificacion al 50 % de acuerdo a constancias enviadas, pendiente de revision exp.NAB",
    fecha: "2024-01-15",
    usuario: "Usuario1",
  },
  {
    observacion:
      "Se revisa expediente, y la nulidad en relación a que en la constancia se asentó el nombre incorrecto, es por ello que el juzgado al solicitar la rebeldía declara nulo, y es necesario volver a a emplazar..NAB",
    fecha: "2024-01-16",
    usuario: "Usuario2",
  },
  {
    observacion:
      "Viable considerar monto a recuperar $2,774,900.40.Y revisar monto de adeudo con infonavit.Sin mas notas en marginales",
    fecha: "2024-01-17",
    usuario: "Usuario3",
  },
];

export const ObservacionesForm = ({ id }) => {
  const { juridico, setJuridico } = useContext(JuridicoContext);
  const [juridicoData, setJuridicoData] = useState(juridico);
  const [loading, setLoading] = useState(false);
  const [checkJuridico, setCheckJuridico] = useState(false);
  const [checkJuridicoDelete, setCheckJuridicoDelete] = useState(false);
  const { userCOntext } = useContext(UsuarioContext);
  const [expandir, setExpandir] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Función para alternar entre expandir y contraer el texto
  const toggleExpandir = () => {
    setExpandir(!expandir);
  };

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    setCheckJuridico(true);
    const fechaVentaInput = new Date();
    const fechaLimiteFormateada = fechaVentaInput.toISOString();
    data.fecha = fechaLimiteFormateada;
    data.usuario = userCOntext.email;
    console.log("data", data);
    const newArrayObjeto = [...juridicoData.observacionesJuridicas];
    // Paso 2: Actualizar la copia con los datos de nuevaObservacion
    newArrayObjeto.push(data);

    setJuridicoData({
      ...juridicoData,
      observacionesJuridicas: newArrayObjeto,
    });
  });

  useEffect(() => {
    let newData = juridicoData;

    console.log("adeudosNewData", newData);

    if (checkJuridico) {
      console.log("handleUpdate", newData);
      handleUpdate(newData);
    }

    if (checkJuridicoDelete) {
      console.log("handleUpdate", newData);
      handleUpdate(newData);
    }
  }, [juridicoData, setValue]);
  const handleUpdate = async (newData) => {
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
      // console.log("responseJuridicoData", response.data);
      // Actualizar el contexto con los nuevos datos
      setJuridico(nuevosDatos);

      if (checkJuridico) {
        toast.success("NUEVA OBSERVACION AGREGADA");
      } else if (checkJuridicoDelete) {
        toast.success("OBSERVACION ELIMINADA");
      }

      setCheckJuridico(false);
      setCheckJuridicoDelete(false);
      setLoading(false);
    } catch (error) {
      setCheckJuridico(false);
      setCheckJuridicoDelete(false);
      setLoading(false);
      console.log(error);
      toast.error(error.message);
    }
  };

  //-----------------------------------------------------------------------FUNCIONES PARA BORRAR PAGOS
  const eliminarObservacion = async (index) => {
    console.log("index", index);
    const result = await Swal.fire({
      title: `ELIMINAR OBSERVACION?`,
      text: "No podras recuperar estos datos",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar",
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const newArrayObjeto = [...juridicoData.observacionesJuridicas];
        const objetoAEliminar = newArrayObjeto[index]; // Obtener el objeto a eliminar por su índice

        newArrayObjeto.splice(index, 1);

        setCheckJuridicoDelete(true);

        setJuridicoData({
          ...juridicoData,
          observacionesJuridicas: newArrayObjeto,
        });
      } catch (error) {
        setLoading(false);
        setCheckJuridicoDelete(false);
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  return (
    <>
      <div className="form-container mt-10 flex flex-col items-center w-full p-1 lg:w-[1000px] max-w-[1500px] bg-[#f3f4f6]">
        {/* Formulario para agregar observaciones */}
        <form
          onSubmit={onSubmit}
          className=" w-full  flex flex-col items-center "
        >
          <div className="form-header bg-black text-white  h-10 p-2 rounded-tl-md rounded-tr-md w-full">
            OBSERVACIONES JURIDICAS
          </div>

          <div className="flex flex-col lg:w-[700px]  mt-10 w-full p-5  ">
            <button
              type="submit"
              className="bg-black text-white px-2 py-2 rounded-full shadow-lg self-end"
            >
              <FaPlus />
            </button>
            <div className="flex flex-col w-full ">
              <label>OBSERVACIONES JURIDICAS</label>
              <textarea
                {...register("observacion", { required: true })}
                className="border p-2 rounded-md shadow-sm w-full  "
              />
            </div>

            {loading && (
              <div className="flex flex-col gap-2 mx-auto items-center w-[80px] h-[80px]">
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
        </form>

        <div className="md:w-[800px] lg:w-[900px] xl:w-[950px] overflow-x-auto w-[340px]">
          {juridicoData.observacionesJuridicas.length > 0 ? (
            <table className="w-full mt-4 bg-white  rounded-md shadow-md mb-4">
              <thead>
                <tr>
                  <th className="border p-2">OBSERVACIÓN</th>
                  <th className="border p-2">FECHA</th>
                  <th className="border p-2">USUARIO</th>
                  <th className="border p-2"></th>
                </tr>
              </thead>
              <tbody className="">
                {juridicoData.observacionesJuridicas.map(
                  (observacion, index) => (
                    <tr key={index} className="mt-2">
                      <td className="border p-3  max-w-[200px]">
                        {expandir ? (
                          <div>
                            {observacion.observacion}
                            <button
                              className=" bg-black text-white p-2 rounded-md text-[8px] "
                              onClick={toggleExpandir}
                            >
                              CONTRAER
                            </button>
                          </div>
                        ) : (
                          <div>
                            {observacion.observacion.slice(0, 100)}{" "}
                            {/* Mostrar solo los primeros 100 caracteres */}
                            {observacion.observacion.length > 100 && (
                              <button
                                className=" bg-black text-white p-2 rounded-md text-[8px] "
                                onClick={toggleExpandir}
                              >
                                VER MAS
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="border p-3 text-center">
                        {" "}
                        {moment(observacion.fecha).format("DD-MMM-YYYY")}
                      </td>
                      <td className="border p-3 text-center">
                        {observacion.usuario}
                      </td>
                      <td className="border p-3 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            eliminarObservacion(index);
                          }}
                          className="bg-red-500 text-white px-2 py-1 rounded shadow-lg"
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          ) : (
            <p className="font-bold text-xl mb-10">Aún no hay observaciones.</p>
          )}
        </div>
      </div>
    </>
  );
};
