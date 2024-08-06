import React, { useState, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../../firebase";

export const CreateProperty = () => {
  const [precio, setPrecio] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const [file, setFile] = useState(undefined);
  const [defaultFile, setDefaultFile] = useState("noImage.jpg");
  const [fileName, setFileName] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);

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
  };

  const handleLoadImage = () => {
    // Puedes agregar aquí la lógica para cargar la imagen si es necesario
    console.log("Imagen cargada:", selectedImage);
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
    // Convertir campos numéricos a números
    data.numExterior = parseInt(data.numExterior);
    data.numInterior = parseInt(data.numInterior);
    data.codigoPostal = parseInt(data.codigoPostal);
    data.precio = parseFloat(data.precio);
    data.metrosTerreno = parseFloat(data.metrosTerreno);
    data.numRecamaras = parseInt(data.numRecamaras);
    data.numBanos = parseInt(data.numBanos);

    //campos adicionales
    data.estatusVenta = "PENDIENTE";
    data.comprador = "INDEFINIDO";
    data.formaPago = "INDEFINIDO";
    data.foto = fileName.name;
    console.log("formData", data);

    handleFileUpload(fileName, data);
  });

  const handleSubmitProperty = async (data) => {
    try {
      setisLoading(true);
      const response = await axios.post(
        "http://localhost:3000/api/products",
        data
      );
      // Obtener el _id de la propiedad recién creada
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
      };

      // Crear automáticamente un documento en la colección "ventas" con el mismo _id
      await axios.post(`http://localhost:3000/api/ventasData`, datosVenta);

      toast.success("NUEVA PROPIEDAD AGREGADA");
      setisLoading(false);
      navigate("/inventario");
    } catch (error) {
      toast.error(error.message);
      setisLoading(false);
    }
  };

  const handleFileUpload = (file, data) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);

    const upLoadTask = uploadBytesResumable(storageRef, file);

    upLoadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        // Manejar errores durante la carga
        console.error("Error durante la carga:", error);
      },
      () => {
        // Manejar éxito después de la carga
        getDownloadURL(upLoadTask.snapshot.ref)
          .then((downloadURL) => {
            console.log("URL de descarga:", downloadURL);
            // Actualizar el estado de foto en data con la URL de descarga
            data.foto = downloadURL;
            console.log("formData:", data);
            handleSubmitProperty(data)
          })
          .catch((error) => {
            // Manejar errores al obtener la URL de descarga
            console.error("Error al obtener la URL de descarga:", error);
          });
      }
    );
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="form-container mt-10 flex flex-col items-center">
          <div className="form-header bg-black text-white w-[1000px] h-10 p-2 rounded-tl-md rounded-tr-md">
            DIRECCION
          </div>
          <div className="grid grid-cols-3 gap-4 bg-[#f3f4f6] p-6 w-[1000px]">
            <div className="flex flex-col">
              <label>DIRECCION</label>
              <input
                type="text"
                // onChange={(e) => (direccionRef.current = e.target.value)}
                className="border p-2 rounded-md shadow-sm"
                {...register("direccion", { required: true })}
              />
            </div>
            <div className="flex flex-col">
              <label>NUM EXTERIOR</label>
              <input
                type="text"
                //onChange={(e) => (numExteriorRef.current = e.target.value)}
                className="border p-2 rounded-md shadow-sm"
                {...register("numExterior", { required: true })}
              />
            </div>
            <div className="flex flex-col">
              <label>NUM INTERIOR</label>
              <input
                type="text"
                //  onChange={(e) => (numInteriorRef.current = e.target.value)}
                className="border p-2 rounded-md shadow-sm"
                {...register("numInterior", { required: true })}
              />
            </div>
            <div className="flex flex-col">
              <label>COLONIA</label>
              <input
                type="text"
                //  onChange={(e) => (coloniaRef.current = e.target.value)}
                className="border p-2 rounded-md shadow-sm"
                {...register("colonia", { required: true })}
              />
            </div>
            <div className="flex flex-col">
              <label>CODIGO POSTAL</label>
              <input
                type="text"
                // onChange={(e) => (codigoPostalRef.current = e.target.value)}
                className="border p-2 rounded-md shadow-sm"
                {...register("codigoPostal", { required: true })}
              />
            </div>
            <div className="flex flex-col">
              <label>PRECIO INICIAL</label>
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
            <div className="flex flex-col">
              <label>ESTADO</label>
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
            <div className="flex flex-col">
              <label>TIPO DE VENTA</label>
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
              </select>
            </div>
            <div className="flex flex-col">
              <label>TIPO DE INMUEBLE</label>
              <select
                //  onChange={(e) => (tipoInmuebleRef.current = e.target.value)}
                className="border p-2 rounded-md shadow-sm"
                {...register("tipoInmueble", { required: true })}
              >
                <option value="CASA">CASA</option>
                <option value="DEPARTAMENTO">DEPARTAMENTO</option>
                <option value="BODEGA">BODEGA</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label>CIUDAD</label>
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
          <div className="form-header bg-black text-white w-[1000px] h-10 p-2 rounded-md ">
            DESCRIPCION
          </div>
          <div className="grid grid-cols-3 gap-4 bg-[#f3f4f6] p-6 w-[1000px]">
            <div className="flex flex-col">
              <label>METROS TERRENO</label>
              <input
                // onChange={(e) => (metrosTerrenoRef.current = e.target.value)}
                type="text"
                className="border p-2 rounded-md shadow-sm"
                {...register("metrosTerreno", { required: true })}
              />
            </div>
            <div className="flex flex-col">
              <label>NUMERO DE RECAMARAS</label>
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
                  className="bg-gray-400 text-white px-4 py-2 rounded cursor-pointer"
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
              {!isLoading && (
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Guardar
                </button>
              )}
            </div>
            <div className="flex flex-col">
              <Link
                to={"/inventario"}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Cancelar
              </Link>
            </div>
            {/* Agrega los demás campos del primer formulario */}
          </div>
        </div>
      </form>
    </>
  );
};
