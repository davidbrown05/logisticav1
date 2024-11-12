import React, { useState, useRef, useEffect, useContext } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { Rings } from "react-loader-spinner";
import { InmuebleContext } from "../../context/InmuebleContext";

export const CreatePropBackend = () => {
    const { inmuebles, loadingInmuebles, setInmuebles } =
    useContext(InmuebleContext);
  const [precio, setPrecio] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const [file, setFile] = useState(undefined);
  // const [defaultFile, setDefaultFile] = useState("noImage.jpg");
  // const [defaultFile, setDefaultFile] = useState(
  //   "https://res-console.cloudinary.com/ddjajfmtw/thumbnails/v1/image/upload/v1720735461/d2w1YmM2eHpnYnYzZWxsN3BiYng=/drilldown"
  // );
  const [defaultFile, setDefaultFile] = useState(
    "https://res.cloudinary.com/ddjajfmtw/image/upload/v1720735461/wl5bc6xzgbv3ell7pbbx.jpg"
  );
  const [fileChanged, setFileChanged] = useState(false);
  const [fileName, setFileName] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [loadingUpload, setloadingUpload] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const handleStateChange = (event) => {
    // Actualizar el estado seleccionado y resetear la ciudad seleccionada
    setSelectedState(event.target.value);
    // setEstado(event.target.value);
    setValue("estado", event.target.value);
    setSelectedCity("");
  };

  const handleCityChange = (event) => {
    // Actualizar la ciudad seleccionada
    setSelectedCity(event.target.value);
    // setCiudad(event.target.value);
    setValue("ciudad", event.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log("nuevaImagen", file);
    setFileName(file);
    setDefaultFile(URL.createObjectURL(file));
    setFileChanged(true);
  };

  // Define constantes para estados y ciudades
  const estados = [
    "Aguascalientes",
    "Baja California",
    "Baja California Sur",
    "Campeche",
    "Chiapas",
    "Chihuahua",
    "Coahuila",
    "Colima",
    "Durango",
    "Estado de México",
    "Guanajuato",
    "Guerrero",
    "Hidalgo",
    "Jalisco",
    "Michoacán",
    "Morelos",
    "Nayarit",
    "Nuevo León",
    "Oaxaca",
    "Puebla",
    "Querétaro",
    "Quintana Roo",
    "San Luis Potosí",
    "Sinaloa",
    "Sonora",
    "Tabasco",
    "Tamaulipas",
    "Tlaxcala",
    "Veracruz",
    "Yucatán",
    "Zacatecas",
  ]; // Agrega más estados según sea necesario

  const contacto = [
    "ALEJANDRA GORDILLO",
    "ALEJANDRO DOMINGUEZ",
    "ANA TORRES",
    "ARACELI MARTINEZ",
    "ARTURO VELAZQUEZ",
    "CARLOS QUEJEIRO",
    "CARLOS QUEJEIRO",
    "CARLOS SAUCEDO",
    "CARLOS SAUCEDO",
  ]

  const ciudadesPorEstado = {
    Chihuahua: ["Ciudad Chihuahua", "Ciudad Juárez"],
    Sonora: ["Hermosillo", "Guaymas"],
    Sinaloa: ["Culiacán", "Mazatlán"],
    // Agrega más ciudades según sea necesario
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
    setPrecio(formattedPrecio);
    setValue("precio", inputPrecio);
  };

  const onSubmit = handleSubmit(async (data) => {
    setloadingUpload(true);
    // Convertir campos numéricos a números
    data.numExterior = parseInt(data.numExterior);
    data.numInterior = parseInt(data.numInterior);
    data.codigoPostal = parseInt(data.codigoPostal);
    data.precio = parseFloat(data.precio);
    data.metrosTerreno = parseFloat(data.metrosTerreno);
    data.numRecamaras = parseInt(data.numRecamaras);
    data.numBanos = parseInt(data.numBanos);

    data.juridicoJur = false;
    data.juridicoadmin = false;
    data.juridicoDir = false;

    //campos adicionales
    data.estatusVenta = "PENDIENTE";
    data.comprador = "INDEFINIDO";
    data.formaPago = "INDEFINIDO";
    

    data.direccion = `${data.direccion} Num Ext: ${data.numExterior} Num Int: ${data.numInterior}`;
    console.log("formData", data);

    // handleFileUpload(fileName, data);

    if (fileChanged) {
      data.foto = fileName.name;
      handleFileUpload(fileName, data);
    } else {
      data.foto = defaultFile;
      data.assetid = "";
      handleSubmitProperty(data);
    }
  });

  const handleSubmitProperty = async (data) => {
    try {
      setisLoading(true);
      const response = await axios.post(
        "http://localhost:3000/api/products",
        data
      );
      // Obtener el _id de la propiedad recién creada
      const responseInmueble = response.data;
      const propertyId = response.data._id;
      const precioInicial = response.data.precio;
      console.log("propertyId", propertyId);
      //DATOS DE JURIDICO
      const datosJuridico = {
        propertyId: propertyId,
        encargadoProceso: "N/A",
        expediente: "N/A",
        juzgado: "N/A",
        acreditado: "N/A",
        numExpediente: "N/A",
        cesion: "N/A",
        cesionario: "N/A",
        proceso: "N/A",
        juicio: "N/A",
        jurisdiccion: "N/A",
        estatusProcesal: "N/A",
        gastos: 0,
        fondo: 0,
        gravamen: "N/A",
        extrajudicial: "N/A",
        observacionesJuridicas: [],
        documentosLista: [],
        tareasLista: [],
        direccion: false,
        administracion: false,
        juridico: false,
        user_dir: "N/A",
        user_admin: "N/A",
        user_Juridico: "N/A",
        obvDir: "N/A",
        obvAdmin: "N/A",
        obvJuridicas: "N/A",
        assetid: "",
      };

      // Crear automáticamente un documento en la colección "Juridico" con el mismo _id
      await axios.post(`http://localhost:3000/api/juridicoData`, datosJuridico);

      //DATOS DE VENTA
      console.log("preioInicial", precioInicial);
      const datosVenta = {
        propertyId: propertyId,
        tipoVenta: "N/A",
        asesor: "N/A",
        comprador: "N/A",
        moneda: "N/A",
        precioInicial: precioInicial,
        precioFinal: 0,
        formaPago: "N/A",
        estatusVenta: "N/A",
        documentosVenta: [],
      };

      // Crear automáticamente un documento en la colección "ventas" con el mismo _id
      await axios.post(`http://localhost:3000/api/ventasData`, datosVenta);

      //DATOS DE PAGOS Y ADEUDOS
      const datosPagos = {
        propertyId: propertyId,
        comprador: "N/A",
        montoTotal: 0,
        montoTotalEmpresa: 0,
        observacionesLista: [],
        pagosLista: [],
        calendarioLista: [],
        adeudosLista: [],
        empresaLista: [],
      };

      await axios.post(`http://localhost:3000/api/pagosData`, datosPagos);

      //DATOS DE PAGOS Y ADEUDOS
      const datosAdeudos = {
        propertyId: propertyId,
        adeudoLista: [],
      };

      await axios.post(`http://localhost:3000/api/adeudosData`, datosAdeudos);

      //DATOS PROPERTY DEUDA
      const datosPropertyDeuda = {
        propertyId: propertyId,
        deudaLista: [],
        montoTotal: 0,
        direccion: "N/A",
        empresa: "N/A",
        contacto: "N/A",
      };

      await axios.post(
        `http://localhost:3000/api/propertyDeudaData`,
        datosPropertyDeuda
      );

      //DATOS COMISIONES
      const datosComisiones = {
        propertyId: propertyId,
        porcentajeComision: 0,
        montoTotal: 0,
        saldo: 0,
        localizacion: "N/A",
        empresa: "N/A",
        contacto: "N/A",
        telefono: "N/A",
        valorEmpresa: "N/A",
        empresaLista: [],
        juridicoLista: [],
        otrosLista: [],
        observacionesLista: [],
      };

      await axios.post(
        `http://localhost:3000/api/comisionesData`,
        datosComisiones
      );

      setInmuebles([...inmuebles, responseInmueble]);

      toast.success("NUEVA PROPIEDAD AGREGADA");
      setisLoading(false);
      setloadingUpload(false);
      navigate("/inventario");
    } catch (error) {
      toast.error(error.message);
      setisLoading(false);
      setloadingUpload(false);
    }
  };

  const handleFileUpload = async (archivo, data) => {
    const formData = new FormData();
    formData.append("file", archivo);
    formData.append("upload_preset", "gpfngq7n");
    formData.append("api_key", "646432361532954");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/ddjajfmtw/image/upload",
        { method: "POST", body: formData }
      );
      

      const dataImagen = await res.json();
      console.log("datosImagen", dataImagen);
      // Actualizar el estado de foto en data con la URL de descarga
      data.foto = dataImagen.secure_url;
      data.assetid = dataImagen.public_id;
      console.log("formData:", data);
      handleSubmitProperty(data);
    } catch (error) {
      // Manejar errores al obtener la URL de descarga
      console.error("Error al obtener la URL de descarga:", error);
    }
  };

  // useEffect(() => {
  //   if (file) {
  //     handleFileUpload(file);
  //   }
  // }, [file]);

  return (
    <>
      <form onSubmit={onSubmit} className=" p-2">
        <div className="form-container mt-10 flex flex-col items-center  ">
          <div className="form-header bg-black  text-white w-full lg:w-[1000px] h-10 p-2 rounded-tl-md rounded-tr-md">
            DIRECCION
          </div>
          <div className="grid grid-cols-2 items-center justify-between gap-5  lg:grid-cols-3 lg:gap-4 bg-[#f3f4f6] p-6 w-full lg:w-[1000px]">
            <div className="flex flex-col ">
              <label className="text-[15px]">DIRECCION</label>
              <input
                type="text"
                // onChange={(e) => (direccionRef.current = e.target.value)}
                className="border p-2 rounded-md shadow-sm"
                {...register("direccion", { required: true })}
              />
            </div>
            <div className="flex flex-col ">
              <label className=" text-[15px]">NUM EXTERIOR</label>
              <input
                type="text"
                //onChange={(e) => (numExteriorRef.current = e.target.value)}
                className="border p-2 rounded-md shadow-sm"
                {...register("numExterior", { required: true })}
              />
            </div>
            <div className="flex flex-col  ">
              <label className="text-[15px]">NUM INTERIOR</label>
              <input
                type="text"
                //  onChange={(e) => (numInteriorRef.current = e.target.value)}
                className="border p-2 rounded-md shadow-sm"
                {...register("numInterior", { required: true })}
              />
            </div>
            <div className="flex flex-col ">
              <label className="text-[15px]">COLONIA</label>
              <input
                type="text"
                //  onChange={(e) => (coloniaRef.current = e.target.value)}
                className="border p-2 rounded-md shadow-sm"
                {...register("colonia", { required: true })}
              />
            </div>
            <div className="flex flex-col  ">
              <label className="text-[15px]">CODIGO POSTAL</label>
              <input
                type="text"
                // onChange={(e) => (codigoPostalRef.current = e.target.value)}
                className="border p-2 rounded-md shadow-sm"
                {...register("codigoPostal", { required: true })}
              />
            </div>
            <div className="flex flex-col  ">
              <label className="text-[15px]">PRECIO INICIAL</label>
              <input
                value={precio}
                onChange={(e) => {
                  handlePrecioChange(e);
                }}
                type="text"
                className="border p-2 rounded-md shadow-sm"
                // {...register("precioInicial", { required: true })}
              />
            </div>
            <div className="flex flex-col ">
              <label className="text-[15px]">ESTADO</label>
              <select
                value={selectedState}
                onChange={handleStateChange}
                className="border p-2 rounded-md shadow-sm"
              >
                {estados.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col  ">
              <label className="text-[15px]">TIPO DE VENTA</label>
              <select
                // onChange={(e) => (tipoVentaRef.current = e.target.value)}
                className="border p-2 rounded-md shadow-sm"
                {...register("tipoVenta", { required: true })}
              >
                <option value="CAPTACION">CAPTACION</option>
                <option value="CESION DE DERECHO">CESION DE DERECHO</option>
                <option value="CREDITO FOVISSSTE">CREDITO FOVISSSTE</option>
                <option value="CREDITO INFONAVIT">CREDITO INFONAVIT</option>
                <option value="DERECHOS ADJUDICATORIOS">
                  DERECHOS ADJUDICATORIOS
                </option>
                <option value="DERECHOS DE CREDITO">DERECHOS DE CREDITO</option>
                <option value="DOBLE ESCRITURA">DOBLE ESCRITURA</option>
                <option value="EMPRESA CLIENTE">EMPRESA CLIENTE</option>
                <option value="ESCRITURA">ESCRITURA</option>
                <option value="NO VIABLE">NO VIABLE</option>
                <option value="PARTNERS">PARTNERS</option>
                <option value="PENDIENTE">PENDIENTE</option>
                <option value="PROMESA DE CESION DE DERECHOS ZENDERE">PROMESA DE CESION DE DERECHOS ZENDERE</option>
                <option value="REMATE JUDICIAL">REMATE JUDICIAL</option>
                <option value="RENTA">RENTA</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-[15px]">TIPO DE INMUEBLE</label>
              <select
                //  onChange={(e) => (tipoInmuebleRef.current = e.target.value)}
                className="border p-2 rounded-md shadow-sm"
                {...register("tipoInmueble", { required: true })}
              >
                <option value="CASA">CASA</option>
                <option value="DEPARTAMENTO">DEPARTAMENTO</option>
                <option value="BODEGA">BODEGA</option>
                <option value="EDIFICIO">EDIFICIO</option>
                <option value="HOTEL">HOTEL</option>
                <option value="NO VIABLE">NO VIABLE</option>
                <option value="PARTNERS">PARTNERS</option>
                <option value="TERRENO">TERRENO</option>
              </select>
            </div>
            <div className="flex flex-col ">
              <label className="text-[15px]">CIUDAD</label>
              <select
                disabled={!selectedState}
                value={selectedCity}
                onChange={handleCityChange}
                className="border p-2 rounded-md shadow-sm"
              >
                <option value="" disabled>
                  Seleccione una ciudad
                </option>
                {selectedState &&
                  ciudadesPorEstado[selectedState].map((ciudad) => (
                    <option key={ciudad} value={ciudad}>
                      {ciudad}
                    </option>
                  ))}
              </select>
            </div>
            {/* Agrega los demás campos del primer formulario */}
          </div>
          <div className="form-header bg-black  text-white w-full lg:w-[1000px] h-10 p-2 rounded-tl-md rounded-tr-md">
            DESCRIPCION
          </div>
          <div className="grid grid-cols-2 items-center  lg:grid-cols-3 gap-4 bg-[#f3f4f6] p-6 w-full lg:w-[1000px]">
            <div className="flex flex-col">
              <label>METROS TERRENO</label>
              <input
                // onChange={(e) => (metrosTerrenoRef.current = e.target.value)}
                type="text"
                className="border p-2 rounded-md shadow-sm"
                {...register("metrosTerreno", { required: true })}
              />
            </div>
            <div className="flex flex-col ">
              <label className=" text-[15px]">NUMERO DE RECAMARAS</label>
              <select
                //  onChange={(e) => (numRecamarasRef.current = e.target.value)}
                className="border p-2 rounded-md shadow-sm"
                {...register("numRecamaras", { required: true })}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="MAS DE 5">MAS DE 5</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label>NUMERO DE BAÑOS</label>
              <select
                // onChange={(e) => (numBanosRef.current = e.target.value)}
                className="border p-2 rounded-md shadow-sm"
                {...register("numBanos", { required: true })}
              >
                <option value="1">1</option>
                <option value="1.5">1.5</option>
                <option value="2">2</option>
                <option value="2.5">2.5</option>
                <option value="3">3</option>
                <option value="MAS DE 3">MAS DE 3</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label>NIVEL</label>
              <select
                //  onChange={(e) => (nivelRef.current = e.target.value)}
                className="border p-2 rounded-md shadow-sm"
                {...register("nivel", { required: true })}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label>ESTATUS INMUEBLE</label>
              <select
                //  onChange={(e) => (estatusInmuebleRef.current = e.target.value)}
                className="border p-2 rounded-md shadow-sm"
                {...register("estatusInmueble", { required: true })}
              >
                <option value="HABITADA">HABITADA</option>
                <option value="DEHABITADA">DEHABITADA</option>
                <option value="INVADIDA">INVADIDA</option>
                <option value="PENDIENTE">PENDIENTE</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label>ESTATUS JURIDICO</label>
              <select
                //  onChange={(e) => (estatusJuridicoRef.current = e.target.value)}
                className="border p-2 rounded-md shadow-sm"
                {...register("estatusJuridico", { required: true })}
              >
                <option value="ESCRITURADA">ESCRITURADA</option>
                <option value="ADJUDICACION">ADJUDICACION</option>
                <option value="DACION">DACION</option>
                <option value="CESION DE DERECHO">CESION DE DERECHO</option>
                <option value="SIN ESCRITURAR">SIN ESCRITURAR</option>
                <option value="DOBLE ESCRITURACION">DOBLE ESCRITURACION</option>
                <option value="ADJUDICADA DOBLE ESCRITURA">ADJUDICADA DOBLE ESCRITURA</option>
                <option value="DERECHO ADJUDICATORIO SIN POSESION">DERECHO ADJUDICATORIO SIN POSESION</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label>CONTACTO</label>
              <select
                // onChange={(e) => (contactoRef.current = e.target.value)}
                className="border p-2 rounded-md shadow-sm"
                {...register("contacto", { required: true })}
              >
                <option value="SERGIO VILLA">SERGIO VILLA</option>
                <option value="ALEJANDRO DOMINGUEZ">ALEJANDRO DOMINGUEZ</option>
                <option value="DAVID CASTILLO">DAVID CASTILLO</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label>LLAVES</label>
              <select
                //  onChange={(e) => (llavesRef.current = e.target.value)}
                className="border p-2 rounded-md shadow-sm"
                {...register("llaves", { required: true })}
              >
                <option value="SI">SI</option>
                <option value="NO">NO</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label>VISITADA</label>
              <select
                //onChange={(e) => (visitadaRef.current = e.target.value)}
                className="border p-2 rounded-md shadow-sm"
                {...register("visitada", { required: true })}
              >
                <option value="SI">SI</option>
                <option value="NO">NO</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label>EMPRESA</label>
              <select
                // onChange={(e) => (empresaRef.current = e.target.value)}
                className="border p-2 rounded-md shadow-sm"
                {...register("empresa", { required: true })}
              >
                <option value="LOGISTICA INMOBILIARIA">
                  LOGISTICA INMOBILIARIA
                </option>
                <option value="SANTANDER">SANTANDER</option>
                <option value="GRUPO FINANCIERO BBVA">
                  GRUPO FINANCIERO BBVA
                </option>
              </select>
            </div>
            <div className="flex flex-col">
              <label>FOLIO EMPRESA</label>
              <input
                //   onChange={(e) => (folioEmpresaRef.current = e.target.value)}
                type="text"
                className="border p-2 rounded-md shadow-sm"
                {...register("folioEmpresa", { required: true })}
              />
            </div>
            <div className="flex flex-col">
              <label>NOMBRE ACREDITADO</label>
              <input
                // onChange={(e) => (nombreAcreditadoRef.current = e.target.value)}
                type="text"
                className="border p-2 rounded-md shadow-sm"
                {...register("nombreAcreditado", { required: true })}
              />
            </div>
            {/* CAMPOS EXISTENTES */}

            {/* BOTONES DE ACCION */}
            <div className=" flex flex-col md:flex-row md:w-[1000px] xl:flex-row xl:w-[1000px] mt-10 gap-5 w-[300px]  mx-auto">
              <div className=" flex flex-col items-center">
                <div className="flex flex-col ">
                  <input
                    // onChange={(e) => setDefaultFile(e.target.files[0])}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="fileInput"
                  />
                  <label
                    htmlFor="fileInput"
                    className="bg-blue-400 text-white px-4 py-2 rounded cursor-pointer"
                  >
                    Cargar Imagen
                  </label>
                </div>
                {defaultFile && ( // Renderizar la imagen solo si defaultFile es válido
                  <img
                    className="w-[80px] m-5 shadow-lg object-cover rounded-md"
                    src={defaultFile}
                    alt=""
                  />
                )}
                <p>
                  {filePerc > 0 && filePerc < 100 ? (
                    <span>{`Uploading ${filePerc}%`}</span>
                  ) : filePerc === 100 ? (
                    <span>Image Uploaded</span>
                  ) : (
                    ""
                  )}
                </p>
              </div>
              <div className="flex flex-col ">
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded"
                >
                  Guardar
                </button>
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
              <div className="flex flex-col">
                <Link
                  to={"/inventario"}
                  className="bg-red-500 text-white text-center px-4 py-2 rounded"
                >
                  Cancelar
                </Link>
              </div>
            </div>
            {/* Agrega los demás campos del primer formulario */}
          </div>
        </div>
      </form>
    </>
  );
}
