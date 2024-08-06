import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { JuridicoContext } from "../../context/JuridicoContext";
import { useForm } from "react-hook-form";

export const DatosGenerales = ({ id }) => {
  const { juridico, setJuridico } = useContext(JuridicoContext);
  const [datosJuridico, setdatosJuridico] = useState(juridico);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...datosJuridico,
      fondo: datosJuridico.fondo
        ? `$${datosJuridico.fondo.toLocaleString("es-MX")}`
        : "",
    },
  });

  console.log("juridicoDataFromCOntext", juridico);

  const [checkJuridico, setCheckJuridico] = useState(false);

  const [loading, setLoading] = useState(false);
  const [gastos, setGastos] = useState(0);

  const isDisabledAcreditado = true;
  const isDisabledCesionario = true;
  const isDisabledFondos = false;
  const isDisabledGastos = true;

  console.log("datosGeneralesData", datosJuridico);

  //UPDATE INFORMATION
  const handleUpdate1 = async (data) => {
    // e.preventDefault();
    setLoading(true);

    try {
      // Actualizar los datos en el servidor
      const responseUpdate = await axios.put(
        `http://localhost:3000/api/juridicoData/${datosJuridico._id}`,
        data
      );

      // Volver a obtener los datos del servidor después de la actualización
      const response = await axios.get(
        `http://localhost:3000/api/juridicoData/${id}`
      );
      const nuevosDatos = await responseUpdate.data;
      // Actualizar el contexto con los nuevos datos
     // setJuridico(response.data[0]);
      setJuridico(nuevosDatos);

      setLoading(false);
      toast.success("DATOS GENERALES ACTUALIZADOS");
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.message);
    }
  };

  const calcularFondoRestante = (data) => {
    // Calcula la suma de precios en gastosLista con status igual a true
    console.log("datosCalculos", data)
    const sumaPrecios = data.gastosLista
      .filter((gasto) => gasto.status === true)
      .reduce((total, gasto) => total + gasto.precio, 0);

    console.log("sumaGastos", sumaPrecios);

    setGastos(sumaPrecios);
  };

  const handleFondosChange = (event) => {
    console.log(event.target.value.replace(/[^0-9$]/g, ""));
    // Eliminar caracteres no numéricos
    const inputGastos = event.target.value.replace(/[^0-9$]/g, "");
    const inputPrecio = inputGastos.replace(/[^0-9]/g, ""); // Aplicar la misma manipulación aquí

    console.log("eventFondo", inputGastos);

    // Formatear con comas
    const formattedGastos = inputGastos.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Agregar el símbolo de peso solo si el campo está vacío o si el último carácter es un símbolo de peso
    const gastosWithSymbol =
      inputGastos === "" || inputGastos.slice(-1) === "$"
        ? inputGastos
        : `$${formattedGastos}`;

    // Actualizar el estado del saldo de gastos
    setdatosJuridico((prevDatosJuridico) => ({
      ...prevDatosJuridico,
      fondo: formattedGastos, // Utiliza inputGastos en lugar de formattedGastos
    }));

    setValue("fondo", "10000000");
  };

  const handlePrecioChange = (event) => {
    const inputPrecio = event.target.value.replace(/[^0-9]/g, "");
    const formattedPrecio = inputPrecio.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setValue("fondo", formattedPrecio ? `$${formattedPrecio}` : "");
  };

  const onSubmit = handleSubmit(async (data) => {
    // Convertir campos numéricos a números
    data.acreditado = datosJuridico.acreditado;
    data.cesionario = datosJuridico.cesionario;
    const cleanedValue = data.fondo.replace(/[$,]/g, ""); // Remove $ and ,
    const numberValue = Number(cleanedValue);
    data.fondo = numberValue;

   setCheckJuridico(true)

    console.log("formData", data);
    setdatosJuridico(data)
    
  });

  useEffect(() => {
   
    const newdata = datosJuridico
    calcularFondoRestante(newdata);
    if (checkJuridico) {
      handleUpdate1(newdata);
    }
   
  }, [datosJuridico]);

  return (
    <div className="form-container mt-10 flex flex-col items-center w-screen p-1 lg:w-[1000px] max-w-[1500px] bg-[#f3f4f6]">
      <div className="form-header bg-black  text-white w-full h-10 p-2 rounded-tl-md rounded-tr-md">
        DATOS GENERALES
      </div>

      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-2 items-center justify-between gap-5  lg:grid-cols-3 lg:gap-4  p-6 w-full lg:w-[1000px] md:w-[800px]">
          <div className="flex flex-col">
            <label className="font-semibold text-[11px] lg:text-[15px]">
              ENCARGADO DEL PROCESO
            </label>
            <select
              {...register("encargadoProceso", { required: true })}
              defaultValue={datosJuridico.encargadoProceso}
              // onChange={(e) => {
              //   setdatosJuridico((prevDatosJuridico) => ({
              //     ...prevDatosJuridico,
              //     encargadoProceso: e.target.value,
              //   }));
              //   // setValue("encargadoProceso", e.target.value);
              // }}
              className="border p-2 rounded-md shadow-sm"
            >
              <option value="N/A">N/A</option>
              <option value="SERGIO VILLA">SERGIO VILLA</option>
              <option value="NANCY ACOSTA">NANCY ACOSTA</option>
              <option value="ALFREDO MARINEZ">ALFREDO MARINEZ</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="font-semibold text-[11px] lg:text-[15px]">
              EXPEDIENTE
            </label>
            <input
              {...register("expediente", { required: true })}
              defaultValue={datosJuridico.expediente}
              // value={datosJuridico.expediente}

              type="text"
              // onChange={(e) => {
              //   setdatosJuridico((prevDatosJuridico) => ({
              //     ...prevDatosJuridico,
              //     expediente: e.target.value,
              //   }));
              //   setValue("expediente", e.target.value);
              // }}
              // onChange={(e) => (numExteriorRef.current = e.target.value)}
              className="border p-2 rounded-md shadow-sm"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold text-[11px] lg:text-[15px]">
              JUZGADO
            </label>
            <input
              {...register("juzgado", { required: true })}
              defaultValue={datosJuridico.juzgado}
              type="text"
              // onChange={(e) => (numInteriorRef.current = e.target.value)}
              // onChange={(e) => {
              //   setdatosJuridico((prevDatosJuridico) => ({
              //     ...prevDatosJuridico,
              //     juzgado: e.target.value,
              //   }));
              //   setValue("juzgado", e.target.value);
              // }}
              className="border p-2 rounded-md shadow-sm"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold text-[11px] lg:text-[15px]">
              NOMBRE ACREDITADO
            </label>
            <input
              value={datosJuridico.acreditado}
              type="text"
              className={`border p-2 rounded-md shadow-sm ${
                isDisabledAcreditado ? "bg-gray-200" : ""
              }`}
              disabled={isDisabledAcreditado}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold text-[11px] lg:text-[15px]">
              NUMERO EXPEDIENTE
            </label>
            <input
              {...register("numExpediente", { required: true })}
              defaultValue={datosJuridico.numExpediente}
              type="text"
              //  onChange={(e) => (codigoPostalRef.current = e.target.value)}
              // onChange={(e) => {
              //   setdatosJuridico((prevDatosJuridico) => ({
              //     ...prevDatosJuridico,
              //     numExpediente: e.target.value,
              //   }));
              //   setValue("numExpediente", e.target.value);
              // }}
              className="border p-2 rounded-md shadow-sm"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold text-[11px] lg:text-[15px]">
              NUMERO CESION
            </label>
            <input
              {...register("cesion", { required: true })}
              defaultValue={datosJuridico.cesion}
              //  onChange={handlePrecioChange}
              // onChange={(e) => {
              //   setdatosJuridico((prevDatosJuridico) => ({
              //     ...prevDatosJuridico,
              //     cesion: e.target.value,
              //   }));
              //   setValue("cesion", e.target.value);
              // }}
              type="text"
              className="border p-2 rounded-md shadow-sm"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-[11px] lg:text-[15px]">
              NOMBRE DEL CESIONARIO
            </label>
            <input
              value={datosJuridico.cesionario}
              //  onChange={handlePrecioChange}
              onChange={(e) => {
                setdatosJuridico((prevDatosJuridico) => ({
                  ...prevDatosJuridico,
                  cesionario: e.target.value,
                }));
                setValue("cesionario", e.target.value);
              }}
              type="text"
              className={`border p-2 rounded-md shadow-sm ${
                isDisabledCesionario ? "bg-gray-200" : ""
              }`}
              disabled={isDisabledCesionario}
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-[11px] lg:text-[15px]">
              PROCESO
            </label>
            <select
              {...register("proceso", { required: true })}
              defaultValue={datosJuridico.proceso}
              // onChange={(e) => (tipoVentaRef.current = e.target.value)}
              // onChange={(e) => {
              //   setdatosJuridico((prevDatosJuridico) => ({
              //     ...prevDatosJuridico,
              //     proceso: e.target.value,
              //   }));
              //   setValue("proceso", e.target.value);
              // }}
              className="border p-2 rounded-md shadow-sm"
            >
              <option value="EXTRAJUDICIAL">EXTRAJUDICIAL</option>
              <option value="JUDICIAL">JUDICIAL</option>
              <option value="CONCLUIDO">CONCLUIDO</option>
              <option value="N/A">N/A</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-[11px] lg:text-[15px]">
              TIPO DE JUICIO
            </label>
            <select
              {...register("juicio", { required: true })}
              defaultValue={datosJuridico.juicio}
              // onChange={(e) => (tipoVentaRef.current = e.target.value)}
              // onChange={(e) => {
              //   setdatosJuridico((prevDatosJuridico) => ({
              //     ...prevDatosJuridico,
              //     juicio: e.target.value,
              //   }));
              //   setValue("juicio", e.target.value);
              // }}
              className="border p-2 rounded-md shadow-sm"
            >
              <option value="N/A">N/A</option>
              <option value="ORAL CIVIL">ORAL CIVIL</option>
              <option value="ESPECIAL HIPOTECARIO">ESPECIAL HIPOTECARIO</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-[11px] lg:text-[15px]">
              JURISDICCION
            </label>
            <select
              {...register("jurisdiccion", { required: true })}
              defaultValue={datosJuridico.jurisdiccion}
              // onChange={(e) => (tipoVentaRef.current = e.target.value)}
              // onChange={(e) => {
              //   setdatosJuridico((prevDatosJuridico) => ({
              //     ...prevDatosJuridico,
              //     jurisdiccion: e.target.value,
              //   }));
              //   setValue("jurisdiccion", e.target.value);
              // }}
              className="border p-2 rounded-md shadow-sm"
            >
              <option value="CHIHUAHUA">CHIHUAHUA</option>
              <option value="CIUDAD JUAREZ">CIUDAD JUAREZ</option>
              <option value="HERMOSILLO">HERMOSILLO</option>
              <option value="N/A">N/A</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-[11px] lg:text-[15px]">
              ESTATUS PROCESAL
            </label>
            <select
              {...register("estatusProcesal", { required: true })}
              defaultValue={datosJuridico.estatusProcesal}
              // onChange={(e) => (tipoVentaRef.current = e.target.value)}
              // onChange={(e) => {
              //   setdatosJuridico((prevDatosJuridico) => ({
              //     ...prevDatosJuridico,
              //     estatusProcesal: e.target.value,
              //   }));
              //   setValue("estatusProcesal", e.target.value);
              // }}
              className="border p-2 rounded-md shadow-sm"
            >
              <option value="FIRMA CESION">FIRMA CESION</option>
              <option value="CESION ENTREGADA">CESION ENTREGADA</option>
              <option value="APERSONAMIENTO">APERSONAMIENTO</option>
              <option value="N/A">N/A</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-[11px] lg:text-[15px]">
              FONDO GASTOS
            </label>
            <input
              // value={datosJuridico.fondo.toLocaleString()}
              {...register("fondo", { required: true })}
              //  onChange={handlePrecioChange}
              // onChange={(e) => {
              //   handleFondosChange(e);
              // }}
              onChange={handlePrecioChange}
              type="text"
              className={` p-2 rounded-md shadow-sm ${
                isDisabledGastos ? "bg-green-200" : ""
              }`}
              disabled={isDisabledFondos}
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-[11px] lg:text-[15px]">
              GASTOS
            </label>
            <input
              value={`$${gastos.toLocaleString("es-MX")}`}
              // {...register("gastos", { required: true })}
              //  onChange={handlePrecioChange}
              // onChange={handleGastosChange}
              type="text"
              className={` p-2 rounded-md shadow-sm ${
                isDisabledGastos ? "bg-yellow-200" : ""
              }`}
              disabled={isDisabledGastos}
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-[11px] lg:text-[15px]">
              REGISTRO Y GRAVAMEN
            </label>
            <textarea
              {...register("gravamen", { required: true })}
              defaultValue={datosJuridico.gravamen}
              // onChange={handlePrecioChange}
              // onChange={(e) => {
              //   setdatosJuridico((prevDatosJuridico) => ({
              //     ...prevDatosJuridico,
              //     gravamen: e.target.value,
              //   }));
              //   setValue("gravamen", e.target.value);
              // }}
              className="border p-2 rounded-md shadow-sm"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-[11px] lg:text-[15px]">
              EXTRAJUDICIAL DEUDOR
            </label>
            <textarea
              {...register("extrajudicial", { required: true })}
              defaultValue={datosJuridico.extrajudicial}
              // onChange={handlePrecioChange}
              // onChange={(e) => {
              //   setdatosJuridico((prevDatosJuridico) => ({
              //     ...prevDatosJuridico,
              //     extrajudicial: e.target.value,
              //   }));
              //   setValue("extrajudicial", e.target.value);
              // }}
              className="border p-2 rounded-md shadow-sm"
            />
          </div>

          <div>
            <button className="bg-black text-white px-4 py-2 rounded">
              GUARDAR
            </button>
          </div>

          {/* Agrega los demás campos del primer formulario */}
        </div>
      </form>
    </div>
  );
};
