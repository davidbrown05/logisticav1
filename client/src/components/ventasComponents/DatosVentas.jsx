import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { VentasContext } from "../../context/VentasContext";
import { useForm } from "react-hook-form";
import moment from "moment";
import { DatePicker } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { CompradoresModal } from "./CompradoresModal";
import Swal from "sweetalert2";

export const DatosVentas = ({ id }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const { ventas, isLoadingVentas, setVentas } = useContext(VentasContext);
  console.log("ventasDataFromContext", ventas);
  const placements = [""];

  const [datosVentas, setDatosVentas] = useState(ventas);
  const [checkventas, setcheckventas] = useState(false);
  const [checkventasDelete, setcheckventasDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [compradores, setCompradores] = useState([]);
  const [loadCompradores, setloadCompradores] = useState(false);
  const [prevComprador, setPrevComprador] = useState(datosVentas.comprador);
  const [SelectedComprador, setSelectedComprador] = useState(false);
  const [openModal, setopenModal] = useState(false);
  const [comprador, setComprador] = useState(datosVentas.comprador);
  const [compradorRef, setCompradorRef] = useState(
    datosVentas.compradorRef || {}
  );

  console.log("datosVentasGeneralesData", datosVentas);
  console.log("compradorRef", compradorRef);

  const getCompradores = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/comprador");
      console.log("responseData", response.data.compradores);
      setCompradores(response.data.compradores);
      setloadCompradores(true);
    } catch (error) {
      console.log(error);
      setloadCompradores(false);
    }
  };

  useEffect(() => {
    getCompradores();
    let newData = datosVentas;
    console.log("newData", newData);
    if (checkventas) {
      handleUpdate(newData);
    }
  }, [datosVentas]);

  const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0;
  };

  const onSubmit = handleSubmit(async (data) => {
    console.log("comprador", data.comprador);
    if (isEmptyObject(compradorRef)) {
      await Swal.fire({
        title: "Error",
        text: "Es necesario agregar un comprador.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#000000",
      });
      return; // Detener la ejecución si no se ha agregado un comprador
    } else {
      const inputPrecio = data.precioFinal.replace(/[^0-9]/g, "");
      data.precioInicial = datosVentas.precioInicial;
      data.precioFinal = parseFloat(inputPrecio);
      // Formatear la fecha límite desde el input
      const fechaVentaInput = new Date(data.fechaVenta);
      const fechaLimiteFormateada = fechaVentaInput.toISOString();
      data.fechaVenta = fechaLimiteFormateada;

      data.comprador = compradorRef.nombreCompleto;
      data.compradorRef = compradorRef._id;

      data._id = datosVentas._id;
      console.log("datosVenta", data);
      setcheckventas(true);

      setDatosVentas(data);
    }
  });

  //UPDATE INFORMATION
  const handleUpdate = async (data) => {
    // e.preventDefault();
    setLoading(true);

    try {
      // Actualizar los datos en el servidor
      const responseUpdate = await axios.put(
        `http://localhost:3000/api/ventasData/${datosVentas._id}`,
        data
      );

      const nuevosDatos = await responseUpdate.data;
      console.log("nuevosDatos", nuevosDatos);

      // Volver a obtener los datos del servidor después de la actualización
      const response = await axios.get(
        `http://localhost:3000/api/ventasData/${id}`
      );

      // obtener la propiedad correspondiente
      const responseInmueble = await axios.get(
        `http://localhost:3000/api/products/${id}`
      );

      const inmueble = responseInmueble.data;
      console.log("inmueble", inmueble);

      // Actualizar el campo estatusVenta del inmueble
      const updatedInmueble = {
        ...inmueble,
        estatusVenta: data.estatusVenta,
        comprador: data.comprador,
        //compradorRef: data.compradorId,
        compradorRef: compradorRef._id,

        precioFinal: data.precioFinal,
      };

      // Actualizar los datos del Inmueble
      const responseUpdateInmueble = await axios.put(
        `http://localhost:3000/api/products/${id}`,
        updatedInmueble
      );

      console.log("inmuebleId", inmueble._id);

      // obtener los pagos correspondientes
      const responsePagos = await axios.get(
        `http://localhost:3000/api/pagosData/${inmueble._id}`
      );

      const pagos = responsePagos.data[0];

      console.log("pagosData", pagos);

      // Actualizar el campo estatusVenta del inmueble
      const updatedPagos = {
        ...pagos,
        montoTotal: data.precioFinal,
        comprador: data.comprador,
      };

      // Actualizar los datos del Inmueble
      const responseUpdatePagos = await axios.put(
        `http://localhost:3000/api/pagosData/${pagos._id}`,
        updatedPagos
      );

      // obtener la comision correspondiente
      const responseComision = await axios.get(
        `http://localhost:3000/api/comisionesData/${inmueble._id}`
      );

      const comisionData = responseComision.data[0];
      console.log("comisionData", comisionData);

      // Actualizar el campo estatusVenta del inmueble
      const updatedComision = {
        ...comisionData,
        montoTotal: data.precioFinal,
      };

      // Actualizar los datos del Inmueble
      const responseUpdateComision = await axios.put(
        `http://localhost:3000/api/comisionesData/${comisionData._id}`,
        updatedComision
      );

      // Actualizar el contexto con los nuevos datos
      //setVentas(response.data[0]);
      setVentas(nuevosDatos);

      setLoading(false);
      toast.success("DATOS VENTA ACTUALIZADOS");
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.message);
    }
  };

  if (isLoadingVentas) {
    return <div>Cargando datos de ventas...</div>;
  }

  const isDisabledPrecioInicial = true;

  return datosVentas ? (
    <div className="form-container mt-10 flex flex-col items-center w-full  lg:w-[1000px] max-w-[1500px] bg-[#f3f4f6]">
      <div className="form-header bg-black text-white w-full h-10 p-2 rounded-tl-md rounded-tr-md">
        DATOS GENERALES
      </div>

      <form onSubmit={onSubmit}>
        <div className="flex flex-col">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10 bg-[#f3f4f6] p-6 w-full">
            <div className="flex flex-col">
              <label className="font-semibold">TIPO DE VENTA</label>
              <select
                {...register("tipoVenta", { required: true })}
                defaultValue={datosVentas.tipoVenta}
                className="border p-2 rounded-md shadow-sm"
                // onChange={(e) => {
                //   const newValue = e.target.value;

                //   setDatosVentas((prevDatos) => ({
                //     ...prevDatos,
                //     tipoVenta: newValue,
                //   }));
                //   setValue("tipoVenta", newValue);
                // }}
                //  {...register("tipoVenta", { required: true })}
              >
                {/* Agrega las opciones de tu select */}
                <option value="N/A">N/A</option>
                <option value="TRASPASO">TRASPASO</option>
                <option value="PAQUETE">PAQUETE</option>
                <option value="INDIVIDUAL">INDIVIDUAL</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="font-semibold">ASESOR</label>
              <select
                {...register("asesor", { required: true })}
                defaultValue={datosVentas.asesor}
                className="border p-2 rounded-md shadow-sm"
                // onChange={(e) => {
                //   const newValue = e.target.value;
                //   setDatosVentas((prevDatos) => ({
                //     ...prevDatos,
                //     asesor: newValue,
                //   }));
                //   setValue("asesor", newValue);
                // }}
              >
                {/* Agrega las opciones de tu select */}
                <option value="N/A">N/A</option>
                <option value="SERGIO VILLA">SERGIO VILLA</option>
                <option value="VENTAS LOGISITCA">VENTAS LOGISITCA</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="font-semibold cursor-pointer">COMPRADOR</label>
              <input
                value={compradorRef.nombreCompleto || "N/A"}
                onClick={() => {
                  setopenModal(!openModal);
                }}
                type="text"
                className={`border p-2 rounded-md shadow-sm ${
                  isDisabledPrecioInicial ? "bg-gray-200" : ""
                }`}
                disabled={false}
                // {...register("precioInicial", { required: true })}
              />
            </div>

            {/* <div className="flex flex-col">
              <label className="font-semibold">COMPRADOR</label>
              <select
                value={datosVentas.comprador}
                {...register("comprador", { required: true })}
                className="border p-2 rounded-md shadow-sm"
                onClick={()=>{
                  setopenModal(!openModal)
                }}
                onChange={(e) => {
                  const newValue = e.target.value;
                  console.log("compradorSelectValue", newValue);
                  setDatosVentas((prevDatos) => ({
                    ...prevDatos,
                    comprador: newValue,
                  }));
                  setValue("comprador", newValue);
                  setSelectedComprador(true);
                  // setPrevComprador(newValue)
                }}
              >
              
                <option value="N/A">N/A</option>
                {loadCompradores &&
                  compradores.map((comprador) => (
                    <option
                      key={comprador._id}
                      value={comprador.nombreCompleto}
                    >
                      {comprador.nombreCompleto}
                    </option>
                  ))}
              </select>
            </div> */}

            <div className="flex flex-col">
              <label className="font-semibold">MONEDA</label>
              <select
                {...register("moneda", { required: true })}
                defaultValue={datosVentas.moneda}
                className="border p-2 rounded-md shadow-sm"
                // onChange={(e) => {
                //   const newValue = e.target.value;
                //   setDatosVentas((prevDatos) => ({
                //     ...prevDatos,
                //     moneda: newValue,
                //   }));
                //   setValue("moneda", newValue);
                // }}
              >
                {/* Agrega las opciones de tu select */}
                <option value="N/A">N/A</option>
                <option value="PESOS">PESOS</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="font-semibold">PRECIO INICIAL</label>
              <input
                value={`$${datosVentas.precioInicial.toLocaleString("es-MX")}`}
                type="text"
                className={`border p-2 rounded-md shadow-sm ${
                  isDisabledPrecioInicial ? "bg-gray-200" : ""
                }`}
                disabled={isDisabledPrecioInicial}
                // {...register("precioInicial", { required: true })}
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold">PRECIO FINAL</label>
              <input
                value={`$${datosVentas.precioFinal.toLocaleString("es-MX")}`}
                {...register("precioFinal", { required: true })}
                type="text"
                className="border p-2 rounded-md shadow-sm"
                onChange={(e) => {
                  const newValue = e.target.value;
                  const inputPrecio = e.target.value.replace(/[^0-9]/g, "");
                  console.log("inputPrecio", inputPrecio);
                  // Formatear con comas y agregar el símbolo de peso
                  const formattedPrecio = `${inputPrecio.replace(
                    /\B(?=(\d{3})+(?!\d))/g,
                    ","
                  )}`;
                  setDatosVentas((prevDatos) => ({
                    ...prevDatos,
                    precioFinal: formattedPrecio,
                  }));
                  setValue("precioFinal", inputPrecio);
                }}
                // {...register("precioFinal", { required: true })}
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold">FORMA DE PAGO</label>
              <select
                {...register("formaPago", { required: true })}
                defaultValue={datosVentas.formaPago}
                className="border p-2 rounded-md shadow-sm"
                // onChange={(e) => {
                //   const newValue = e.target.value;
                //   setDatosVentas((prevDatos) => ({
                //     ...prevDatos,
                //     formaPago: newValue,
                //   }));
                //   setValue("formaPago", newValue);
                // }}
              >
                {/* Agrega las opciones de tu select */}
                <option value="N/A">N/A</option>
                <option value="BANCARIA">BANCARIA</option>
                <option value="CHEQUE">CHEQUE</option>
                <option value="CONTADO">CONTADO</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="font-semibold">ESTATUS VENTA</label>
              <select
                {...register("estatusVenta", { required: true })}
                defaultValue={datosVentas.estatusVenta}
                className="border p-2 rounded-md shadow-sm"

                // onChange={(e) => {
                //   const newValue = e.target.value;
                //   setDatosVentas((prevDatos) => ({
                //     ...prevDatos,
                //     estatusVenta: newValue,
                //   }));
                //   setValue("estatusVenta", newValue);
                // }}
              >
                {/* Agrega las opciones de tu select */}
                <option value="N/A">N/A</option>
                <option value="VENDIDA">VENDIDA</option>
                <option value="APARTADA">APARTADA</option>
                <option value="CANCELADA">CANCELADA</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="font-semibold">FECHA DE VENTA</label>
              <input
                // value={datosVentas.fechaVenta}
                {...register("fechaVenta", { required: true })}
                defaultValue={moment(datosVentas.fechaVenta).format(
                  "YYYY-MM-DD"
                )}
                type="date"
                className="border p-2 rounded-md shadow-sm"

                // onChange={(e) => {
                //   const newValue = e.target.value;
                //   setDatosVentas((prevDatos) => ({
                //     ...prevDatos,
                //     fechaVenta: newValue,
                //   }));
                //   setValue("fechaVenta", newValue);
                // }}
              />
              {errors.fechaVenta && (
                <p className=" text-red-500">FECHA REQUERIDA</p>
              )}
            </div>

            {/* Agrega los demás campos del formulario según sea necesario */}
           
              <button
                type="submit"
                className="bg-black text-white md:px-4 md:py-2  rounded "
              >
                ACTUALIZAR
              </button>
            
          </div>
        </div>
      </form>
      <CompradoresModal
        openModal={openModal}
        setopenModal={setopenModal}
        setComprador={setComprador}
        setCompradorRef={setCompradorRef}
      />
    </div>
  ) : (
    <p>Cargando datos de ventas...</p>
  );
};
