import React, { useState, useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { FaCirclePlus, FaPlus } from "react-icons/fa6";
import { PropertyDeudaContext } from "../../context/PropertyDeudaContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { Rings } from "react-loader-spinner";
import { UsuarioContext } from "../../context/UsuarioContext";
import moment from "moment";
import { FiEdit } from "react-icons/fi";
import { v4 as uuidv4 } from "uuid";
import { forceUpdateLists } from "../../redux/juridico/deudaGlobalSlice";
import { useDispatch, useSelector } from "react-redux";

export const EditPropertyDeuda = ({
  deudaInfo,
  setdeudaInfo,
  setpropertyDeudaData,
  propertyDeudaData,
  deudaListaIndex,
  checkpropertyDeuda,
  checkpropertyDeudaDelete,
  setCheckpropertyDeuda,
  setcheckpropertyDeudaDelete,
  loadingUpload,
  setloadingUpload,
  setpropertyDeuda,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();

  console.log("deudaListaIndex", deudaListaIndex);
  const isDisableMonto = true;
  const [cantidad, setCantidad] = useState("");

  const [abonos, setAbonos] = useState(deudaInfo.abonado);

  const handlePrecioChange = (event) => {
    const inputPrecio = event.target.value.replace(/[^0-9]/g, "");

    const formattedPrecio = `$${inputPrecio.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ","
    )}`;

    setCantidad(formattedPrecio);

    // setValue("cantidadPago", inputPrecio, { shouldValidate: true });
  };

  useEffect(() => {
    let newData = propertyDeudaData;

    console.log("propertyDeudaNewData", newData);
    console.log("check", checkpropertyDeuda);

    if (checkpropertyDeuda) {
      console.log("handleUpdate", newData);
      handleUpdate(newData);
    }
    if (checkpropertyDeudaDelete) {
      console.log("handleUpdate", newData);
      handleUpdate(newData);
    }
  }, [propertyDeudaData]);

  const onSubmit = handleSubmit((data) => {
    setloadingUpload(true)
    console.log("formData", data);
    let amount = data.cantidadAnticipo;
    // Remover el símbolo $ y las comas
    amount = amount.replace(/[$,]/g, "");
    data.cantidadAnticipo = parseFloat(amount);

    const fechaVentaInput = new Date();
    const fechaLimiteFormateada = fechaVentaInput.toISOString();
    data.fechaAnticipo = fechaLimiteFormateada;

    data.id = uuidv4();

    setCheckpropertyDeuda(true);
    // Crear una copia del array de corridas
    const nuevosAbonos = [...abonos];

    // Agregar la nueva corrida al array
    nuevosAbonos.push(data);

    // Actualizar el estado con el nuevo array de corridas
    setAbonos(nuevosAbonos);

    // Actualizar el abono en el estado
    setpropertyDeudaData({
      ...propertyDeudaData,
      deudaLista: propertyDeudaData.deudaLista.map((corrida, corridaInd) => {
        if (corridaInd === deudaListaIndex) {
          return {
            ...corrida,
            abonado: nuevosAbonos,
          };
        }
        return corrida;
      }),
    });
  });

  const handleUpdate = async (newData) => {
    console.log("newData en el handle", newData);
    try {
      // Actualizar los datos en el servidor
      const responseUpdate = await axios.put(
        `http://localhost:3000/api/propertyDeudaData/${propertyDeudaData._id}`,
        newData
      );

      const nuevosDatos = await responseUpdate.data;

      console.log("datos actualizados", nuevosDatos);

      // Volver a obtener los datos del servidor después de la actualización
      const response = await axios.get(
        `http://localhost:3000/api/propertyDeudaData/${newData._id}`
      );
      // console.log("responseJuridicoData", response.data);
      // Actualizar el contexto con los nuevos datos
      dispatch(forceUpdateLists());
      setpropertyDeuda(nuevosDatos);

      if (checkpropertyDeuda) {
        toast.success("NUEVO ABONO AGREGADO");
      } else if (checkpropertyDeudaDelete) {
        toast.success("ABONO ELIMINADO");
      }

      setCheckpropertyDeuda(false);
      setcheckpropertyDeudaDelete(false);
      setloadingUpload(false);
    } catch (error) {
      setCheckpropertyDeuda(false);
      setcheckpropertyDeudaDelete(false);
      console.log(error);
      toast.error(error.message);
    }
  };

  //-----------------------------------------------------------------------FUNCIONES PARA BORRAR PAGOS
  const eliminarAdeudo = async (index) => {
    console.log("index", index);
    const result = await Swal.fire({
      title: `ELIMINAR ABONO?`,
      text: "No podras recuperar estos datos",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar",
    });

    if (result.isConfirmed) {
      try {
        const nuevosAbonos = [...abonos];
        nuevosAbonos.splice(index, 1);

        // Actualizar el estado con el nuevo array de corridas
        setAbonos(nuevosAbonos);

        //  const objetoAEliminar = newArrayObjeto[index]; // Obtener el objeto a eliminar por su índice

        // setCheckJuridicoDelete(true);
        // setCheckJuridico(false);
        setcheckpropertyDeudaDelete(true);
        setCheckpropertyDeuda(false);

        // Actualizar el abono en el estado
        setpropertyDeudaData({
          ...propertyDeudaData,
          deudaLista: propertyDeudaData.deudaLista.map(
            (corrida, corridaInd) => {
              if (corridaInd === deudaListaIndex) {
                return {
                  ...corrida,
                  abonado: nuevosAbonos,
                };
              }
              return corrida;
            }
          ),
        });
      } catch (error) {
        setloadingUpload(false);
        setcheckpropertyDeudaDelete(false);
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  console.log("deudaInfo", deudaInfo);
  return (
    <>
      <div className="form-container mt-10 flex flex-col items-center w-screen  lg:w-[1000px] max-w-[1500px] bg-[#f3f4f6]">
      <div className="form-header bg-black text-white w-full h-10 p-2 rounded-tl-md rounded-tr-md">
          EDITAR ADEUDO
        </div>
        <form
          onSubmit={onSubmit}
          className="  flex flex-col gap-5 mt-5 mb-5 font-semibold xl:items-end"
        >
         
          {/* COLUMNA DE ARRIBA */}
          {/* <div className="flex flex-col xl:flex-row items-center justify-between gap-10">
            <div className="flex gap-10">
              <div className="flex flex-col">
                <label>MONTO TOTAL</label>
                <input
                  //  {...register("cantidad", { required: true })}
                  value={`$${deudaInfo.cantidad.toLocaleString("es-MX")}`}
                  //   onChange={(e) => {
                  //     handlePrecioChange(e);
                  //   }}
                  type="text"
                  className={` p-2 rounded-md font-medium shadow-sm ${
                    isDisableMonto ? " bg-gray-300" : ""
                  }`}
                  disabled={isDisableMonto}
                />
              </div>
            </div>
          </div> */}
          {/* COLUMNA DE ABAJO */}
          <div className="w-full flex flex-col gap-10 lg:w-[500px]">
            <div>
              <div className="flex flex-col w-full ">
                <label>OBSERVACION</label>
                <textarea
                  type="text"
                  className={` p-2 rounded-md font-medium shadow-sm ${
                    isDisableMonto ? " bg-white" : ""
                  }`}
                  disabled={false}
                  {...register("observacion", { required: true })}
                  // value={deudaInfo.observacion}
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label>ANTICIPOS</label>
              <input
                {...register("cantidadAnticipo", { required: true })}
                value={cantidad}
                onChange={(e) => {
                  handlePrecioChange(e);
                }}
                type="text"
                className="border p-2 rounded-md shadow-sm"
              />
            </div>
            {!loadingUpload && (
              <button className=" bg-black text-white p-1 rounded-lg">
                AGREGAR ANTICIPO
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
        </form>
        {/* TABLA */}
        <div className="w-full overflow-x-auto p-5">
          {abonos && abonos.length > 0 ? (
             <table className="w-full mt-4 bg-white rounded-md shadow-md mb-4 overflow-x-auto">
              <thead>
                <tr>
                  <th className="border p-2">FECHA</th>
                  <th className="border p-2">ANTICIPO</th>
                  <th className="border p-2">OBSERVACIÓN</th>

                  <th className="border p-2"></th>
                </tr>
              </thead>
              <tbody className="">
                {abonos.map((dato, index) => (
                  <tr key={index} className="mt-2">
                    <td className="border p-3 text-center">
                      {moment(dato.fechaAnticipo).format("DD-MMM-YYYY")}
                    </td>

                    <td className="border p-3 text-center">
                      ${dato.cantidadAnticipo.toLocaleString("es-MX")}
                    </td>

                    <td className="border p-3 max-w-[200px]">
                      {dato.observacion}
                    </td>

                    <td className="border p-3 text-center"></td>
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
            <p className="font-bold text-xl mb-10">Aún no hay Abonos.</p>
          )}
        </div>
      </div>
    </>
  );
};
