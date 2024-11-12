import React, { useState, useEffect, useContext, useCallback } from "react";
import { FaPlus } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import moment from "moment";
import { PartnersContext } from "../../context/PartnersContext";
import { PiWarningFill, PiPaperclip } from "react-icons/pi";
import Swal from "sweetalert2";
import axios from "axios";
import { Rings } from "react-loader-spinner";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";

export const CrearPartner = ({
  setSelectedTab,
  partners,
  setPartners,
  setloaderContext,
}) => {
  // const { partners, loadingPartners, setPartners } =
  //   useContext(PartnersContext);
  // const [partnersData, setPartnersData] = useState(partners);
  const [inversionInicial, setinversionInicial] = useState("");
  const [suertePrincipal, setsuertePrincipal] = useState("");
  const [utilidad, setUtilidad] = useState("");
  const [reembolso, setReembolso] = useState(0);
  const [totalUtilidad, setTotalUtilidad] = useState(0);
  const [proxPagos, setProxPagos] = useState([]);
  const [guardarButton, setguardarButton] = useState(false);
  const [checPartners, setchecPartners] = useState(false);
  const [loadingPartner, setloadingPartner] = useState(false);

  const isDisabledReemboloso = true;
  const isDisabledutilidad = true;

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

  const handleTab = () => {
    setSelectedTab(1);
  };
  const handlePrecioChange = (event) => {
    // Eliminar caracteres no numéricos
    const inputPrecio = event.target.value.replace(/[^0-9]/g, "");

    // Formatear con comas y agregar el símbolo de peso
    const formattedPrecio = `$${inputPrecio.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ","
    )}`;

    // Actualizar el estado del precio
    setinversionInicial(formattedPrecio);
    setValue("inversionInicial", inputPrecio);
  };
  const handleSuertePrincipal = (event) => {
    // Eliminar caracteres no numéric  os
    const inputPrecio = event.target.value.replace(/[^0-9]/g, "");

    // Formatear con comas y agregar el símbolo de peso
    const formattedPrecio = `$${inputPrecio.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ","
    )}`;

    // Actualizar el estado del precio
    setsuertePrincipal(formattedPrecio);
    setValue("suertePrincipal", inputPrecio);
  };
  const handleUtilidad = (event) => {
    // Eliminar caracteres no numéricos
    const inputPrecio = event.target.value.replace(/[^0-9]/g, "");

    // Formatear con comas y agregar el símbolo de peso
    const formattedPrecio = `%${inputPrecio.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ","
    )}`;

    // Actualizar el estado del precio
    setUtilidad(formattedPrecio);
    setValue("porcentajeUtilidad", inputPrecio);
  };

  const onSubmit = handleSubmit((data) => {
    data.fechaContratoVigente = moment(data.fechaContratoVigente).toISOString();
    data.fechaInicioInversion = moment(data.fechaInicioInversion).toISOString();
    data.inversionInicial = parseFloat(data.inversionInicial);
    data.suertePrincipal = parseFloat(data.suertePrincipal);
    data.porcentajeUtilidad = parseFloat(data.porcentajeUtilidad);
    const porcentaje = (data.suertePrincipal * data.porcentajeUtilidad) / 100;
    const totalReembolzo = data.inversionInicial + porcentaje;

    data.utilidad = parseFloat(porcentaje);
    data.totalReembolzo = totalReembolzo;
    data.status = "activo";

    setReembolso(totalReembolzo);
    setTotalUtilidad(porcentaje);
    setguardarButton(true);

    const fechaInicio = moment(data.fechaContratoVigente);
    let fechaParcialidad = fechaInicio.clone();
    let pagos = [];
    let corridas = [];
    let plazoText = "";

    const plazoMeses = data.plazo;
    const parcialidades = data.parcialidades;
    const utilidad = data.porcentajeUtilidad;
    const pagoMes = porcentaje / parcialidades;
    let partnerInfo = [];

    const plazoPago = Math.floor(plazoMeses / parcialidades);

    for (let i = 0; i < parcialidades; i++) {
      fechaParcialidad.add(plazoPago, "months");
      const pagoInfo = {
        _id: String(Math.random()).replace(".", ""),
        parcialidades: pagoMes,
        abono: 0,
        fechaParaPago: fechaParcialidad.toISOString(),
        fechaPagoRealizado: "",
        abonos: [],
        status: "false",
        check: "false",
      };
      pagos.push(pagoInfo);
      plazoText = plazoText + "\n" + pagos.toString();
    }

    console.log("Pagos:", pagos);

    // Obtener la última fecha de pago
    const fechaFinalizacion = pagos[pagos.length - 1].fechaParaPago;
    console.log("fechaFinlalizacion", fechaFinalizacion);

    partnerInfo = {
      _id: String(Math.random()).replace(".", ""),
      ronda: 0,
      partner: data.partner,
      fechaInversionInicial: data.fechaInicioInversion,
      fechaContratoVigente: data.fechaContratoVigente,
      fechaFinalizacion: fechaFinalizacion, //agregar nueva fecha
      tipoPago: data.tipoPago,
      suertePrincipal: data.suertePrincipal,
      inversionInicial: data.inversionInicial,
      porcentajeUtilidad: data.porcentajeUtilidad,
      reembolzo: totalReembolzo,
      utilidad: data.utilidad,
      plazo: data.plazo,
      parcialidades: parcialidades,
      pagos: pagos,
      comentarios: [],
      status: true,
      check: false,
    };

    corridas.push(partnerInfo);

    data.corridas = corridas;
    setProxPagos(pagos);

    data.pagosFinales = [];
    // console.log("partnerInfo", corridas);
    //console.log("fechaPagos", pagos);
    // console.log("pagosText", plazoText);
    console.log("formData", data);

    if (checPartners) {
      //  setloadingPartner(ture);

      handlePartner(data);
      // handleFileUpload(data)
    }
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

      setTimeout(async () => {
        const response = await axios.post(
          "http://localhost:3000/api/partners",
          data
        );

        const responseUpdate = response.data;
        console.log("nuevosPartners", responseUpdate);
        setPartners([...partners, responseUpdate]);
        setloadingPartner(false);
        setloaderContext(false);
        toast.success("NUEVO PARTNER AGREGADO");
        setSelectedTab(1);
      }, 100);
    } catch (error) {
      // Manejar errores al obtener la URL de descarga
      console.error("Error al obtener la URL de descarga:", error);

      // setloadingPartner(false);
      setloaderContext(false);
      setchecPartners(false);
      console.log(error);
      toast.error(error.message);
    }
  };

  const handlePartner = async (data) => {
    const result = await Swal.fire({
      title: `AGREGAR NUEVO PARTNER?`,
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, AGREGAR",
    });

    if (result.isConfirmed) {
      setloaderContext(true);
      handleFileUpload(data);
      // try {
      //   const response = await axios.post(
      //     "http://localhost:3000/api/partners",
      //     data
      //   );

      //   const responseUpdate = response.data;
      //   console.log("nuevosPartners", responseUpdate);
      //   setPartners([...partners, responseUpdate]);
      //   setloadingPartner(false);
      //   setloaderContext(false);
      //   toast.success("NUEVO PARTNER AGREGADO");
      //   setSelectedTab(1);
      // } catch (error) {
      //   setloadingPartner(false);
      //   setloaderContext(false);
      //   setchecPartners(false);
      //   console.log(error);
      //   toast.error(error.message);
      // }
    } else {
      setchecPartners(false);
    }
  };

  return (
    <div className="form-container mt-10 flex flex-col items-center bg-[#f3f4f6] w-[350px] lg:w-[1000px]">
      <div className="form-header bg-black text-white w-full h-10 p-2 rounded-tl-md rounded-tr-md">
        NUEVO PARTNER
      </div>
      <button
        onClick={handleTab}
        className=" mt-10 mb-10 bg-red-600 p-1 px-3 rounded-lg text-white shadow-lg"
      >
        CANCELAR
      </button>

      {/* FORM */}
      <form
        onSubmit={onSubmit}
        className=" grid grid-cols-2 md:grid-cols-3 items-center justify-between gap-10 mb-10 p-2"
      >
        {/* primera fila */}
        <div className="flex flex-col">
          <label className="font-semibold">NOMBRE DEL PARTNER</label>
          <input
            // value={`$${datosVentas.precioInicial.toLocaleString()}`}
            type="text"
            className={`border p-2 rounded-md shadow-sm `}
            {...register("partner", { required: true })}
          />
        </div>
        <div className="flex flex-col">
          <label className="font-semibold">FECHA INVERSION INICIAL</label>
          <input
            // value={datosVentas.fechaVenta}
            //  value={moment(datosVentas.fechaVenta).format("YYYY-MM-DD")}
            type="date"
            className="border p-2 rounded-md shadow-sm"
            {...register("fechaInicioInversion", { required: true })}
          />
          {errors.fechaVenta && (
            <p className=" text-red-500">FECHA REQUERIDA</p>
          )}
        </div>
        <div className="flex flex-col">
          <label className="font-semibold">INVERSION INICIAL</label>
          <input
            value={inversionInicial}
            onChange={(e) => {
              handlePrecioChange(e);
            }}
            type="text"
            className={`border p-2 rounded-md shadow-sm `}

            // {...register("precioInicial", { required: true })}
          />
        </div>
        {/* segunda fila */}
        <div className="flex flex-col">
          <label className=" font-medium">TRANSACCION</label>
          <select
            // onChange={(e) => (tipoVentaRef.current = e.target.value)}
            className="border p-2 rounded-md shadow-sm"
            {...register("tipoPago", { required: true })}
          >
            <option value="EFECTIVO">EFECTIVO</option>
            <option value="TRANSFERENCIA">TRANSFERENCIA</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="font-semibold">FECHA CONTRATO VIGENTE</label>
          <input
            // value={datosVentas.fechaVenta}
            //  value={moment(datosVentas.fechaVenta).format("YYYY-MM-DD")}
            type="date"
            className="border p-2 rounded-md shadow-sm"
            {...register("fechaContratoVigente", { required: true })}
          />
          {errors.fechaVenta && (
            <p className=" text-red-500">FECHA REQUERIDA</p>
          )}
        </div>
        <div className="flex flex-col">
          <label className="font-semibold">SUERTE PRINCIPAL</label>
          <input
            value={suertePrincipal}
            onChange={(e) => {
              handleSuertePrincipal(e);
            }}
            type="text"
            className={`border p-2 rounded-md shadow-sm `}

            // {...register("precioInicial", { required: true })}
          />
        </div>
        {/* TERVERA COLUMNA */}
        <div className="flex flex-col">
          <label className="font-semibold">UTILIDAD</label>
          <input
            value={utilidad}
            onChange={(e) => {
              handleUtilidad(e);
            }}
            type="text"
            className={`border p-2 rounded-md shadow-sm `}

            // {...register("precioInicial", { required: true })}
          />
        </div>
        <div className="flex flex-col">
          <label className="font-semibold">TOTAL REEMBOLSO</label>
          <input
            value={`$${reembolso.toLocaleString("es-MX")}`}
            type="text"
            className={` p-2 rounded-md text-white shadow-sm ${
              isDisabledReemboloso ? " bg-green-800" : ""
            }`}
            disabled={isDisabledReemboloso}

            // {...register("precioInicial", { required: true })}
          />
        </div>
        <div className="flex flex-col">
          <label className="font-semibold">TOTAL UTILIDAD</label>
          <input
            value={`$${totalUtilidad.toLocaleString("es-MX")}`}
            type="text"
            className={` p-2 rounded-md text-white shadow-sm ${
              isDisabledReemboloso ? " bg-green-800" : ""
            }`}
            disabled={isDisabledutilidad}

            // {...register("precioInicial", { required: true })}
          />
        </div>
        {/* CUARTA COLUMNA */}
        <div className="flex flex-col">
          <label className="font-semibold">PLAZO</label>
          <input
            // value={`$${datosVentas.precioInicial.toLocaleString()}`}
            type="number"
            className={`border p-2 rounded-md shadow-sm `}
            {...register("plazo", { required: true })}
          />
        </div>
        <div className="flex flex-col">
          <label className="font-semibold">PARCIALIDADES</label>
          <input
            // value={`$${datosVentas.precioInicial.toLocaleString()}`}
            type="number"
            className={`border p-2 rounded-md shadow-sm `}
            {...register("parcialidades", { required: true })}
          />
        </div>
        {/* react dropzone */}

        <div className="flex flex-col cursor-pointer">
          <label className="font-semibold flex items-center gap-2">
            <PiPaperclip />
            ADJUNTAR CONTRATO
          </label>
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
        <div className="flex flex-col md:flex-row items-center gap-5">
          <button
            type="submit"
            className=" bg-yellow-500 text-white px-2 py-2 rounded-full shadow-lg flex  items-center gap-2"
          >
            <PiWarningFill />
            verificar
          </button>
          {guardarButton && (
            <button
              type="submit"
              onClick={() => setchecPartners(true)}
              className="bg-black text-white px-2 py-2 rounded-full shadow-lg flex items-center gap-2"
            >
              Guardar datos
            </button>
          )}
        </div>
      </form>

      {/* TABLA DE FECHAS */}
      <div className="w-[300px] md:w-[950px]">
        {proxPagos.length > 0 ? (
          <table className="w-full mt-4 bg-white  rounded-md shadow-md mb-4 text-center justify-center">
            <thead>
              <tr>
                <th className="border p-2">FECHA PROXIMOS PAGOS</th>
                <th className="border p-2">CANTIDAD</th>
              </tr>
            </thead>
            <tbody className="">
              {proxPagos.map((pago, index) => (
                <tr key={index} className="mt-2 ">
                  <td className="border p-3 text-center">
                    {" "}
                    {moment(pago.fechaParaPago).format("DD-MMM-YYYY ")}
                  </td>
                  <td className="border p-3 text-center">
                    {`$${pago.parcialidades.toLocaleString("es-MX")}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="font-bold text-xl mb-10">PROXIMOS PAGOS.</p>
        )}
      </div>
    </div>
  );
};
