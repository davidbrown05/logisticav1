import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

function EditarUsuario() {

    const { id } = useParams();
    const location = useLocation();
    //  const { comprador } = location.state || {};
    console.log("id", id);
  
    const [usuario, setUsuario] = useState(null);
    const [check, setcheck] = useState(false);
    const [loadingUpdate, setloadingUpdate] = useState(false);
    const [selectedState, setSelectedState] = useState("");
  
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
  ]; // Agrega más estados 

  const handleStateChange = (event) => {
    // Actualizar el estado seleccionado y resetear la ciudad seleccionada
    setSelectedState(event.target.value);
    // setEstado(event.target.value);
    // setValue("estado", event.target.value);
    //setSelectedCity("");
  };
  
    const getUsuario = async () => {
      try {
        // setisLoading(true);
        const response = await axios.get(
          `http://localhost:3000/api/usersData/${id}`
        );
        console.log("responseData", response.data);
        setUsuario(response.data);
        // setisLoading(false);
        // setDownloaded(true);
      } catch (error) {
        console.log(error);
        //  setisLoading(false);
      }
    };
  
    useEffect(() => {
      getUsuario();
    }, []);
  
    useEffect(() => {
      const newData = usuario;
      console.log("newData", newData);
      if (check) {
        handleUpdate(newData);
      }
    }, [usuario]);
  
    const onSubmit = handleSubmit(async (data) => {
     
      console.log("formData", data);
      setloadingUpdate(true);
      setcheck(true);
  
      setUsuario(data);
    });
  
    const handleUpdate = async (data) => {
      try {
        // Actualizar los datos en el servidor
        const responseUpdate = await axios.put(
          `http://localhost:3000/api/usersData/${id}`,
          data
        );
  
        // Volver a obtener los datos del servidor después de la actualización
        const response = await axios.get(
          `http://localhost:3000/api/usersData/${id}`
        );
        const nuevosDatos = await responseUpdate.data;
        // Actualizar el contexto con los nuevos datos
        // setJuridico(response.data[0]);
        //setcomprador(nuevosDatos);
  
        setloadingUpdate(false);
        toast.success("DATOS DE USUARIO ACTUALIZADOS");
      } catch (error) {
        setloadingUpdate(false);
        console.log(error);
        toast.error(error.message);
      }
    };
    return (
      <>
        {usuario ? (
          <div className="p-3 w-full max-w-[800px] mx-auto">
            <h1 className="text-3xl text-center font-semibold my-7">
              EDITAR USUARIO
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
                  defaultValue={usuario.username || "N/A"}
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
                  defaultValue={usuario.email || "N/A"}
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
                  defaultValue={usuario.password || "N/A"}
                />
              </div>
              <div className="flex flex-col w-full max-w-[400px]">
                <label className="text-[15px]">MODULO</label>
                <select
                  className="border p-2 rounded-md shadow-sm w-full"
                  {...register("modulo", { required: true })}
                  defaultValue={usuario.modulo || "N/A"}
                >
                  <option value="N/A">N/A</option>
                  <option value="JURIDICO">JURIDICO</option>
                  <option value="VENTAS">VENTAS</option>
                  <option value="ADMINISTRACION">ADMINISTRACION</option>
                </select>
              </div>
              <div className="flex flex-col w-full max-w-[400px]">
                <label className="text-[15px]">ESTADO</label>
                <select
                  {...register("estado", { required: true })}
                  defaultValue={usuario.estado || "N/A"}
                  onChange={handleStateChange}
                  className="border p-2 rounded-md shadow-sm w-full"
                >
                  <option value="N/A" disabled>
                    N/A
                  </option>
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
                {loadingUpdate ? "Loading..." : "Actualizar Usuario"}
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
        ) : (
          <p>No se han pasado datos del usuario</p>
        )}
      </>
    );
    
}

export default EditarUsuario