import React, { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";

export const MensajeModal = ({
  openModalMensaje,
  setopenModalMensaje,
  recordatorioData,
}) => {
  const {
    register,
    handleSubmit,
    setValue, // Necesario para actualizar los valores dinámicamente
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    console.log("formData", data);
    mandarMensaje(data.mensaje);
  });

  // useEffect para actualizar los valores de los inputs cuando cambia recordatorioData
  useEffect(() => {
    if (recordatorioData) {
      setValue("contacto", recordatorioData.contacto);
      setValue("recordatorio", recordatorioData.recordatorio);
    }
  }, [recordatorioData, setValue]);

  const mandarMensaje = async (dato) => {
    let mensaje = encodeURIComponent(dato); // Codificar el mensaje
    let numeroTelefono = ""; // Aquí puedes agregar el número de teléfono si lo necesitas

    window.location.href = `https://api.whatsapp.com/send?phone=&text=${mensaje}&display=popup`;
  };

  return (
    <>
      {openModalMensaje && (
        <div
          onClick={() => setopenModalMensaje(!openModalMensaje)}
          className="fixed inset-0 bg-[rgba(0,0,0,.5)] flex items-center justify-center z-30 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="form-container  bg-slate-900 rounded-lg w-full max-w-md md:max-w-2xl lg:max-w-3xl mx-4"
          >
            <div className="form-header bg-black w-full text-white rounded-t-lg p-4 flex justify-between items-center">
              <h1 className="text-[12px] font-bold">MENSAJE:</h1>
            </div>
            <form onSubmit={onSubmit} className="form-body p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-between gap-5  lg:grid-cols-3 lg:gap-4  p-6 w-full lg:w-[1000px]">
              <div className="flex flex-col">
                  <label className="font-semibold text-yellow-600">
                    CONTACTO:{" "}
                    <span className="text-gray-400">
                      {recordatorioData.contacto}
                    </span>
                  </label>
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold text-yellow-600">
                    ASUNTO:{" "}
                    <span className="text-gray-400">
                      {recordatorioData.recordatorio}
                    </span>
                  </label>
                </div>

                <div className="flex flex-col">
                  <label className=" text-[15px]">MENSAJE</label>
                  <textarea
                    className="border p-2 rounded-md shadow-sm text-slate-800 font-bold"
                    {...register("mensaje", { required: true })}
                  />
                  {errors.recordatorio && (
                    <p className=" text-red-500">RECORDATORIO REQUERIDO</p>
                  )}
                </div>
              </div>

              <div className="flex gap-5 m-6 ">
                <div className="flex flex-col">
                  <button className="bg-black text-white px-4 py-2 rounded text-[12px]">
                    ENVIAR MENSAJE
                  </button>
                </div>
                <div className="flex flex-col">
                  <button className="bg-red-500 text-white px-4 py-2 rounded text-[12px]">
                    CANCELAR
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
