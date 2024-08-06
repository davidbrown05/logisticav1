import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Rings } from "react-loader-spinner";
import { InmuebleContext } from "../../context/InmuebleContext";

const estados = [
  "Aguascalientes", "Baja California", "Baja California Sur", "Campeche",
  "Chiapas", "Chihuahua", "Coahuila", "Colima", "Durango", "Estado de México",
  "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", "Michoacán", "Morelos",
  "Nayarit", "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo",
  "San Luis Potosí", "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala",
  "Veracruz", "Yucatán", "Zacatecas"
];

const ciudadesPorEstado = {
  Chihuahua: ["Ciudad Chihuahua", "Ciudad Juárez"],
  Sonora: ["Hermosillo", "Guaymas"],
  Sinaloa: ["Culiacán", "Mazatlán"],
  // Agrega más ciudades según sea necesario
};

const CreatePropertyOpt = () => {
  const { inmuebles, setInmuebles } = useContext(InmuebleContext);
  const [formData, setFormData] = useState({
    direccion: "", numExterior: "", numInterior: "", colonia: "",
    codigoPostal: "", precio: "", tipoVenta: "", tipoInmueble: "",
    estado: "", ciudad: "", metrosTerreno: "", numRecamaras: "",
    numBanos: "", nivel: "", estatusInmueble: "", estatusJuridico: "",
    contacto: "", llaves: "", visitada: "", empresa: "", folioEmpresa: "",
    nombreAcreditado: "", foto: ""
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStateChange = (e) => {
    setFormData({ ...formData, estado: e.target.value, ciudad: "" });
  };

  const handleCityChange = (e) => {
    setFormData({ ...formData, ciudad: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    setFormData({ ...formData, foto: URL.createObjectURL(file) });
  };

  const handlePrecioChange = (e) => {
    const value = e.target.value;
    const formattedValue = value.replace(/\D/g, "");
    setFormData({ ...formData, precio: formattedValue });
  };

  const onSubmit = async (data) => {
    setLoadingUpload(true);
    const formDataToSend = {
      ...formData,
      numExterior: parseInt(formData.numExterior),
      numInterior: parseInt(formData.numInterior),
      codigoPostal: parseInt(formData.codigoPostal),
      precio: parseFloat(formData.precio),
      metrosTerreno: parseFloat(formData.metrosTerreno),
      numRecamaras: parseInt(formData.numRecamaras),
      numBanos: parseInt(formData.numBanos),
    };

    await handleFileUpload(selectedImage, formDataToSend);
  };

  const handleFileUpload = async (file, data) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "gpfngq7n");
    formData.append("api_key", "646432361532954");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/ddjajfmtw/image/upload", {
        method: "POST",
        body: formData,
      });

      const dataImagen = await res.json();
      data.foto = dataImagen.secure_url;
      data.assetid = dataImagen.public_id;

      await handleSubmitProperty(data);
    } catch (error) {
      console.error("Error al obtener la URL de descarga:", error);
      setLoadingUpload(false);
    }
  };

  const handleSubmitProperty = async (data) => {
    try {
      setIsLoading(true);
      const response = await axios.post("http://localhost:3000/api/products", data);
      const responseInmueble = response.data;

      setInmuebles([...inmuebles, responseInmueble]);

      toast.success("NUEVA PROPIEDAD AGREGADA");
      navigate("/inventario");
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
      setLoadingUpload(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-container mt-10 flex flex-col items-center">
        <div className="form-header bg-black text-white w-[1000px] h-10 p-2 rounded-tl-md rounded-tr-md">
          DIRECCION
        </div>
        <div className="grid grid-cols-3 gap-4 bg-[#f3f4f6] p-6 w-[1000px]">
          <div className="form-group">
            <label>DIRECCION</label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
              ref={register({ required: true })}
            />
            {errors.direccion && <span>Este campo es obligatorio</span>}
          </div>
          <div className="form-group">
            <label>NUM EXTERIOR</label>
            <input
              type="text"
              name="numExterior"
              value={formData.numExterior}
              onChange={handleInputChange}
              ref={register({ required: true })}
            />
            {errors.numExterior && <span>Este campo es obligatorio</span>}
          </div>
          <div className="form-group">
            <label>NUM INTERIOR</label>
            <input
              type="text"
              name="numInterior"
              value={formData.numInterior}
              onChange={handleInputChange}
              ref={register({ required: true })}
            />
            {errors.numInterior && <span>Este campo es obligatorio</span>}
          </div>
          <div className="form-group">
            <label>COLONIA</label>
            <input
              type="text"
              name="colonia"
              value={formData.colonia}
              onChange={handleInputChange}
              ref={register({ required: true })}
            />
            {errors.colonia && <span>Este campo es obligatorio</span>}
          </div>
          <div className="form-group">
            <label>CODIGO POSTAL</label>
            <input
              type="text"
              name="codigoPostal"
              value={formData.codigoPostal}
              onChange={handleInputChange}
              ref={register({ required: true })}
            />
            {errors.codigoPostal && <span>Este campo es obligatorio</span>}
          </div>
          <div className="form-group">
            <label>PRECIO INICIAL</label>
            <input
              type="text"
              name="precio"
              value={formData.precio}
              onChange={handlePrecioChange}
            />
          </div>
          <div className="form-group">
            <label>ESTADO</label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleStateChange}
            >
              {estados.map((estado) => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>TIPO DE VENTA</label>
            <select
              name="tipoVenta"
              value={formData.tipoVenta}
              onChange={handleInputChange}
              ref={register({ required: true })}
            >
              {/* Agregar opciones de tipo de venta */}
            </select>
            {errors.tipoVenta && <span>Este campo es obligatorio</span>}
          </div>
          <div className="form-group">
            <label>TIPO DE INMUEBLE</label>
            <select
              name="tipoInmueble"
              value={formData.tipoInmueble}
              onChange={handleInputChange}
              ref={register({ required: true })}
            >
              {/* Agregar opciones de tipo de inmueble */}
            </select>
            {errors.tipoInmueble && <span>Este campo es obligatorio</span>}
          </div>
          <div className="form-group">
            <label>CIUDAD</label>
            <select
              name="ciudad"
              value={formData.ciudad}
              onChange={handleCityChange}
              disabled={!formData.estado}
            >
              {formData.estado && ciudadesPorEstado[formData.estado].map((ciudad) => (
                <option key={ciudad} value={ciudad}>{ciudad}</option>
              ))}
            </select>
          </div>
          {/* Agregar más campos aquí */}
        </div>
        <div className="form-group">
          <label>FOTO</label>
          <input type="file" onChange={handleImageChange} />
          {selectedImage && <img src={URL.createObjectURL(selectedImage)} alt="Preview" />}
        </div>
        <div className="flex flex-col items-center">
          <button type="submit" className="btn-submit">
            {isLoading || loadingUpload ? (
              <Rings height="80" width="80" color="white" />
            ) : (
              "AGREGAR"
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreatePropertyOpt;
