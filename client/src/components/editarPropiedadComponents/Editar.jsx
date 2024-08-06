import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { Rings } from "react-loader-spinner";
import { InmuebleContext } from "../../context/InmuebleContext";

const InputField = ({ label, register, name, errors }) => (
  <div className="flex flex-col">
    <label>{label}</label>
    <input
      type="text"
      className="border p-2 rounded-md shadow-sm"
      {...register(name, { required: true })}
    />
    {errors[name] && <span className="text-red-500">Este campo es obligatorio</span>}
  </div>
);

const SelectField = ({ label, register, name, errors, options, ...props }) => (
  <div className="flex flex-col">
    <label>{label}</label>
    <select
      className="border p-2 rounded-md shadow-sm"
      {...register(name, { required: true })}
      {...props}
    >
      <option value="">Seleccione una opción</option>
      {options.map((option, idx) => (
        <option key={idx} value={option}>{option}</option>
      ))}
    </select>
    {errors && errors[name] && <span className="text-red-500">Este campo es obligatorio</span>}
  </div>
);

export const Editar = ({ product }) => {
  const { inmuebles, setInmuebles } = useContext(InmuebleContext);
  const [selectedState, setSelectedState] = useState(product.estado || "");
  const [selectedCity, setSelectedCity] = useState(product.ciudad || "");
  const [defaultFile, setDefaultFile] = useState(product.foto || "noImage.jpg");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [filePerc, setFilePerc] = useState(0);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      ...product,
      precio: product.precio ? `$${product.precio.toLocaleString()}` : "",
    },
  });

  const estados = ["Aguascalientes", "Baja California", "Chihuahua", "Sonora", "Sinaloa"];
  const ciudadesPorEstado = {
    Chihuahua: ["Ciudad Chihuahua", "Ciudad Juárez"],
    Sonora: ["Hermosillo", "Guaymas"],
    Sinaloa: ["Culiacán", "Mazatlán"],
  };

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
    setValue("estado", event.target.value);
    setSelectedCity("");
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
    setValue("ciudad", event.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setDefaultFile(URL.createObjectURL(file));
    setValue("foto", file);
  };

  const handlePrecioChange = (event) => {
    const inputPrecio = event.target.value.replace(/[^0-9]/g, "");
    const formattedPrecio = inputPrecio.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setValue("precio", formattedPrecio ? `$${formattedPrecio}` : "");
  };

  const onSubmit = handleSubmit(async (data) => {
    setLoadingUpload(true);
    data.precio = parseFloat(data.precio.replace(/[$,]/g, '')); // Elimina los símbolos de $ y las comas

    const formData = new FormData();
    if (data.foto instanceof File) {
      formData.append("file", data.foto);
      formData.append("upload_preset", "gpfngq7n");
      formData.append("api_key", "646432361532954");

      try {
        const res = await fetch("https://api.cloudinary.com/v1_1/ddjajfmtw/image/upload", { method: "POST", body: formData });
        const dataImagen = await res.json();
        data.foto = dataImagen.secure_url;
        data.assetid = dataImagen.public_id;
      } catch (error) {
        console.error("Error al cargar la imagen:", error);
        setLoadingUpload(false);
      }
    }

    try {
      setIsLoading(true);
      await axios.put(`http://localhost:3000/api/products/${product._id}`, data);
      const updatedInmuebles = inmuebles.map(inmueble =>
        inmueble._id === product._id ? { ...inmueble, ...data } : inmueble
      );
      setInmuebles(updatedInmuebles);
      toast.success("PROPIEDAD ACTUALIZADA");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
      setLoadingUpload(false);
    }
  });

  useEffect(() => {
    if (filePerc > 0 && filePerc < 100) {
      setLoadingUpload(true);
    } else if (filePerc === 100) {
      setLoadingUpload(false);
    }
  }, [filePerc]);

  return (
    <form onSubmit={onSubmit}>
      <div className="form-container mt-10 flex flex-col items-center">
        <div className="form-header bg-black text-white w-[1000px] h-10 p-2 rounded-tl-md rounded-tr-md">DIRECCION</div>
        <div className="grid grid-cols-3 gap-4 bg-[#f3f4f6] p-6 w-[1000px]">
          <InputField label="DIRECCION" register={register} name="direccion" errors={errors} />
          <InputField label="NUM EXTERIOR" register={register} name="numExterior" errors={errors} />
          <InputField label="NUM INTERIOR" register={register} name="numInterior" errors={errors} />
          <InputField label="COLONIA" register={register} name="colonia" errors={errors} />
          <InputField label="CODIGO POSTAL" register={register} name="codigoPostal" errors={errors} />
          <div className="flex flex-col">
            <label>PRECIO INICIAL</label>
            <input
              type="text"
              onChange={handlePrecioChange}
              className="border p-2 rounded-md shadow-sm"
              {...register("precio", { required: true })}
            />
            {errors.precio && <span className="text-red-500">Este campo es obligatorio</span>}
          </div>
          <SelectField label="ESTADO" register={register} name="estado" value={selectedState} onChange={handleStateChange} options={estados} />
          <SelectField label="CIUDAD" register={register} name="ciudad" value={selectedCity} onChange={handleCityChange} options={selectedState ? ciudadesPorEstado[selectedState] : []} disabled={!selectedState} />
          <SelectField label="TIPO DE VENTA" register={register} name="tipoVenta" errors={errors} options={["CAPTACION", "CESION DE DERECHO", "CREDITO FOVISSSTE", "CREDITO INFONAVIT", "DERECHOS ADJUDICATORIOS", "DERECHOS DE CREDITO", "DOBLE ESCRITURA", "EMPRESA CLIENTE"]} />
          <SelectField label="TIPO DE INMUEBLE" register={register} name="tipoInmueble" errors={errors} options={["CASA", "DEPARTAMENTO", "BODEGA"]} />
        </div>

        <div className="form-header bg-black text-white w-[1000px] h-10 p-2 rounded-md">DESCRIPCION</div>
        <div className="grid grid-cols-3 gap-4 bg-[#f3f4f6] p-6 w-[1000px]">
          <InputField label="METROS TERRENO" register={register} name="metrosTerreno" errors={errors} />
          <SelectField label="NUMERO DE RECAMARAS" register={register} name="numRecamaras" errors={errors} options={["1", "2", "3", "4", "5", "MAS DE 5"]} />
          <SelectField label="NUMERO DE BAÑOS" register={register} name="numBanos" errors={errors} options={["1", "2", "3", "4", "5", "MAS DE 5"]} />
          <SelectField label="NIVEL" register={register} name="nivel" errors={errors} options={["1", "2", "3"]} />
          <SelectField label="ESTATUS INMUEBLE" register={register} name="estatusInmueble" errors={errors} options={["HABITADA", "DESHABITADA", "INVADIDA"]} />
          <SelectField label="ESTATUS JURIDICO" register={register} name="estatusJuridico" errors={errors} options={["ESCRITURADA", "ADJUDICACION", "DACION"]} />
          <SelectField label="CONTACTO" register={register} name="contacto" errors={errors} options={["SERGIO VILLA", "ALEJANDRO DOMINGUEZ", "DAVID CASTILLO"]} />
          <SelectField label="LLAVES" register={register} name="llaves" errors={errors} options={["SI", "NO"]} />
          <SelectField label="VISITADA" register={register} name="visitada" errors={errors} options={["SI", "NO",]} />
          <SelectField label="EMPRESA" register={register} name="empresa" errors={errors} options={["LOGISTICA INMOBILIARIA", "SANTANDER","GRUPO FINANCIERO BBVA"]} />
          <InputField label="FOLIO EMPRESA" register={register} name="folioEmpresa" errors={errors}  />
          <InputField label="NOMBRE ACREDITADO" register={register} name="nombreAcreditado" errors={errors}/>
         
         
        </div>

        <div className="form-header bg-black text-white w-[1000px] h-10 p-2 rounded-md">FOTO DE LA PROPIEDAD</div>
        <div className="grid grid-cols-3 gap-4 bg-[#f3f4f6] p-6 w-[1000px] items-center">
         
          <div className="flex flex-col">
            <label>FOTO</label>
            <input type="file" className="border p-2 rounded-md shadow-sm" onChange={handleImageChange} />
            {loadingUpload && <span className="text-blue-500">Cargando imagen: {filePerc}%</span>}
          </div>
          <div>
            <img
              src={defaultFile}
              alt="Vista previa"
              className="w-32 h-32 object-cover border"
            />
          </div>
          <button type="submit" className=" xl:w-[300px] xl:h-[50px] bg-black text-white p-2 rounded-md" disabled={isLoading || loadingUpload}>
          {isLoading ? <Rings height="30" width="30" color="#fff" /> : "Actualizar Propiedad"}
        </button>
        </div>
        
      </div>
    </form>
  );
};

