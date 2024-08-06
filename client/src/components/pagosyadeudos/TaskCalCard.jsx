import React, { useState, useEffect, useContext } from "react";
import moment from "moment";
import { useDrag } from "react-dnd";
import { FaTrashAlt, FaRegEdit } from "react-icons/fa";
import { UsuarioContext } from "../../context/UsuarioContext";
import Swal from "sweetalert2";
import axios from "axios";
import { toast } from "react-toastify";

export const TaskCalCard = ({
    task,
    setCurrentStep,
    setEditTask,
    pagos,
    eliminarObservacion,
  }) => {
    const { userCOntext } = useContext(UsuarioContext);
    const [bgColor, setBgColor] = useState("");
  
    const handleTab = () => {
      setEditTask(task);
      // Llamar a la función onEdit con los datos de la tarea
      setCurrentStep(1);
    };
  
    const [{ isDragging }, drag] = useDrag(() => ({
      type: "task",
      item: { id: task._id },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }));
  
    console.log("isDraggin", isDragging);
  
    // Obtener la fecha actual
    const currentDate = moment();
  
    // Convertir las fechas de asignación y límite a objetos Moment
    const fechaAsignacion = moment(task.fechaAsignacion);
    const fechaLimite = moment(task.fechaLimite);
  
    // Calcular la diferencia en días entre la fecha límite y la fecha actual
    const diasRestantes = fechaLimite.diff(currentDate, "days");
    const isTaskDelayed = diasRestantes < 0;
  
    // Calcular los días de retraso si la tarea está retrasada
    let diasRetraso = 0;
    if (isTaskDelayed) {
      diasRetraso = Math.abs(diasRestantes);
    }
  
    // Mapea los títulos de los permisos a nombres de acciones
    const permissionsMapping = {
      deleteDocuments: "Borrar Documentos Juridicos",
      updateTaks: "Actualizar Tareas Juridicas",
      // Agrega más permisos aquí según sea necesario
    };
  
    // Verificar si el usuario tiene permisos para eliminar documentos
    const autorizacion = userCOntext.permisos.some(
      (permit) => permit.permiso === permissionsMapping.updateTaks
    );
  
    useEffect(() => {
      // Lógica para establecer el color de fondo del div principal
      if (task.status === "ACTIVA") {
        if (isTaskDelayed) {
          setBgColor("bg-red-500"); // Rojo si está retrasada
        } else if (diasRestantes < 10) {
          setBgColor("bg-yellow-500"); // Amarillo si quedan menos de 10 días
        } else {
          setBgColor("bg-green-500"); // Verde si quedan más de 10 días
        }
      } else if (task.status === "FINALIZADA") {
        setBgColor("bg-blue-500"); // Azul si la tarea está finalizada
      }
    }, [task.status, diasRestantes, isTaskDelayed]);
  
    return (
      <>
        <div
          {...(autorizacion ? { ref: drag } : {})}
          //className="flex flex-col items-center justify-center bg-white gap-13 mt-5 p-2 rounded-lg shadow-lg"
          className={`flex flex-col items-center justify-center border-3 bg-white gap-13 mt-5 p-2 rounded-lg shadow-lg cursor-grab  ${
            isDragging ? " opacity-45" : ""
          }`}
        >
          <div className={`flex justify-between  ${bgColor} rounded-md  w-full p-2 mb-2`}>
            <button onClick={handleTab} className=" text-white">
              {" "}
              <FaRegEdit />
            </button>
            <button
              className=" text-white"
              onClick={() => eliminarObservacion(task._id)}
            >
              <FaTrashAlt />
            </button>
          </div>
          <h3 className=" font-semibold underline">{task.usuario}</h3>
          <p className=" font-semibold text-orange-500">OBSERVACION</p>
          <p className=" text-center">{task.observacion}</p>
          <p className=" text-center text-blue-500 font-medium">
            FECHA ASIGNACION
          </p>
  
          <p className=" text-center">
            {moment(task.fechaAsignacion).format("DD/MMM/YYYY")}
          </p>
          <p className=" text-center text-red-500 font-medium">FECHA LIMITE</p>
          <p className=" text-center">
            {moment(task.fechaLimite).format("DD/MMM/YYYY")}
          </p>
          <hr className="border-t-2 border-blue-500" />
          {/* <p className="text-center">{diasRestantes} DIAS</p> */}
          {task.status === "ACTIVA" ? (
            <>
              {isTaskDelayed ? (
                <>
                  <p className="text-center text-red-500 font-medium">
                    RETRASADA
                  </p>
                  <p className="text-center">{`${diasRetraso} días`}</p>
                </>
              ) : (
                <>
                  <p className="text-center text-green-500 font-medium">
                    TIEMPO RESTANTE
                  </p>
                  <p className="text-center">{`${diasRestantes} días`}</p>
                </>
              )}
            </>
          ) : (
            <p className="text-center text-green-500 font-medium">
              TAREA CONCLUIDA
            </p>
          )}
        </div>
      </>
    );
}
