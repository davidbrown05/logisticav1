import React, { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";
import { BsChatLeftTextFill } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import { RiErrorWarningFill } from "react-icons/ri";
import { MdEditCalendar } from "react-icons/md";

export const ActualizarRecordatorioModal = ({
  openModal,
  setopenModal,
  recordatorioData,
  setrecordatorios,
  idRecordatorio,
}) => {
  console.log("recordatorioData", recordatorioData);
  const {
    register,
    handleSubmit,
    setValue, // Necesario para actualizar los valores dinámicamente
    formState: { errors },
  } = useForm();

  // useEffect para actualizar los valores de los inputs cuando cambia recordatorioData
  useEffect(() => {
    if (recordatorioData) {
      setValue("contacto", recordatorioData.contacto);
      setValue("recordatorio", recordatorioData.recordatorio);
      setValue("fechaRecordatorio", recordatorioData.fechaRecordatorio);
    }
  }, [recordatorioData, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    console.log("formData", data);

    const fechaLRecordatorioInput = new Date(data.fechaRecordatorio);
    const fechaRecordatorioFormateada = fechaLRecordatorioInput.toISOString();
    data.fechaRecordatorio = fechaRecordatorioFormateada;

    //setrecordatoriosData(data);

    //setcheckRecordatoiosUpdate(true);

    if (!idRecordatorio) {
      toast.error("No se encontró el ID del recordatorio.");
      return;
    }
    try {
      const responseUpdate = await axios.put(
        `http://localhost:3000/api/recordatorios/${idRecordatorio}`,
        data
      );
      console.log("Recordatorio actualizado del servidor", responseUpdate.data);

      const nuevosDatos = responseUpdate.data;

      // Actualizar la lista de recordatorios con el recordatorio actualizado
      setrecordatorios((prevRecordatorios) =>
        prevRecordatorios.map((recordatorio) =>
          recordatorio._id === nuevosDatos._id ? nuevosDatos : recordatorio
        )
      );

      toast.success("Recordatorio Actualizado");

      setTimeout(() => {
        mandarMensaje(data.mensaje)
      }, 500);
    } catch (error) {
      console.error("Error al actualizar el recordatorio:", error);
      toast.error("Error al actualizar el recordatorio");
    }
  });

  const mandarMensaje = async (dato) => {
    let mensaje = encodeURIComponent(dato); // Codificar el mensaje
    let numeroTelefono = ""; // Aquí puedes agregar el número de teléfono si lo necesitas

    window.location.href = `https://api.whatsapp.com/send?phone=&text=${mensaje}&display=popup`;
  };

  return (
    <>
      {openModal && (
        <div
          onClick={() => setopenModal(!openModal)}
          className="fixed inset-0 bg-[rgba(0,0,0,.5)] flex items-center justify-center z-30 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="form-container  bg-slate-900 rounded-lg w-full max-w-md md:max-w-2xl lg:max-w-3xl mx-4"
          >
            <div className="form-header bg-black w-full text-white rounded-t-lg p-4 flex justify-between items-center">
              <h1 className="text-[12px] font-bold">
                ACTUALIZAR RECORDATORIO:
              </h1>
            </div>
            <form onSubmit={onSubmit} className="form-body p-4">
              <div className="grid grid-cols-1 md:grid-cols-1 items-center justify-between  gap-7  lg:grid-cols-1 lg:gap-4  p-6 w-full lg:w-[1000px]">
                {/* <div className="flex flex-col">
                  <label className=" text-[15px]">CONTACTO</label>
                  <input
                    type="text"
                    className="border p-2 rounded-md shadow-sm text-slate-800 font-bold"
                    {...register("contacto", { required: true })}
                  />
                  {errors.contacto && (
                    <p className=" text-red-500">RECORDATORIO REQUERIDO</p>
                  )}
                </div> */}

                {/* <div className="flex flex-col">
                  <label className=" text-[15px]">RECORDATORIO</label>
                  <textarea
                    className="border p-2 rounded-md shadow-sm text-slate-800 font-bold"
                    {...register("recordatorio", { required: true })}
                  />
                  {errors.recordatorio && (
                    <p className=" text-red-500">RECORDATORIO REQUERIDO</p>
                  )}
                </div> */}

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
                <div className="flex flex-col md:w-[500px] ">
                  <label className="font-semibold">FECHA RECORDATORIO</label>
                  <input
                    type="date"
                    className="border p-2 rounded-md shadow-sm text-slate-900 font-bold"
                    {...register("fechaRecordatorio", { required: true })}
                  />
                  {errors.fechaRecordatorio && (
                    <p className=" text-red-500">FECHA REQUERIDA</p>
                  )}
                </div>
                <div className="flex flex-col md:w-[500px]">
                  <label className=" text-[15px]">MENSAJE</label>
                  <textarea
                    className="border p-2 rounded-md shadow-sm text-slate-800 font-bold"
                    {...register("mensaje", { required: true })}
                  />
                  {errors.mensaje && (
                    <p className=" text-red-500">MENSAJE REQUERIDO</p>
                  )}
                </div>
              </div>

              <div className="flex gap-5 m-6 ">
                <div className="flex flex-col">
                  <button className="bg-black text-white px-4 py-2 rounded text-[12px]">
                    ACTUALIZAR
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
