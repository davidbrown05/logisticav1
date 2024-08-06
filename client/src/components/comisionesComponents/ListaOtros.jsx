import React, { useState, useEffect, useContext } from "react";
import { FaPlus } from "react-icons/fa6";

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
import { ComisionesContext } from "../../context/ComisionesContext";

export const ListaOtros = ({
  comisiones,
  setComisiones,
  comisionesData,
  setcomisionesData,
}) => {
  const [precio, setPrecio] = useState("");
  const [checkComision, setcheckComision] = useState(false);
  const [checkComisionDelete, setcheckComisionDelete] = useState(false);
  const [loadingUpload, setloadingUpload] = useState(false);
  const { userCOntext } = useContext(UsuarioContext);
  const [gastos, setGastos] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const handlePrecioChange = (event) => {
    // Eliminar caracteres no numéricos
    const inputPrecio = event.target.value.replace(/[^0-9]/g, "");

    // Formatear con comas y agregar el símbolo de peso
    const formattedPrecio = `$${inputPrecio.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ","
    )}`;

    // Actualizar el estado del precio
    setPrecio(formattedPrecio);
    setValue("precio", inputPrecio);
  };

  const calcularGastosAdicionales = (data) => {
    // Calcula la suma de precios en gastosLista con status igual a true
    const sumaPrecios = data.otrosLista.reduce(
      (total, gasto) => total + gasto.precio,
      0
    );

    console.log("sumaGastos", sumaPrecios);

    setGastos(sumaPrecios);
  };

  const onSubmit = handleSubmit(async (data) => {
    const fechaVentaInput = new Date();
    const fechaLimiteFormateada = fechaVentaInput.toISOString();
    data.fechaPago = fechaLimiteFormateada;
    data.usuario = userCOntext.email;
    data.precio = parseFloat(data.precio);
    console.log("formData", data);

    const newArrayObjeto = [...comisionesData.otrosLista];
    // Paso 2: Actualizar la copia con los datos de nuevaObservacion
    newArrayObjeto.push(data);

    setcheckComision(true);

    // Actualizar el contexto con los nuevos datos
    setcomisionesData((prevPagos) => ({
      ...prevPagos,
      // Actualizar los campos necesarios con los datos del formulario
      otrosLista: newArrayObjeto,
    }));
  });
  // useEffect para actualizar el formulario después de que juridicoData cambie
  useEffect(() => {
    let newData = comisionesData;
    calcularGastosAdicionales(newData);
    console.log("pagosNewData", newData);

    if (checkComision) {
      console.log("handleUpdate", newData);
      handleUpdate(newData);
    }
    if (checkComisionDelete) {
      console.log("handleUpdate", newData);
      handleUpdate(newData);
    }

    return () => {
      console.log("fase desmintaje");
    };
  }, [comisionesData]);

  const handleUpdate = async (newData) => {
    console.log("newData en el handle", newData);
    try {
      // Actualizar los datos en el servidor
      const responseUpdate = await axios.put(
        `http://localhost:3000/api/comisionesData/${comisionesData._id}`,
        newData
      );

      const nuevosDatos = await responseUpdate.data;

      console.log("datos actualizados", nuevosDatos);

      // Volver a obtener los datos del servidor después de la actualización
      const response = await axios.get(
        `http://localhost:3000/api/comisionesData/${newData._id}`
      );
      // console.log("responseJuridicoData", response.data);
      // Actualizar el contexto con los nuevos datos
      setComisiones(nuevosDatos);

      setcheckComision(false);
      setloadingUpload(false);

      if (checkComision) {
        toast.success("GASTOS ADICIONALES ACTUALIZADOS");
      }
      if (checkComisionDelete) {
        toast.success("GASTO ADICIONAL ELIMINADO");
      }
    } catch (error) {
      setcheckComision(false);
      console.log(error);
      toast.error(error.message);
    }
  };

  //-----------------------------------------------------------------------FUNCIONES PARA BORRAR PAGOS
  const eliminarotrosgastos = async (index) => {
    console.log("index", index);
    const result = await Swal.fire({
      title: `ELIMINAR GASTO?`,
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
        const newArrayObjeto = [...comisionesData.otrosLista];
        const objetoAEliminar = newArrayObjeto[index]; // Obtener el objeto a eliminar por su índice

        newArrayObjeto.splice(index, 1);

        setcheckComisionDelete(true);

        setcomisionesData({
          ...comisionesData,
          otrosLista: newArrayObjeto,
        });
      } catch (error) {
        setloadingUpload(false);
        setcheckComisionDelete(false);
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  return (
    <>
      <div className="form-container mt-10 flex flex-col items-center w-screen  lg:w-[1000px] max-w-[1500px] bg-[#f3f4f6]">
      <div className="form-header bg-black text-white w-full h-10 p-2 rounded-tl-md rounded-tr-md flex justify-between">
          <p> LISTA DE GASTOS ADICIONALES</p>
          <p className=" text-white">TOTAL ${gastos.toLocaleString("es-MX")}</p>
        </div>

        <form onSubmit={onSubmit}>
          <div className=" flex flex-col md:flex-row  gap-5  p-6 w-full">
            <div className="flex items-center self-end">
              <button
                type="submit"
                className="bg-black text-white px-2 py-2 rounded-full shadow-lg"
              >
                <FaPlus />
              </button>
            </div>
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
            {/* Columna Izquierda */}

            <div className="flex flex-col md:flex-row items-start justify-center gap-5 mb-4">
              <div className="flex flex-col">
                <label>CONCEPTO</label>
                <input
                  type="text"
                  className="border p-2 rounded-md shadow-sm"
                  {...register("concepto", { required: true })}
                />
              </div>
              <div className="mb-4 flex flex-col">
                <label>CANTIDAD</label>
                <input
                  value={precio}
                  onChange={(e) => {
                    handlePrecioChange(e);
                  }}
                  type="text"
                  className="border p-2 rounded-md shadow-sm"
                />
              </div>
              <div className="mb-4">
                <label>OBSERVACIONES GASTOS</label>
                <textarea
                  className="border p-2 rounded-md shadow-sm w-full"
                  {...register("observacion", { required: true })}
                />
              </div>
            </div>
          </div>
        </form>

        <div className="w-full overflow-x-auto p-5">
          {comisionesData.otrosLista && comisionesData.otrosLista.length > 0 ? (
            <table className="w-full mt-4 bg-white rounded-md shadow-md mb-4 overflow-x-auto">
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
                {comisionesData.otrosLista.map((dato, index) => (
                  <tr key={index} className="mt-2">
                    <td className="border p-3 text-center">{dato.usuario}</td>
                    <td className="border p-3 text-center">
                      {moment(dato.fecha).format("YYYY-MMM-DD")}
                    </td>
                    <td className="border p-3 text-center">{dato.concepto}</td>
                    <td className="border p-3 text-center">
                      ${dato.precio.toLocaleString()}
                    </td>
                    <td className="border p-3 max-w-[200px]">
                      {dato.observacion}
                    </td>

                    <td className="border p-3 text-center">
                      <button
                        onClick={() => eliminarotrosgastos(index)}
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
            <p className="font-bold text-xl mb-10">
              Aún no hay gastos Adicionales.
            </p>
          )}
        </div>
      </div>
    </>
  );
};
