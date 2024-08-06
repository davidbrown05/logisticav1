import React, { useState, useEffect, useContext } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { FaCirclePlus, FaPlus } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { forceUpdateLists } from "../../redux/juridico/deudaGlobalSlice";
import { toast } from "react-toastify";
import axios from "axios";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { Rings } from "react-loader-spinner";
import { UsuarioContext } from "../../context/UsuarioContext";
import moment from "moment";
import { FiEdit } from "react-icons/fi";

export const PropertyDeudaLista = ({
  id,
  setcurrentStep,
  currentStep,
  setdeudaInfo,
  propertyDeudaData,
  setpropertyDeudaData,
  setpropertyDeuda,
  setdeudaListaIndex,
  checkpropertyDeuda,
  checkpropertyDeudaDelete,
  setCheckpropertyDeuda,
  setcheckpropertyDeudaDelete,
  loadingUpload,
  setloadingUpload,
  product,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();

  const isDisabledAbonado = true;

  const isDisabledDeuda = true;
  const isDisableMonto = true;

  const { userCOntext } = useContext(UsuarioContext);

  const [monto, setMonto] = useState(0);
  const [abonado, setAbonado] = useState(0);
  const [deuda, setDeuda] = useState(0);
  const [cantidad, setCantidad] = useState("");

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

  const calcularPagos = (data) => {
    if (data.deudaLista.length > 0) {
      console.log("calcular gastos", data.deudaLista);

      const sumaMontoTotal = data.deudaLista.reduce(
        (total, pago) => total + pago.cantidad,
        0
      );
      setMonto(sumaMontoTotal);

      // Primero aplanamos la lista principal
      let deudaListaAplanada = data.deudaLista.flatMap(
        (deuda) => deuda.abonado
      );

      // Paso 2: Aplanar las listas en un solo array
      let abonosAplanados = deudaListaAplanada.flat();

      // Usamos reduce para sumar todos los montos
      let sumaTotalAbonos = abonosAplanados.reduce(
        (total, abono) => total + abono.cantidadAnticipo,
        0
      );

      setAbonado(sumaTotalAbonos);

      const deuda = sumaMontoTotal - sumaTotalAbonos;

      setDeuda(deuda);
    } else {
      setMonto(0);
    }
  };

  useEffect(() => {
    let newData = propertyDeudaData;
    calcularPagos(newData);
    console.log("propertyDeudaNewData", newData);

    if (checkpropertyDeuda) {
      console.log("handleUpdate", newData);
      handleUpdate(newData);
    }
    if (checkpropertyDeudaDelete) {
      console.log("handleUpdate", newData);
      handleUpdate(newData);
    }
  }, [propertyDeudaData]);

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
        toast.success("NUEVO ADEUDO AGREGADO");
      } else if (checkpropertyDeudaDelete) {
        toast.success("ADEUDO ELIMINADO");
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

  const onSubmit = handleSubmit((data) => {
    setloadingUpload(true);
    setCheckpropertyDeuda(true);
    const fechaVentaInput = new Date();
    const fechaLimiteFormateada = fechaVentaInput.toISOString();
    data.fechaAdeudo = fechaLimiteFormateada;
    data.usuario = userCOntext.email;
    let amount = data.cantidad;

    // Remover el símbolo $ y las comas
    amount = amount.replace(/[$,]/g, "");

    data.cantidad = parseFloat(amount);
    data.abonado = [];
    data.deuda = parseFloat(0);

    data.direccion = product.direccion;
    data.empresa = product.empresa;
    data.contacto = product.contacto;

    data.url = `http://localhost:5173/propertydeuda/${id}`;

    const newArrayObjeto = [...propertyDeudaData.deudaLista];
    // Paso 2: Actualizar la copia con los datos de nuevaObservacion
    newArrayObjeto.push(data);

    // Actualizar el contexto con los nuevos datos
    setpropertyDeudaData((prevAdeudos) => ({
      ...prevAdeudos,
      // Actualizar los campos necesarios con los datos del formulario
      deudaLista: newArrayObjeto,
    }));
    console.log("formData", data);
  });

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
      try {
        const newArrayObjeto = [...propertyDeudaData.deudaLista];
        const objetoAEliminar = newArrayObjeto[index]; // Obtener el objeto a eliminar por su índice

        newArrayObjeto.splice(index, 1);

        // setCheckJuridicoDelete(true);
        // setCheckJuridico(false);
        setcheckpropertyDeudaDelete(true);
        setCheckpropertyDeuda(false);

        setpropertyDeudaData({
          ...propertyDeudaData,
          deudaLista: newArrayObjeto,
        });

        // setJuridicoDeleteData({
        //   ...juridicoDeleteData,
        //   documentosLista: newArrayObjeto,
        //   assetid: assetidAEliminar,
        // });
      } catch (error) {
        setloadingUpload(false);
        setcheckpropertyDeudaDelete(false);
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  return (
    <>
      <div className="form-container mt-10 flex flex-col items-center w-screen  lg:w-[1000px] max-w-[1500px] bg-[#f3f4f6]">
        <div className="form-header bg-black text-white w-full h-10 p-2 rounded-tl-md rounded-tr-md">
          DEUDA DE LA PROPIEDAD
        </div>
        <form
          onSubmit={onSubmit}
          className="  flex flex-col gap-5 mt-5 mb-5 font-semibold xl:items-end"
        >
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
          <div className="flex items-center self-end ">
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
          <div className="flex flex-col md:flex-row xl:flex-row items-center justify-evenly gap-10">
            <div className="flex flex-col w-full">
              <label>CONCEPTO</label>
              <select
                // onChange={(e) => (tipoVentaRef.current = e.target.value)}
                className="border p-2 rounded-md shadow-sm"
                {...register("concepto", { required: true })}
              >
                <option value="AGUA">AGUA</option>
                <option value="EMPRESA">EMPRESA</option>
                <option value="INFONAVIT">INFONAVIT</option>
                <option value="INMUEBLES">INMUEBLES</option>
                <option value="INVENTARIO">INVENTARIO</option>
                <option value="LUZ">LUZ</option>
                <option value="PREDIAL">PREDIAL</option>
                <option value="REEMBOLSO">REEMBOLSO</option>
              </select>
            </div>

           
            <div>
              <div className="flex flex-col w-full">
                <label>CANTIDAD</label>
                <input
                  {...register("cantidad", { required: true })}
                  value={cantidad}
                  onChange={(e) => {
                    handlePrecioChange(e);
                  }}
                  type="text"
                  className="border p-2 rounded-md shadow-sm "
                />
              </div>
            </div>
          </div>
          {/* COLUMNA DE ABAJO */}
          <div className="w-full">
            <div>
              <div className="flex flex-col w-full ">
                <label>OBSERVACION</label>
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
        <div className="w-full overflow-x-auto p-5">
          {propertyDeudaData.deudaLista &&
          propertyDeudaData.deudaLista.length > 0 ? (
            <table className="w-full mt-4 bg-white rounded-md shadow-md mb-4 overflow-x-auto">
              <thead>
                <tr>
                  <th className="border p-2">USUARIO</th>
                  <th className="border p-2">FECHA</th>
                  <th className="border p-2">CONCEPTO</th>
                  <th className="border p-2">MONTO TOTAL</th>
                  <th className="border p-2">ANTICIPO</th>
                  <th className="border p-2">SALDO</th>
                  <th className="border p-2">OBSERVACIÓN</th>
                  <th className="border p-2"></th>
                  <th className="border p-2"></th>
                </tr>
              </thead>
              <tbody className="">
                {propertyDeudaData.deudaLista.map((dato, index) => {
                  const totalAbonado = dato.abonado.reduce(
                    (total, abono) => total + abono.cantidadAnticipo,
                    0
                  );
                  const saldo = dato.cantidad - totalAbonado;

                  return (
                    <tr key={index} className="mt-2">
                      <td className="border p-3 text-center">{dato.usuario}</td>
                      <td className="border p-3 text-center">
                        {moment(dato.fecha).format("DD-MMM-YYYY")}
                      </td>
                      <td className="border p-3 text-center">
                        {dato.concepto}
                      </td>
                      <td className="border p-3 text-center">
                        ${dato.cantidad.toLocaleString("es-MX")}
                      </td>
                      <td className="border p-3 text-center">
                        ${totalAbonado.toLocaleString("es-MX")}
                      </td>
                      <td className="border p-3 text-center">
                        ${saldo.toLocaleString("es-MX")}
                      </td>
                      <td className="border p-3 max-w-[200px]">
                        {dato.observacion}
                      </td>
                      <td className="border p-3 text-center">
                        <button
                          onClick={() => {
                            setdeudaListaIndex(index);
                            setdeudaInfo(dato);
                            setcurrentStep(1);
                          }}
                          className="px-2 py-1 rounded shadow-lg"
                        >
                          <FiEdit />
                        </button>
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
                  );
                })}
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
