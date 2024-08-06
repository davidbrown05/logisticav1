import React, { useState, useEffect, useContext } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { FaCirclePlus, FaPlus } from "react-icons/fa6";
import { AdeudosContext } from "../../context/AdeudosContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { Rings } from "react-loader-spinner";
import { UsuarioContext } from "../../context/UsuarioContext";
import moment from "moment";

export const AdeudosLista = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const { userCOntext } = useContext(UsuarioContext);

  const { adeudos, setAdeudos, loadingAdeudos } = useContext(AdeudosContext);
  const [adeudosData, setAdeudosData] = useState(adeudos);
  const [checkAdeudos, setCheckAdeudos] = useState(false);
  const [checkAdeudosDelete, setcheckAdeudosDelete] = useState(false);
  const [loadingUpload, setloadingUpload] = useState(false);
  const [cantidad, setCantidad] = useState("");

  const onSubmit = handleSubmit((data) => {
    setloadingUpload(true);
    setCheckAdeudos(true);
    const fechaVentaInput = new Date();
    const fechaLimiteFormateada = fechaVentaInput.toISOString();
    data.fechaAdeudo = fechaLimiteFormateada;
    data.usuario = userCOntext.email;

    const cleanedValue = data.cantidad.replace(/[$,]/g, ""); // Remove $ and ,
    const numberValue = Number(cleanedValue);
    data.cantidad = numberValue;

   // data.cantidadAdeudo = parseFloat(data.cantidadPago);

    const newArrayObjeto = [...adeudosData.adeudoLista];
    // Paso 2: Actualizar la copia con los datos de nuevaObservacion
    newArrayObjeto.push(data);

    // Actualizar el contexto con los nuevos datos
    setAdeudosData((prevAdeudos) => ({
      ...prevAdeudos,
      // Actualizar los campos necesarios con los datos del formulario
      adeudoLista: newArrayObjeto,
    }));
    console.log("formData", data);
  });

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

  useEffect(() => {
    let newData = adeudosData;

    console.log("adeudosNewData", newData);

    if (checkAdeudos) {
      console.log("handleUpdate", newData);
      handleUpdate(newData);
    }
    if (checkAdeudosDelete) {
      console.log("handleUpdate", newData);
      handleUpdate(newData);
    }

    return () => {
      console.log("fase desmintaje");
    };
  }, [adeudosData]);

  const handleUpdate = async (newData) => {
    console.log("newData en el handle", newData);
    try {
      // Actualizar los datos en el servidor
      const responseUpdate = await axios.put(
        `http://localhost:3000/api/adeudosData/${adeudosData._id}`,
        newData
      );

      const nuevosDatos = await responseUpdate.data;

      console.log("datos actualizados", nuevosDatos);

      // Volver a obtener los datos del servidor después de la actualización
      const response = await axios.get(
        `http://localhost:3000/api/adeudosData/${newData._id}`
      );
      // console.log("responseJuridicoData", response.data);
      // Actualizar el contexto con los nuevos datos
      setAdeudos(nuevosDatos);

      if (checkAdeudos) {
        toast.success("NUEVO ADEUDO AGREGADO");
      } else if (checkAdeudosDelete) {
        toast.success("ADEUDO ELIMINADO");
      }

      setCheckAdeudos(false);
      setcheckAdeudosDelete(false);
      setloadingUpload(false);
    } catch (error) {
      setCheckAdeudos(false);
      setcheckAdeudosDelete(false);
      console.log(error);
      toast.error(error.message);
    }
  };

  //-----------------------------------------------------------------------FUNCIONES PARA BORRAR PAGOS
  const eliminarAdeudo = async (index) => {
    console.log("index", index);
    const result = await Swal.fire({
      title: `ELIMINAR ADEUDO?`,
      text: "No podras recuperar estos datos",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar",
    });

    if (result.isConfirmed) {
      setloadingUpload(true);
      try {
        const newArrayObjeto = [...adeudosData.adeudoLista];
        const objetoAEliminar = newArrayObjeto[index]; // Obtener el objeto a eliminar por su índice

        newArrayObjeto.splice(index, 1);

        // setCheckJuridicoDelete(true);
        // setCheckJuridico(false);
        setcheckAdeudosDelete(true);

        setAdeudosData({
          ...adeudosData,
          adeudoLista: newArrayObjeto,
        });

        // setJuridicoDeleteData({
        //   ...juridicoDeleteData,
        //   documentosLista: newArrayObjeto,
        //   assetid: assetidAEliminar,
        // });
      } catch (error) {
        setloadingUpload(false);
        setcheckAdeudosDelete(false);
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  return (
    <>
      <div className="form-container mt-10 flex flex-col items-center w-full  lg:w-[1000px] max-w-[1500px] bg-[#f3f4f6]">
        <div className="form-header bg-black text-white w-full  h-10 p-2 rounded-tl-md rounded-tr-md">
          ADEUDOS
        </div>
        <form
          onSubmit={onSubmit}
          className="  flex flex-col gap-5 mt-5 mb-5 font-semibold xl:items-end"
        >
          <div className="flex items-center ">
            {!loadingUpload && (
              <button
                type="submit"
                className="bg-black text-white px-2 py-2 rounded-full shadow-lg"
              >
                <FaPlus />
              </button>
            )}

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
          {/* COLUMNA DE ARRIBA */}
          <div className="flex flex-col md:flex-row xl:flex-row items-center justify-between gap-10">
            <div className="flex flex-col">
              <label>CONCEPTO</label>
              <input
                type="text"
                className="border p-2 rounded-md shadow-sm"
                {...register("concepto", { required: true })}
              />
            </div>

            <div>
              <div className="flex flex-col">
                <label>CUENTA</label>
                <input
                  type="text"
                  className="border p-2 rounded-md shadow-sm"
                  {...register("cuenta", { required: true })}
                />
              </div>
            </div>
            <div>
              <div className="flex flex-col">
                <label>CANTIDAD</label>
                <input
                  type="text"
                  className="border p-2 rounded-md shadow-sm"
                  {...register("cantidad", { required: true })}
                  value={cantidad}
                  onChange={(e) => {
                    handlePrecioChange(e);
                  }}
                />
              </div>
            </div>
          </div>
          {/* COLUMNA DE ABAJO */}
          <div className="w-full">
            <div>
              <div className="flex flex-col w-full ">
                <label>OBSERVACIONES</label>
                <textarea
                  type="text"
                  className="border p-2 rounded-md shadow-sm"
                  {...register("observacion", { required: true })}
                />
              </div>
            </div>
          </div>
        </form>
        {/* TABLA */}
        <div className="md:w-[800px] lg:w-[900px] xl:w-[950px] overflow-x-auto w-[330px]">
          {adeudosData.adeudoLista && adeudosData.adeudoLista.length > 0 ? (
            <table className="w-full mt-4 bg-white rounded-md shadow-md mb-4">
              <thead>
                <tr>
                  <th className="border p-2">USUARIO</th>
                  <th className="border p-2">FECHA</th>
                  <th className="border p-2">CONCEPTO</th>
                  <th className="border p-2">CANTIDAD</th>
                  <th className="border p-2">OBSERVACIÓN</th>

                  <th className="border p-2"></th>
                </tr>
              </thead>
              <tbody className="">
                {adeudosData.adeudoLista.map((dato, index) => (
                  <tr key={index} className="mt-2">
                    <td className="border p-3 text-center">{dato.usuario}</td>
                    <td className="border p-3 text-center">
                      {moment(dato.fecha).format("DD-MMM-YYYY")}
                    </td>
                    <td className="border p-3 text-center">{dato.concepto}</td>
                    <td className="border p-3 text-center">
                      ${dato.cantidad.toLocaleString()}
                    </td>
                    <td className="border p-3 max-w-[200px]">
                      {dato.observacion}
                    </td>

                    <td className="border p-3 text-center">
                      <button
                        onClick={() => {
                          eliminarAdeudo(index);
                        }}
                        className="bg-red-500 text-white px-2 py-1 rounded shadow-lg"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
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
