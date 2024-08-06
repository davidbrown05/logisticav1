import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

export const Signup = () => {
  const [loading, setisLoading] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Define constantes para estados y ciudades
  const estados = [
    "AGUASCALIENTES",
    "BAJA CALIFORNIA",
    "BAJA CALIFORNIA SUR",
    "CAMPECHE",
    "CHIAPAS",
    "CHIHUAHUA",
    "COAHUILA",
    "COLIMA",
    "DURANGO",
    "ESTADO DE MÉXICO",
    "GUANAJUATO",
    "GUERRERO",
    "HIDALGO",
    "JALISCO",
    "MICHOACÁN",
    "MORELOS",
    "NAYARIT",
    "NUEVO LEÓN",
    "OAXACA",
    "PUEBLA",
    "QUERÉTARO",
    "QUINTANA ROO",
    "SAN LUIS POTOSÍ",
    "SINALOA",
    "SONORA",
    "TABASCO",
    "TAMAULIPAS",
    "TLAXCALA",
    "VERACRUZ",
    "YUCATÁN",
    "ZACATECAS",
  ]; // Agrega más estados según sea necesario

  const handleStateChange = (event) => {
    // Actualizar el estado seleccionado y resetear la ciudad seleccionada
    setSelectedState(event.target.value);
    // setEstado(event.target.value);
    // setValue("estado", event.target.value);
    //setSelectedCity("");
  };

  const onSubmit = handleSubmit(async (data) => {
    data.permisos = [];
    data.estado;
    console.log("usuarioData", data);
    setisLoading(true);
    handleAxiosSubmit(data);
  });

  const handleAxiosSubmit = async (data) => {
    try {
      setisLoading(true);
      const response = await axios.post(
        "http://localhost:3000/api/auth/signup",
        data
      );

      toast.success("NUEVO COMPRADOR REGISTRADO");
      setisLoading(false);
      navigate("/usuarios");
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message); // Muestra el mensaje de error del servidor
      } else {
        toast.error(error.message);
      }
      setisLoading(false);
    }
  };

  return (
    <>
      <div className="p-3 w-full max-w-[800px] mx-auto">
        <h1 className="text-3xl text-center font-semibold my-7">
          CREAR NUEVO USUARIO
        </h1>
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-4 items-center bg-gray-200 p-5 rounded-lg shadow-md"
        >
          <div className="flex flex-col w-full max-w-[400px]">
            <label className="text-[15px]">USERNAME</label>
            <input
              type="text"
              placeholder="Username"
              className="border p-3 rounded-lg w-full"
              id="username"
              {...register("username", { required: true })}
            />
          </div>
          <div className="flex flex-col w-full max-w-[400px]">
            <label className="text-[15px]">EMAIL</label>
            <input
              type="email"
              placeholder="Email"
              className="border p-3 rounded-lg w-full"
              id="email"
              {...register("email", { required: true })}
            />
          </div>
          <div className="flex flex-col w-full max-w-[400px]">
            <label className="text-[15px]">CONTRASEÑA</label>
            <input
              type="text"
              placeholder="Password"
              className="border p-3 rounded-lg w-full"
              id="password"
              {...register("password", { required: true })}
            />
          </div>
          <div className="flex flex-col w-full max-w-[400px]">
            <label className="text-[15px]">MODULO</label>
            <select
              className="border p-2 rounded-md shadow-sm w-full"
              {...register("modulo", { required: true })}
            >
              <option value="JURIDICO">JURIDICO</option>
              <option value="VENTAS">VENTAS</option>
              <option value="ADMINISTRACION">ADMINISTRACION</option>
            </select>
          </div>
          <div className="flex flex-col w-full max-w-[400px]">
            <label className="text-[15px]">ESTADO</label>
            <select
              {...register("estado", { required: true })}
              value={selectedState}
              onChange={handleStateChange}
              className="border p-2 rounded-md shadow-sm w-full"
            >
              {estados.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </div>
  
          <button
            type="submit"
            className="bg-black text-white p-3 rounded-md w-full max-w-[400px]"
          >
            {loading ? "Loading..." : "Agregar Usuario"}
          </button>
          <Link to={"/usuarios"}>
            <button
              type="button"
              className="bg-red-600 text-white p-3 rounded-md w-full max-w-[400px]"
            >
              Cancelar
            </button>
          </Link>
        </form>
      </div>
    </>
  );
  
};
