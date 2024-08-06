import React, { useState, useCallback, useContext, useEffect } from "react";

import { FaPlus } from "react-icons/fa6";
import { JuridicoContext } from "../../context/JuridicoContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import moment from "moment";
import { Rings } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import {forceUpdatePosts} from "../../redux/juridico/postSlice";
//import { addTask } from "../../redux/juridico/juridicoSlice";
import { UsuarioContext } from "../../context/UsuarioContext";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndContext, DndProvider, useDrop, useDrag } from "react-dnd";
import { TasksSection } from "./TasksSection";
import { v4 as uuidv4 } from "uuid";

export const Seguimiento = ({ id, setCurrentStep, setEditTask, currentUser }) => {
 
  const { juridico, setJuridico } = useContext(JuridicoContext);
  const dispatch = useDispatch();
  const [checkJuridico, setCheckJuridico] = useState(false);
  const [checkJuridicoDelte, setCheckJuridicoDelete] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);

  const [juridicoData, setJuridicoData] = useState(juridico);
  const [juridicoDeleteData, setJuridicoDeleteData] = useState(juridico);
  const [tasks, setTasks] = useState(juridicoDeleteData.tareasLista);

  // useEffect para actualizar el formulario después de que juridicoData cambie
  useEffect(() => {
    let neData = juridicoData;
    console.log("juridicoDataDeletedActualizado", neData);
    console.log("tasks", tasks);

    if (checkJuridico) {
      setTasks(juridicoData.tareasLista);
      console.log("handleUpdate2", neData);
      handleUpdate2(neData);
    }

    return () => {
      console.log("fase desmintaje");
    };
  }, [juridicoData]);

  const handleUpdate2 = async (data) => {
    try {
      // Actualizar los datos en el servidor
      const responseUpdate = await axios.put(
        `http://localhost:3000/api/juridicoData/${juridicoData._id}`,
        data
      );
      const nuevosDatos = await responseUpdate.data;

      console.log("datos actualizados");

      // Volver a obtener los datos del servidor después de la actualización
      const response = await axios.get(
        `http://localhost:3000/api/juridicoData/${id}`
      );

      // Actualizar el contexto con los nuevos datos
      // setJuridico(response.data[0]);
      setJuridico(nuevosDatos);
      dispatch(forceUpdatePosts()); // Despachar la acción para agregar una nueva tarea

      setCheckJuridico(false);
      toast.success("TAREAS ACTUALIZADAS");
    } catch (error) {
      setCheckJuridico(false);
      console.log(error);
      toast.error(error.message);
    }
  };

  const onSubmit = handleSubmit((data) => {
    // Obtener la fecha actual
    const fechaActual = new Date();
     // Formatear la fecha actual como una cadena en formato ISO 8601
     const fechaAsignacionFormateada = fechaActual.toISOString();

     // Formatear la fecha límite desde el input
     const fechaLimiteInput = new Date(data.fechaLimite);
     const fechaLimiteFormateada = fechaLimiteInput.toISOString();
     // Generar una ID única
     const uniqueId = uuidv4();
     data._id = uniqueId;
     data.encargado = juridicoData.encargadoProceso;
     data.fehcaAsignacion = fechaAsignacionFormateada; // Asignar la fecha de asignación formateada
     data.fechaLimite = fechaLimiteFormateada; // Asignar la fecha límite formateada
     data.status = "ACTIVA";
     data.url = `http://localhost:5173/juridico/${id}`;
     console.log("formData", data);

    const newArrayObjeto = [...juridicoData.tareasLista];
    // Paso 2: Actualizar la copia con los datos de nuevaObservacion
    newArrayObjeto.push(data);

    // Actualizar el contexto con los nuevos datos
    setJuridicoData((prevJuridico) => ({
      ...prevJuridico,
      // Actualizar los campos necesarios con los datos del formulario
      tareasLista: newArrayObjeto,
    }));

    setCheckJuridico(true);
  });

   // Ordenar las tareas por fecha límite de menor a mayor
   const sortedTasks = tasks.slice().sort((a, b) => {
    const fechaLimiteA = moment(a.fechaLimite);
    const fechaLimiteB = moment(b.fechaLimite);
    return fechaLimiteA - fechaLimiteB;
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <>
        <div className="flex flex-col items-center bg-[#f3f4f6]">
          {/* Formulario para agregar observaciones */}
          <form onSubmit={onSubmit}>
            <div className="form-cononSubmittainer  flex flex-col items-center bg-[#f3f4f6]">
              <div className="form-header bg-black text-white w-full h-10 p-2 rounded-tl-md rounded-tr-md">
                SEGUIMIENTO PROCESAL
              </div>
              <p className=" font-semibold mt-5">
                ENCARGADO DEL PROCESO: {juridicoData.encargadoProceso}
              </p>

              <div className="grid grid-cols-3 gap-10 bg-[#f3f4f6] p-6 w-[1000px]">
                <div className="flex w-[700px] gap-10">
                  <div className="flex flex-col w-[610px] ">
                    <label className=" font-semibold">
                      DESCRIPCION DE ACTIVIDAD
                    </label>
                    <textarea
                      className="border p-2 rounded-md shadow-sm w-[600px]"
                      {...register("actividad", { required: true })}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-semibold">FECHA DE TAREA</label>
                    <input
                     
                      type="date"
                      className="border p-2 rounded-md shadow-sm"
                      {...register("fechaLimite", { required: true })}
                     
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
          <TasksSection tasks={sortedTasks} setEditTask={setEditTask} setTasks={setTasks} juridicoData={juridicoData} setJuridicoData={setJuridicoData} juridicoDeleteData={juridicoDeleteData} setJuridicoDeleteData={setJuridicoDeleteData} juridico={juridico} setJuridico={setJuridico} setCurrentStep={setCurrentStep} />

          {/* Formulario para eliminar observaciones */}
          <form></form>
        </div>
      </>
    </DndProvider>
  );
};
