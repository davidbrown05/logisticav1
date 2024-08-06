import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Swal from "sweetalert2";
import { DndContext, DndProvider, useDrop, useDrag } from "react-dnd";

import { NavLink, Link, useNavigate } from "react-router-dom";

import { forceUpdatePosts } from "../../redux/juridico/postSlice";
import { forceUpdatePagosLists } from "../../redux/juridico/pagosPendientesSlice";
import { useDispatch, useSelector } from "react-redux";
import { TaskCalCard } from "./TaskCalCard";

export const TaskCalSection = ({
  tasks,
  setTasks,
  pagosData,
  setpagosData,
  setPagos,
  setCurrentStep,
  setEditTask,
  currentUser,
  pagos,
  pagosDeleteData,
  setPagosDeleteData,
}) => {
  const [todo, setTodo] = useState([]);
  const [usuarioPermit, setUsuarioPermit] = useState([]);
  const [checkTareasData, setcheckTareasData] = useState(false);

  const [check, setCheck] = useState(false);

  const [todos, settodosPermisos] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleSeleccionados = (id) => {
    const updatedOptions = tasks.map((option) =>
      option._id === id ? { ...option, select: !option.select } : option
    );

    // setpermisosActuales(updatedOptions);
  };

  useEffect(() => {
    const fTodos = tasks.filter((task) => task.status === "ACTIVA");
    const fInProgress = tasks.filter((task) => task.status === "FINALIZADA");

    settodosPermisos(fTodos);
    setInProgress(fInProgress);

    // Determinar si hay elementos en la categoría "AGREGAR PERMISOS" para mostrar u ocultar el botón de guardar
    setShowSaveButton(fInProgress.length > 0);
  }, [tasks]);

  // Función para guardar los permisos de la categoría "AGREGAR PERMISOS"
  const handleSavePermissions = async () => {
    const result = await Swal.fire({
      title: `ACTUALIZAR PAGOS?`,
      text: "Los cambios pueden revertirse en cualquier momento ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Guardar!",
    });

    if (result.isConfirmed) {
      try {
        console.log("actualizacion de pagos", tasks);
        // Agregar la propiedad select: false a cada objeto en inProgress
        const inProgressWithSelect = inProgress.map((item) => ({
          ...item,
          select: false,
        }));

        // Paso 1: Crear una copia del array de permisos del usuario
        const newArrayObjeto = [...pagosData.calendarioLista];

        // Paso 2: Concatenar los elementos de inProgressWithSelect al newArrayObjeto
        const mergedArray = newArrayObjeto.concat(...inProgressWithSelect);

        console.log("inProgressSelect", mergedArray);

        // Paso 3: Actualizar el estado del usuario con el nuevo array de permisos
        setcheckTareasData(true);
        console.log("actualizarTareasCheck", checkTareasData);
        setpagosData({
          ...pagosData,
          calendarioLista: tasks,
        });
      } catch (error) {
        toast.error(error);
      }
    }
  };

  // useEffect para actualizar el formulario después de que juridicoData cambie
  useEffect(() => {
    let neData = pagosData;
    // console.log("uausarioDataActualizado", neData);

    if (checkTareasData) {
      console.log("handleUpdateUsuario", neData);
      handleUpdateTareas(neData);
    }

    return () => {
      console.log("fase desmintaje");
    };
  }, [pagosData]);

  const handleUpdateTareas = async (newData) => {
    console.log("newData en el handle", newData);
    try {
      // Actualizar los datos en el servidor
      const responseUpdate = await axios.put(
        `http://localhost:3000/api/pagosData/${pagosData._id}`,
        newData
      );

      const nuevosDatos = await responseUpdate.data;

      console.log("datos actualizados", nuevosDatos);

      // Volver a obtener los datos del servidor después de la actualización
      const response = await axios.get(
        `http://localhost:3000/api/pagosData/${newData._id}`
      );

      // Actualizar el contexto con los nuevos datos
      // setJuridico(response.data);
      setPagos(nuevosDatos);

      setcheckTareasData(false);
      dispatch(forceUpdatePagosLists()); // Despachar la acción para agregar una nueva tarea
      setLoading(false);

      toast.success("PAGOS ACTUALIZADOS");
    } catch (error) {
      setcheckTareasData(false);
      console.log(error);
      toast.error(error.message);
    }
  };

  //---------------------------------------------------SECCION PARA ELIMINAR TAREAS
  const eliminarObservacion = async (_id) => {
    console.log("id", _id);
    const result = await Swal.fire({
      title: `ELIMINAR PAGO?`,
      text: "No podras recuperar estos datos",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar",
    });

    if (result.isConfirmed) {
      try {
        const newArrayObjeto = [...pagosData.calendarioLista];
        const indexAEliminar = newArrayObjeto.findIndex(
          (objeto) => objeto._id === _id
        );
        if (indexAEliminar !== -1) {
          // Verifica si se encontró el objeto
          newArrayObjeto.splice(indexAEliminar, 1); // Elimina el objeto del array
        }

        console.log("newArray", newArrayObjeto);
        setCheck(true);
        console.log("check", check);

        // setCheckJuridico(false);

        setpagosData({
          ...pagosData,
          calendarioLista: newArrayObjeto,
        });

        setTasks(newArrayObjeto);

        setPagosDeleteData({
          ...pagosDeleteData,
          calendarioLista: newArrayObjeto,
        });
      } catch (error) {
        setLoading(false);
        setCheck(false);
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const handleDelete = async (_id) => {};

  // useEffect para actualizar el formulario después de eliminar juridicoData
  useEffect(() => {
    console.log("checkJuridicoDelte", check);
    console.log("useEffectActivado");
    let neData = pagosDeleteData;
    console.log("juridicoDataDeletedActualizado", neData);

    if (check) {
      console.log("handleUpdate2", neData);
      handleUpdate2(neData);
    }

    return () => {
      console.log("fase desmintaje");
    };
  }, [pagosDeleteData]);

  const handleUpdate2 = async (newData) => {
    console.log("newData en el handle", newData);

    try {
      // Actualizar los datos en el servidor
      const responseUpdate = await axios.put(
        `http://localhost:3000/api/pagosData/${pagosData._id}`,
        newData
      );

      const nuevosDatos = await responseUpdate.data;

      console.log("datos actualizados", nuevosDatos);

      // Volver a obtener los datos del servidor después de la actualización
      const response = await axios.get(
        `http://localhost:3000/api/pagosData/${newData._id}`
      );

      // Actualizar el contexto con los nuevos datos
      // setJuridico(response.data);
      setPagos(nuevosDatos);
      dispatch(forceUpdatePagosLists()); // Despachar la acción para agregar una nueva tarea

      setCheck(false);
      setLoading(false);
      toast.success("PAGOS ACTUALIZADOS");
    } catch (error) {
      setCheck(false);
      console.log(error);
      toast.error(error.message);
    }
  };
  //---------------------------------------------------------------------------TERMINA SECCION ELIMINAR TAREAS
  //----------------------------------------------------------------------------START SECTION COMPONENT
  const estados = ["ACTIVA", "FINALIZADA"];
  const Section = ({ status, tasks, setTasks, todos, inProgress }) => {
    const [{ isOver }, drop] = useDrop(() => ({
      accept: "task",
      drop: (item) => addItemToSection(item.id),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }));

    const addItemToSection = (id) => {
      console.log("droppedItem", id, status);

      setTasks((prev) => {
        const mTasks = prev.map((t) => {
          if (t._id === id) {
            return { ...t, status: status };
          }
          return t;
        });

        console.log("nuevosTasks", mTasks);
        return mTasks;
      });
    };

    let title = "TAREAS ACTIVAS";
    let bg = "bg-yellow-500";
    let taskToMap = [];

    if (status === "ACTIVA") {
      bg = "bg-yellow-500";
      title = "PAGOS PENDIENTES";
      taskToMap = todos;
    }
    if (status === "FINALIZADA") {
      bg = "bg-green-400";
      title = "PAGOS CUMPLIDOS";
      taskToMap = inProgress;
    }
    return (
      <div
        ref={drop}
        className={`w-[600px] bg-gray-200 rounded-lg p-3 ${
          isOver ? "bg-slate-300 border border-dotted" : ""
        }`}
      >
        <Header title={title} bg={bg} />
        {taskToMap.length > 0 &&
          taskToMap.map((task, index) => (
            <TaskCalCard
              key={index}
              task={task}
              tasks={tasks}
              setTasks={setTasks}
              setCurrentStep={setCurrentStep}
              setEditTask={setEditTask}
              currentUser={currentUser}
              pagosData={pagosData}
              setpagosData={setpagosData}
              pagos={pagos}
              setPagos={setPagos}
              eliminarObservacion={eliminarObservacion}
            /> 
            // <PermisoCardDnd key={index} permiso={permiso} permisos={permisos} />
          ))}
      </div>
    );
  };

  //--------------------------------------------------------------END SECTION COMPONENT
  const Header = ({ title, bg, count }) => {
    return (
      <div className={`${bg} flex p-2 rounded-lg shadow-md`}>
        <h2 className="text-white font-bold">{title}</h2>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-start">
      <div className=" flex gap-3 justify-between  w-[900px]">
        <button
          className=" bg-black text-white p-1 rounded-md shadow-md text-[10px]"
          onClick={handleSavePermissions}
        >
          ACTUALIZAR PAGOS
        </button>
      </div>
      <div className=" w-[900px] flex gap-5 p-4">
        {estados.map((status, index) => (
          <Section
            key={index}
            status={status}
            tasks={tasks}
            setTasks={setTasks}
            todos={todos}
            inProgress={inProgress}
          />
        ))}
      </div>
    </div>
  );
};
