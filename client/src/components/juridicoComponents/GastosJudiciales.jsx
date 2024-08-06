import React, { useState, useEffect, useContext } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { FaCirclePlus, FaPlus } from "react-icons/fa6";
import { JuridicoContext } from "../../context/JuridicoContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { Rings } from "react-loader-spinner";
import { Switch } from "@nextui-org/react";
import moment from "moment";
import { UsuarioContext } from "../../context/UsuarioContext";

const datosEjemplo = [
  {
    usuario: "Usuario1",
    fecha: "2024-01-17",
    concepto: "Compra",
    cantidad: 150.0,
    observacion: "Pago con tarjeta",
  },
  {
    usuario: "Usuario2",
    fecha: "2024-01-18",
    concepto: "Venta",
    cantidad: 200.0,
    observacion: "Cliente satisfecho",
  },
  {
    usuario: "Usuario3",
    fecha: "2024-01-19",
    concepto: "Gasto",
    cantidad: 50.0,
    observacion: "Material de oficina",
  },
  {
    usuario: "Usuario4",
    fecha: "2024-01-20",
    concepto: "Ingreso",
    cantidad: 300.0,
    observacion: "Transferencia bancaria",
  },
  {
    usuario: "Usuario5",
    fecha: "2024-01-21",
    concepto: "Compra",
    cantidad: 100.0,
    observacion: "Pago en efectivo",
  },
];

export const GastosJudiciales = ({ id }) => {
  const [gastos, setGastos] = useState(0);
  const [switchComision, setSwitchCOmision] = useState(false);
  const { juridico, setJuridico, loadingJuridco } = useContext(JuridicoContext);
  const { userCOntext } = useContext(UsuarioContext);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [precio, setPrecio] = useState("");
  const [checkJuridico, setCheckJuridico] = useState(false);

  const [juridicoData, setJuridicoData] = useState(juridico);

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

  const fecha = new Date();

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    data.fecha = fecha;
    data.usuario = userCOntext.email;
    data.status = false;
    data.precio = parseInt(data.precio);
    console.log("formData", data);

    const newArrayObjeto = [...juridicoData.gastosLista];
    // Paso 2: Actualizar la copia con los datos de nuevaObservacion
    newArrayObjeto.push(data);

    // Calcular suma de precios en gastosLista
    const sumaPrecios = newArrayObjeto.reduce(
      (total, gasto) => total + gasto.precio,
      0
    );

    // Calcular nuevo valor para el campo 'gastos'
    const nuevoGastos = sumaPrecios;

    setCheckJuridico(true);

    setJuridicoData({
      ...juridicoData,
      gastosLista: newArrayObjeto,
    });
  });

  // useEffect para actualizar el formulario después de que juridicoData cambie
  useEffect(() => {
    let neData = juridicoData;
    calcularFondoRestante();
    console.log("juridicoDataDeletedActualizado", neData);

    if (checkJuridico) {
      console.log("handleUpdate2", neData);
      handleUpdate2(neData);
    }

    return () => {
      console.log("fase desmintaje");
    };
  }, [juridicoData]);

  const handleOnchangeSwitch = async (index, status) => {
    console.log("index", index);
    console.log("status", status);
    let result;
    if (status) {
      result = await Swal.fire({
        title: `ESTE GASTO YA FUE APROBADO`,
        text: "Si no necesitas este gasto puedes eliminarlo",
        icon: "warning",
        showCancelButton: true,
        showConfirmButton: false,
        confirmButtonColor: "#000000",
        cancelButtonColor: "#d33",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cerrar",
      });
    } else {
      result = await Swal.fire({
        title: `APROBAR GASTO?`,
        text: "Una ves aprobado no podras cambiar su estado",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#000000",
        cancelButtonColor: "#d33",
        confirmButtonText: "Aceptar",
      });
    }

    if (result.isConfirmed) {
      console.log("index", index);
      const newArrayObjeto = [...juridicoData.gastosLista]; // Copia del arreglo original
      newArrayObjeto[index] = {
        ...newArrayObjeto[index],
        status: !newArrayObjeto[index].status, // Invertir el valor del status
      };

      console.log("newArrayStatus", newArrayObjeto);

      setCheckJuridico(true);
      setSwitchCOmision(true);

      setJuridicoData({
        ...juridicoData,
        gastosLista: newArrayObjeto,
      });
    }
  };

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

      console.log("switch", switchComision);
      console.log("propertyId", id);

      if (switchComision) {
        // obtener la comision correspondiente
        const responseComision = await axios.get(
          `http://localhost:3000/api/comisionesData/${id}`
        );

        const comisionData = responseComision.data;
        console.log("comisionData", comisionData);

        // Actualizar el campo estatusVenta del inmueble
        const updatedComision = {
          ...comisionData,
          juridicoLista: newData.gastosLista,
        };

        // Actualizar los datos del Inmueble
        const responseUpdateComision = await axios.put(
          `http://localhost:3000/api/comisionesData/${comisionData[0]._id}`,
          updatedComision
        );
      }

      // Volver a obtener los datos del servidor después de la actualización
      const response = await axios.get(
        `http://localhost:3000/api/juridicoData/${newData._id}`
      );
      console.log("responseJuridicoData", response.data);
      // Actualizar el contexto con los nuevos datos
      setJuridico(nuevosDatos);

      setCheckJuridico(false);
      setLoading(false);
      toast.success("GASTOS ACTUALIZADAS");
    } catch (error) {
      setCheckJuridico(false);
      setSwitchCOmision(false);
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleDeleteGasto = async (index) => {
    console.log("index", index);
    const result = await Swal.fire({
      title: `ELIMINAR GASTO?`,
      text: "No podras recuperar esta información",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar",
    });

    if (result.isConfirmed) {
      try {
        const newArrayObjeto = [...juridicoData.gastosLista];
        const objetoAEliminar = newArrayObjeto[index]; // Obtener el objeto a eliminar por su índice

        newArrayObjeto.splice(index, 1);

        // setCheckJuridicoDelete(true);
        // setCheckJuridico(false);
        setCheckJuridico(true);
        setSwitchCOmision(true);

        setJuridicoData({
          ...juridicoData,
          gastosLista: newArrayObjeto,
        });

        // setJuridicoDeleteData({
        //   ...juridicoDeleteData,
        //   documentosLista: newArrayObjeto,
        //   assetid: assetidAEliminar,
        // });
      } catch (error) {
        setLoading(false);
        setCheckJuridico(false);
        setSwitchCOmision(false);
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const isDisabledGastos = true;
  const isDisabledFondos = true;

  const calcularFondoRestante = () => {
    // Calcula la suma de precios en gastosLista con status igual a true
    const sumaPrecios = juridicoData.gastosLista
      .filter((gasto) => gasto.status === true)
      .reduce((total, gasto) => total + gasto.precio, 0);

    console.log("sumaGastos", sumaPrecios);

    setGastos(sumaPrecios);

    // Calcula el nuevo valor para el campo 'fondo'
    const nuevoFondo = juridicoData.fondo - sumaPrecios;

    console.log("gastos", nuevoFondo);
  };

  const [isSelected, setIsSelected] = useState(true);

  return (
    <>
      <div className="form-container mt-10 flex flex-col items-center w-full  lg:w-[1000px] max-w-[1500px] bg-[#f3f4f6]">
        <div className="form-header bg-black text-white w-full h-10 p-2 rounded-tl-md rounded-tr-md">
          GASTOS JURIDICOS
        </div>

        <form onSubmit={onSubmit} className="w-full">
          <div className="flex flex-col items-center gap-5 p-6 w-full">
            {/* Columna gastos y fondos */}
            <div className="flex flex-col md:flex-row lg:flex-row gap-5 items-center justify-around bg-white p-4 rounded-lg shadow-xl w-full">
              <div className="mb-4 flex flex-col w-full max-w-[300px]">
                <label className="font-medium">FONDO</label>
                <input
                  value={`$${juridicoData.fondo.toLocaleString("es-MX")}`}
                  type="text"
                  className={`p-2 rounded-md text-white shadow-sm ${
                    isDisabledFondos ? "bg-green-900" : ""
                  }`}
                  disabled={isDisabledFondos}
                />
              </div>

              <div className="mb-4 flex flex-col w-full max-w-[300px]">
                <label className="font-medium">GASTOS</label>
                <input
                  value={`$${gastos.toLocaleString("es-MX")}`}
                  type="text"
                  className={`p-2 rounded-md text-white shadow-sm ${
                    isDisabledGastos ? "bg-yellow-500" : ""
                  }`}
                  disabled={isDisabledGastos}
                />
              </div>
            </div>

            {/* Columna formulario */}
            <div className="flex flex-col w-full gap-5">
              <div className="flex items-center self-end">
                <button
                  type="submit"
                  className="bg-black text-white px-2 py-2 rounded-full shadow-lg"
                >
                  <FaPlus />
                </button>
              </div>
              <div className="flex flex-wrap justify-evenly mb-4 w-full gap-4">
                <div className="flex flex-col w-full max-w-[300px]">
                  <label className="font-semibold text-[11px] lg:text-[15px]">
                    CONCEPTO
                  </label>
                  <input
                    type="text"
                    className="border p-2 rounded-md shadow-sm w-full"
                    {...register("concepto", { required: true })}
                  />
                </div>
                <div className="flex flex-col w-full max-w-[300px]">
                  <label className="font-semibold text-[11px] lg:text-[15px]">
                    CANTIDAD
                  </label>
                  <input
                    value={precio}
                    onChange={(e) => {
                      handlePrecioChange(e);
                    }}
                    type="text"
                    className="border p-2 rounded-md shadow-sm w-full"
                  />
                </div>
              </div>

              <div className="mb-4 w-full">
                <label className="font-semibold text-[11px] lg:text-[15px]">
                  OBSERVACIONES GASTOS
                </label>
                <textarea
                  className="border p-2 rounded-md shadow-sm w-full"
                  {...register("observacion", { required: true })}
                />
              </div>
            </div>
          </div>
        </form>

        <div className="md:w-[800px] lg:w-[900px] xl:w-[950px] overflow-x-auto w-[340px]">
          {juridicoData.gastosLista && juridicoData.gastosLista.length > 0 ? (
            <table className="w-full mt-4 bg-white rounded-md shadow-md mb-4 overflow-x-auto">
              <thead>
                <tr>
                  <th className="border p-2">USUARIO</th>
                  <th className="border p-2">FECHA</th>
                  <th className="border p-2">CONCEPTO</th>
                  <th className="border p-2">CANTIDAD</th>
                  <th className="border p-2">OBSERVACIÓN</th>
                  <th className="border p-2">ESTADO</th>
                  <th className="border p-2"></th>
                </tr>
              </thead>
              <tbody>
                {juridicoData.gastosLista.map((dato, index) => (
                  <tr key={index}>
                    <td className="border p-3 text-center">{dato.usuario}</td>
                    <td className="border p-3 text-center">
                      {moment(dato.fecha).format("YYYY-MMM-DD")}
                    </td>
                    <td className="border p-3 text-center">{dato.concepto}</td>
                    <td className="border p-3 text-center">
                      ${dato.precio.toLocaleString("es-mx")}
                    </td>
                    <td className="border p-3 max-w-[200px]">
                      {dato.observacion}
                    </td>
                    <td className="border p-3 text-center">
                      <Switch
                        isSelected={dato.status}
                        disabled={dato.status}
                        onChange={(e) => {
                          handleOnchangeSwitch(index, dato.status);
                        }}
                      ></Switch>
                    </td>
                    <td className="border p-3 text-center">
                      <button
                        onClick={() => handleDeleteGasto(index)}
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
              Aún no hay gastos judiciales.
            </p>
          )}
        </div>
      </div>
    </>
  );
};
