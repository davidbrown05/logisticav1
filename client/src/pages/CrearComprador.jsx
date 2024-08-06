import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

export const CrearComprador = () => {
  const [loading, setisLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    data.nombreCompleto = `${data.firstName} ${data.lastName}`;
    console.log("formData", data);
    try {
      setisLoading(true);
      const response = await axios.post(
        "http://localhost:3000/api/comprador",
        data
      );

      toast.success("NUEVO COMPRADOR REGISTRADO");
      setisLoading(false);
      navigate("/compradores");
    } catch (error) {
      toast.error(error.message);
      setisLoading(false);
    }
  });
  return (
    <>
      <form onSubmit={onSubmit} className="p-3">
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
              />
              {errors.direccion && (
                <p className=" text-red-500">direccion is required</p>
              )}
            </div>

            {/* Agrega los demás campos del primer formulario */}
          </div>

          <div className=" ">
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
      </form>
    </>
  );
};
