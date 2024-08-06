import React, { useState, useEffect, useContext } from "react";
import { FaPlus } from "react-icons/fa6";

import { useForm } from "react-hook-form";
import { Rings } from "react-loader-spinner";
import { UsuarioContext } from "../../context/UsuarioContext";
import moment from "moment";
import { FaTrashAlt } from "react-icons/fa";
import { Switch } from "@nextui-org/react";
import Swal from "sweetalert2";
import axios from "axios";
import { toast } from "react-toastify";
import { FcDocument } from "react-icons/fc";
import { ComisionesContext } from "../../context/ComisionesContext";

export const GeneralComisionesData = ({
  comisiones,
  setComisiones,
  comisionesData,
  setcomisionesData,
}) => {
  const [comision, setComision] = useState("");
  const [loadingUpload, setloadingUpload] = useState(false);
  const [gastos, setGastos] = useState(0);

  const isDisable = true;

  const handleComisionChange = (event) => {
    // Eliminar caracteres no numéricos
    const inputPrecio = event.target.value.replace(/[^0-9]/g, "");

    // Formatear con comas y agregar el símbolo de peso
    const formattedPrecio = `%${inputPrecio.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ","
    )}`;

    // Actualizar el estado del precio
    setComision(formattedPrecio);

    // setValue("cantidadPago", inputPrecio, { shouldValidate: true });
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit((data) => {
    console.log("formData", data);
  });

  const calcularGastos = (data) => {
    // Calcula la suma de precios en gastosLista con status igual a true
    const sumaEmpresa = data.empresaLista.reduce(
      (total, gasto) => total + gasto.cantidad,
      0
    );
    const sumaJuridoco = data.juridicoLista.reduce(
      (total, gasto) => total + gasto.precio,
      0
    );
    const sumaAdcionales = data.otrosLista.reduce(
      (total, gasto) => total + gasto.precio,
      0
    );

    const sumaTotal = sumaEmpresa + sumaJuridoco + sumaAdcionales;

    console.log("sumaGastos", sumaTotal);

    setGastos(sumaTotal);
  };

  // useEffect para actualizar el formulario después de que juridicoData cambie
  useEffect(() => {
    let neData = comisionesData;
    calcularGastos(neData);
  }, [comisionesData]);

  return (
    <>
      {comisionesData ? (
        <div className="form-container mt-10 flex flex-col items-center w-screen  lg:w-[1000px] max-w-[1500px] bg-[#f3f4f6]">
          <div className="form-header bg-black text-white w-full h-10 p-2 rounded-tl-md rounded-tr-md">
            COMISIONES GENERAL
          </div>

          <form onSubmit={onSubmit} className="flex flex-col">
            <div className="flex  items-center self-end mt-5">
              <div className="flex items-center">
                <button
                  type="submit"
                  className="bg-black text-white px-2 py-2 rounded-full shadow-lg"
                >
                  <FaPlus />
                </button>
              </div>
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
            <div className="flex flex-col gap-8  p-6 w-full">
              {/* Columna DEBAJO */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center justify-start">
                <div className=" flex flex-col w-full">
                  <label className=" font-medium">LOCALIZACION</label>
                  <input
                    {...register("localizacion", { required: true })}
                    // value={cantidad}
                    // onChange={(e) => {
                    //   handlePrecioChange(e);
                    // }}
                    type="text"
                    className={` p-2 rounded-md font-medium shadow-s w-full`}
                  />
                  {errors.cantidadPago && (
                    <p className=" text-red-500">localizacion requerida</p>
                  )}
                </div>
                <div className=" flex flex-col">
                  <label className=" font-medium">% COMISION</label>
                  <input
                    value={comision}
                    onChange={(e) => {
                      handleComisionChange(e);
                    }}
                    type="text"
                    className={` p-2 rounded-md font-medium shadow-s`}
                  />
                  {errors.cantidadPago && (
                    <p className=" text-red-500">COMISION REQUERIDA</p>
                  )}
                </div>
                <div className=" flex flex-col">
                  <label className=" font-medium">EMPRESA</label>
                  <input
                    {...register("empresa", { required: true })}
                    type="text"
                    className={` p-2 rounded-md font-medium shadow-s`}
                  />
                  {errors.cantidadPago && (
                    <p className=" text-red-500">EMPRESA REQUERIDA</p>
                  )}
                </div>
                <div className=" flex flex-col">
                  <label className=" font-medium">CONTACTO</label>
                  <input
                    {...register("contacto", { required: true })}
                    type="text"
                    className={` p-2 rounded-md font-medium shadow-s`}
                  />
                  {errors.cantidadPago && (
                    <p className=" text-red-500">CONTACTO REQUERIDA</p>
                  )}
                </div>

                {/* SEGUNDA COLUMNA */}

                <div className=" flex flex-col">
                  <label className=" font-medium">TELEFONO</label>
                  <input
                    {...register("telefono", { required: true })}
                    type="text"
                    className={` p-2 rounded-md font-medium shadow-s`}
                  />
                  {errors.cantidadPago && (
                    <p className=" text-red-500">TELEFONO REQUERIDA</p>
                  )}
                </div>
                <div className=" flex flex-col">
                  <label className=" font-medium">VALOR EMPRESA</label>
                  <input
                    {...register("telefono", { required: true })}
                    type="text"
                    className={` p-2 rounded-md font-medium shadow-s`}
                  />
                  {errors.cantidadPago && (
                    <p className=" text-red-500">VALOR EMPRESA REQUERIDA</p>
                  )}
                </div>
                <div className="mb-4 flex flex-col">
                  <label className=" font-medium">MONTO TOTAL</label>
                  <input
                    value={`$${comisionesData.montoTotal.toLocaleString(
                      "es-MX"
                    )}`}
                    // onChange={(e) => {
                    //   handlePrecioChange(e);
                    // }}
                    type="text"
                    className={` p-2 rounded-md text-white shadow-sm ${
                      isDisable ? " bg-gray-400" : ""
                    }`}
                    disabled={isDisable}
                  />
                </div>
                <div className="mb-4 flex flex-col">
                  <label className=" font-medium">SALDO</label>
                  <input
                    value={`$${gastos.toLocaleString("es-MX")}`}
                    // onChange={(e) => {
                    //   handlePrecioChange(e);
                    // }}
                    type="text"
                    className={` p-2 rounded-md text-white shadow-sm ${
                      isDisable ? " bg-gray-400" : ""
                    }`}
                    disabled={isDisable}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <Rings
          visible={true}
          height="100%"
          width="100%"
          color="#e43434"
          ariaLabel="rings-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      )}
    </>
  );
};
