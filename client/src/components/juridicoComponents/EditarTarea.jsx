import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Rings } from "react-loader-spinner";
import { FaPlus } from "react-icons/fa6";
import moment from "moment";

export const EditarTarea = ({ setCurrentStep, editTask }) => {
  console.log("task to edit", editTask);
  const [task, setTask] = useState(editTask)
  const [loading, setLoading] = useState(false);
  const handleTab = () => {
    // Llamar a la función onEdit con los datos de la tarea
    setCurrentStep(0);
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
  return (
    <>
      <div>
        <form onSubmit={onSubmit}>
          <div className="form-cononSubmittainer mt-10 flex flex-col items-center bg-[#f3f4f6]">
            <div className="form-header bg-black text-white w-[1000px] h-10 p-2 rounded-tl-md rounded-tr-md flex justify-between">
              EDITAR: {editTask.actividad}
              <button onClick={handleTab}>CANCELAR</button>
            </div>
            <p className=" font-semibold mt-5">
              ENCARGADO DEL PROCESO: {task.encargado}
            </p>

            <div className="grid grid-cols-3 gap-10 bg-[#f3f4f6] p-6 w-[1000px]">
              <div className="flex w-[700px] gap-10">
                <div className="flex flex-col w-[610px] ">
                  <label className=" font-semibold">
                    DESCRIPCION DE ACTIVIDAD
                  </label>
                  <textarea
                    value={task.actividad}
                    {...register("actividad", { required: true })}
                    className="border p-2 rounded-md shadow-sm w-[600px]"
                  
                    onChange={(e) => {
                      setTask((prevDatosTask) => ({
                        ...prevDatosTask,
                        actividad: e.target.value,
                      }));
                      setValue("actividad", e.target.value);
                    }}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold">FECHA LIMITE TAREA</label>
                  <input
                    value={task.fechaLimite}
                    {...register("fechaLimite", { required: true })}
                    // value={moment(datosVentas.fechaVenta).format("YYYY-MM-DD")}
                    type="date"
                    className="border p-2 rounded-md shadow-sm"
                    onChange={(e) => {
                      setTask((prevDatosTask) => ({
                        ...prevDatosTask,
                        fechaLimite: e.target.value,
                      }));
                      setValue("fechaLimite", e.target.value);
                    }}
                  
                  />
                </div>

                <div>
                  <button
                    // onClick={agregarObservacion}
                    className="bg-black text-white px-2 py-2 rounded-full shadow-lg"
                  >
                    <FaPlus />
                  </button>
                </div>
                {loading && (
                  <div className="flex flex-col gap-2 mx-auto items-center w-[80px] h-[80px]">
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
            </div>
          </div>
        </form>
        {/* DISEÑO DE TARJETA */}
        <div className="flex flex-col items-center justify-center bg-white gap-4 mt-5 p-2 rounded-lg shadow-lg ">
          <h3 className=" font-semibold underline">{task.encargado}</h3>
          <p className=" font-semibold text-orange-500">ACTIVIDAD</p>
          <p className=" text-center">{task.actividad}</p>
          <p className=" text-center text-blue-500 font-medium">
            FECHA ASIGNACION
          </p>
          <p className=" text-center">
            {moment(task.fechaAsignacion).format("DD/MM/YYYY")}
          </p>
          <p className=" text-center text-red-500 font-medium">FECHA LIMITE</p>
          <p className=" text-center">
            {moment(task.fechaLimite).format("DD/MM/YYYY")}
          </p>

          {/* <p className="text-center">{diasRestantes} DIAS</p> */}

          <p className="text-center text-green-500 font-medium">
            TIEMPO RESTANTE
          </p>
          {/* <p className="text-center">{`${tiempoRestante.days} días, ${tiempoRestante.hours} horas, ${tiempoRestante.minutes} minutos`}</p> */}
        </div>
      </div>
    </>
  );
};
