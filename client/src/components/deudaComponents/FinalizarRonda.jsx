import React, { useState, useEffect, useContext } from "react";
import { FaPlus } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import moment from "moment";
import { PartnersContext } from "../../context/PartnersContext";
import { PiWarningFill } from "react-icons/pi";
import Swal from "sweetalert2";
import axios from "axios";
import { Rings } from "react-loader-spinner";
import { toast } from "react-toastify";

export const FinalizarRonda = ({
  partnerInfo,
  partners,
  setPartners,
  corridaIndex,
  setSelectedTab,
  setpartnerInfo,
}) => {
  console.log("nuevaRonda", partnerInfo);
  console.log("corridaIndex", corridaIndex);
  const [partnerEdit, setpartnerEdit] = useState(partnerInfo);
  console.log("corridas", partnerInfo.corridas);
  const [guardarButton, setguardarButton] = useState(false);
  const [proxPagos, setProxPagos] = useState([]);
  const [loadingPartner, setloadingPartner] = useState(false);
  const [corridasPartner, setcorridasPartner] = useState(partnerInfo.corridas);
  const [pagosFinalesPartner, setpagosFinalesPartner] = useState(
    partnerInfo.pagosFinales
  );

  const [inversionInicial, setinversionInicial] = useState(
    partnerEdit.inversionInicial
  );
  const [suertePrincipal, setsuertePrincipal] = useState(
    partnerEdit.suertePrincipal
  );

  const [porcentajeUtilidad, setporcentajeUtilidad] = useState(0);

  const [checPartners, setchecPartners] = useState(false);

  const isDisabledReemboloso = true;
  const isDisabledutilidad = true;

  console.log("inversionInicial", inversionInicial);
  const [reembolso, setReembolso] = useState("");
  const [totalUtilidad, setTotalUtilidad] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const handleTab = () => {
    setSelectedTab(1);
  };

  const onSubmit = handleSubmit((data) => {
    // console.log("formData", data);
    // data.fechaContratoVigente = moment(data.fechaContratoVigente).format(
    //   "YYYY-MM-DD"
    // );
    // data.fechaInicioInversion = moment(data.fechaInicioInversion).format(
    //   "YYYY-MM-DD"
    // );

    data.fechaContratoVigente = moment(data.fechaContratoVigente).toISOString();
    // data.fechaInicioInversion = moment(data.fechaInicioInversion).toISOString();

    const suertePrincipal = parseFloat(
      data.suertePrincipal.replace(/\$|,/g, "")
    );
    // const inversionInicial = parseFloat(
    //   data.inversionInicial.replace(/\$|,/g, "")
    // );
    const porcentajeUtilidad = parseFloat(
      data.porcentajeUtilidad.replace(/\%|,/g, "")
    );

    data.inversionInicial = inversionInicial;
    data.suertePrincipal = suertePrincipal;
    data.porcentajeUtilidad = porcentajeUtilidad;
    // const porcentaje = (suertePrincipal * porcentajeUtilidad) / 100;
    const porcentaje =
      porcentajeUtilidad === 0
        ? 0
        : (suertePrincipal * porcentajeUtilidad) / 100;
    // Suma suertePrincipal y porcentaje
    const total = suertePrincipal + porcentaje;
    const totalReembolzo = inversionInicial + porcentaje;

    data.utilidad = parseFloat(porcentaje);
    data.totalReembolzo = totalReembolzo;
    data.status = true;

    setReembolso(totalReembolzo);
    setTotalUtilidad(porcentaje);
    setguardarButton(true);

    const fechaInicio = moment(data.fechaContratoVigente);
    console.log("fechaInicio", fechaInicio);
    let fechaParcialidad = fechaInicio.clone();
    let pagos = [];
    //
    let pagoFinales = [];
    // corridas = corridasPartner;
    let plazoText = "";

    const plazoMeses = data.plazo;
    const parcialidades = data.parcialidades;
    const utilidad = porcentajeUtilidad;
    const pagoMes = total / parcialidades;
    //let partnerInfo = [];

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

    const fechaFinalizacion = pagos[pagos.length - 1].fechaParaPago;
    console.log("fechaFinlalizacion", fechaFinalizacion);

    // partnerInfo = {
    //   _id: String(Math.random()).replace(".", ""),
    //   ronda: corridasPartner.length,
    //   partner: data.partner,
    //   fechaInversionInicial: data.fechaInicioInversion,
    //   fechaContratoVigente: data.fechaContratoVigente,
    //   tipoPago: data.tipoPago,
    //   suertePrincipal: suertePrincipal,
    //   inversionInicial: inversionInicial,
    //   fechaFinalizacion: fechaFinalizacion,
    //   porcentajeUtilidad: porcentajeUtilidad,
    //   reembolzo: totalReembolzo,
    //   utilidad: data.utilidad,
    //   plazo: data.plazo,
    //   parcialidades: parcialidades,
    //   pagos: pagos,
    //   comentarios: [],
    //   status: true,
    //   check: false,
    // };

    setProxPagos(pagos);

    data.pagosFinales = pagos;

    // console.log("partnerInfo", corridas);
    //console.log("fechaPagos", pagos);
    // console.log("pagosText", plazoText);
    console.log("formData", data);

    if (checPartners) {
      //  setloadingPartner(ture);
      setTimeout(() => {
        setpartnerInfo((prevPartnerInfo) => ({
            ...prevPartnerInfo, // Mantenemos todos los valores actuales del partnerInfo
            pagosFinales: data.pagosFinales // Actualizamos solo el campo pagosFinales
          }));
      }, 500);
    }
  });

  useEffect(() => {
    console.log("partnerInfoActualizado", partnerInfo);
    if(checPartners){
        handlePartner(partnerInfo)
    }
  }, [partnerInfo]);

  const handlePartner = async (data) => {
    const result = await Swal.fire({
      title: `FINALIZAR RONDAS DE ${data.partner}?`,
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, ACTUALIZAR",
    });

    if (result.isConfirmed) {
      setloadingPartner(true);
      try {
        const response = await axios.put(
          `http://localhost:3000/api/partners/${partnerInfo._id}`,
          data
        );

        const updatedPartner = response.data;
        const updatedPartners = partners.map((partner) =>
          partner._id === updatedPartner._id ? updatedPartner : partner
        );

        setPartners(updatedPartners);
        // setPartners([...partners, responseUpdate]);
        setloadingPartner(false);
        toast.success("RONDAS FINALIZADAS");
        setSelectedTab(1);
      } catch (error) {
        setloadingPartner(false);
        setchecPartners(false);
        console.log(error);
        toast.error(error.message);
      }
    } else {
      setchecPartners(false);
    }
  };
  return (
    <div className="form-container mt-10 flex flex-col items-center bg-[#f3f4f6] w-[350px] lg:w-[1000px]">
      <div className="form-header bg-black text-white w-full h-10 p-2 rounded-tl-md rounded-tr-md">
        FINALIZAR RONDA
      </div>
      <h1 className=" font-bold mt-10 text-[15px] md:text-[20px] underline">
        FINALIZAR A {partnerEdit.partner}
      </h1>
      <button
        type="button"
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
            defaultValue={`${partnerEdit.partner}`}
            type="text"
            className={`border p-2 rounded-md shadow-sm `}
            {...register("partner", { required: true })}
          />
        </div>
        {/* <div className="flex flex-col">
          <label className="font-semibold">FECHA INVERSION INICIAL</label>
          <input
            // value={datosVentas.fechaVenta}
            // defaultValue={moment(partnerEdit.fechaInicioInversion).format(
            //   "YYYY-MM-DD"
            // )}
            type="date"
            className="border p-2 rounded-md shadow-sm"
            {...register("fechaInicioInversion", { required: true })}
          />
          {errors.fechaVenta && (
            <p className=" text-red-500">FECHA REQUERIDA</p>
          )}
        </div> */}
        {/* <div className="flex flex-col">
          <label className="font-semibold">INVERSION INICIAL</label>
          <input
            value={`$${inversionInicial.toLocaleString("es-MX")}`}
            type="text"
            className={`border p-2 rounded-md shadow-sm `}
            {...register("inversionInicial", { required: true })}
            onChange={(event) => {
              // Obtener el valor del campo de entrada
              const inputValue = event.target.value;

              // Extraer el valor numérico sin formato eliminando el signo de moneda y las comas
              const numericValue = inputValue.replace(/\$|,/g, "");

              // Actualizar el estado solo si se ha introducido un valor numérico válido o el campo está vacío
              if (numericValue === "" || !isNaN(numericValue)) {
                setinversionInicial(
                  numericValue === "" ? "" : parseInt(numericValue, 10)
                );
              }
            }}
          />
        </div> */}
        {/* segunda fila */}
        <div className="flex flex-col">
          <label className=" font-medium">TRANSACCION</label>

          <select
            defaultValue={partnerEdit.tipoPago}
            className="border p-2 rounded-md shadow-sm"
            {...register("tipoPago", { required: true })}
          >
            <option value="EFECTIVO">EFECTIVO</option>
            <option value="TRANSFERENCIA">TRANSFERENCIA</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="font-semibold">FECHA ACTUAL</label>
          <input
            // defaultValue={moment(partnerEdit.fechaContratoVigente).format(
            //   "YYYY-MM-DD"
            // )}
            type="date"
            className="border p-2 rounded-md shadow-sm"
            {...register("fechaContratoVigente", { required: true })}
          />
          {errors.fechaContratoVigente && (
            <p className=" text-red-500">FECHA REQUERIDA</p>
          )}
        </div>
        <div className="flex flex-col">
          <label className="font-semibold">INVERSION</label>
          <input
            value={`$${suertePrincipal.toLocaleString("es-MX")}`}
            type="text"
            className={`border p-2 rounded-md shadow-sm `}
            {...register("suertePrincipal", { required: true })}
            onChange={(event) => {
              // Obtener el valor del campo de entrada
              const inputValue = event.target.value;

              // Extraer el valor numérico sin formato eliminando el signo de moneda y las comas
              const numericValue = inputValue.replace(/\$|,/g, "");

              // Actualizar el estado solo si se ha introducido un valor numérico válido o el campo está vacío
              if (numericValue === "" || !isNaN(numericValue)) {
                setsuertePrincipal(
                  numericValue === "" ? "" : parseInt(numericValue, 10)
                );
              }
            }}
          />
        </div>
        {/* TERVERA COLUMNA */}
        <div className="flex flex-col">
          <label className="font-semibold">PORCENTAJE UTILIDAD</label>
          <input
            value={`%${porcentajeUtilidad}`}
            type="text"
            className={`border p-2 rounded-md shadow-sm `}
            {...register("porcentajeUtilidad", { required: true })}
            onChange={(event) => {
              // Obtener el valor del campo de entrada
              const inputValue = event.target.value;

              // Extraer el valor numérico sin formato eliminando el signo de moneda y las comas
              const numericValue = inputValue.replace(/\%|,/g, "");

              // Actualizar el estado solo si se ha introducido un valor numérico válido o el campo está vacío
              if (numericValue === "" || !isNaN(numericValue)) {
                setporcentajeUtilidad(
                  numericValue === "" ? "" : parseInt(numericValue, 10)
                );
              }
            }}
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

            // {...register("totalReembolzo", { required: true })}
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

            // {...register("utilidad", { required: true })}
          />
        </div>
        {/* CUARTA COLUMNA */}
        <div className="flex flex-col">
          <label className="font-semibold">PLAZO</label>
          <input
            // defaultValue={`${partnerEdit.plazo}`}
            type="number"
            className={`border p-2 rounded-md shadow-sm `}
            {...register("plazo", { required: true })}
          />
        </div>
        <div className="flex flex-col">
          <label className="font-semibold">PARCIALIDADES</label>
          <input
            // defaultValue={`${partnerEdit.parcialidades}`}
            type="number"
            className={`border p-2 rounded-md shadow-sm `}
            {...register("parcialidades", { required: true })}
          />
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
              FINALIZAR RONDAS
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
