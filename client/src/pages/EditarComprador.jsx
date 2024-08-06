import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

function EditarComprador() {
  const { id } = useParams();
  const location = useLocation();
  //  const { comprador } = location.state || {};
  console.log("id", id);

  const [comprador, setcomprador] = useState(null);
  const [check, setcheck] = useState(false);
  const [loadingUpdate, setloadingUpdate] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const getCompradores = async () => {
    try {
      // setisLoading(true);
      const response = await axios.get(
        `http://localhost:3000/api/comprador/${id}`
      );
      console.log("responseData", response.data);
      setcomprador(response.data);
      // setisLoading(false);
      // setDownloaded(true);
    } catch (error) {
      console.log(error);
      //  setisLoading(false);
    }
  };

  useEffect(() => {
    getCompradores();
  }, []);

  useEffect(() => {
    const newData = comprador;
    console.log("newData", newData);
    if (check) {
      handleUpdate(newData);
    }
  }, [comprador]);

  const onSubmit = handleSubmit(async (data) => {
    data.nombreCompleto = `${data.firstName} ${data.lastName}`;
    console.log("formData", data);
    setloadingUpdate(true);
    setcheck(true);

    setcomprador(data);
  });

  const handleUpdate = async (data) => {
    try {
      // Actualizar los datos en el servidor
      const responseUpdate = await axios.put(
        `http://localhost:3000/api/comprador/${id}`,
        data
      );

      // Volver a obtener los datos del servidor después de la actualización
      const response = await axios.get(
        `http://localhost:3000/api/comprador/${id}`
      );
      const nuevosDatos = await responseUpdate.data;
      // Actualizar el contexto con los nuevos datos
      // setJuridico(response.data[0]);
      //setcomprador(nuevosDatos);

      setloadingUpdate(false);
      toast.success("DATOS COMPRADOR ACTUALIZADOS");
    } catch (error) {
      setloadingUpdate(false);
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        {comprador ? (
          <div className="form-container mt-10 flex flex-col items-center bg-[#f3f4f6] lg:w-[1200px] mx-auto ">
            <div className="form-header bg-black  text-white w-full  h-10 p-2 rounded-tl-md rounded-tr-md">
              NUEVO COMPRADOR
            </div>

            <div className="grid grid-cols-2 items-center justify-between gap-5  lg:grid-cols-3 lg:gap-4  p-6 w-full lg:w-[1000px]">
              <div className="flex flex-col">
                <label className=" text-[15px]">NOMBRE</label>
                <input
                  type="text"
                  // onChange={(e) => (direccionRef.current = e.target.value)}
                  className="border p-2 rounded-md shadow-sm"
                  {...register("firstName", { required: true })}
                  defaultValue={comprador.firstName}
                />
                {errors.firstName && (
                  <p className=" text-red-500">firstName is required</p>
                )}
              </div>
              <div className="flex flex-col">
                <label className=" text-[15px]">APELLIDO</label>
                <input
                  type="text"
                  // onChange={(e) => (numExteriorRef.current = e.target.value)}
                  className="border p-2 rounded-md shadow-sm"
                  {...register("lastName", { required: true })}
                  defaultValue={comprador.lastName}
                />
                {errors.lastName && (
                  <p className=" text-red-500">lastName is required</p>
                )}
              </div>
              <div className="flex flex-col">
                <label className=" text-[15px]">TELEFONO</label>
                <input
                  type="text"
                  // onChange={(e) => (numInteriorRef.current = e.target.value)}
                  className="border p-2 rounded-md shadow-sm"
                  {...register("phone", { required: true })}
                  defaultValue={comprador.phone}
                />
                {errors.phone && (
                  <p className=" text-red-500">telephone is required</p>
                )}
              </div>
              <div className="flex flex-col">
                <label className=" text-[15px]">EMAIL</label>
                <input
                  type="text"
                  //  onChange={(e) => (coloniaRef.current = e.target.value)}
                  className="border p-2 rounded-md shadow-sm"
                  {...register("email", { required: true })}
                  defaultValue={comprador.email}
                />
                {errors.email && (
                  <p className=" text-red-500">email is required</p>
                )}
              </div>
              <div className="flex flex-col">
                <label className=" text-[15px]">DIRECCION</label>
                <input
                  type="text"
                  //   onChange={(e) => (codigoPostalRef.current = e.target.value)}
                  className="border p-2 rounded-md shadow-sm"
                  {...register("direccion", { required: true })}
                  defaultValue={comprador.direccion}
                />
                {errors.direccion && (
                  <p className=" text-red-500">direccion is required</p>
                )}
              </div>

              {/* Agrega los demás campos del primer formulario */}
            </div>

            <div>
              {/* botones agregar y cancelar */}
              <div className="flex gap-5 m-6 ">
                <div className="flex flex-col">
                  <button className="bg-black text-white px-4 py-2 rounded">
                    Guardar
                  </button>
                </div>
                <div className="flex flex-col">
                  <Link
                    to={"/compradores"}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Cancelar
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>No se han pasado datos del comprador</p>
        )}
      </form>
    </>
  );
}

export default EditarComprador;
