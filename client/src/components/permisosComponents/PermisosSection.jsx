import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Swal from "sweetalert2";
import { DndContext, DndProvider, useDrop, useDrag } from "react-dnd";
import { PermitCard } from "./PermitCard";
import { NavLink, Link, useNavigate } from "react-router-dom";

export const PermisosSection = ({
  permisos,
  setPermisos,
  usuario,
  setUserPermits,
  userPermits,
  setUsuario,
}) => {
  const [todo, setTodo] = useState([]);
  const [usuarioPermit, setUsuarioPermit] = useState([]);

  const [checkUsuarioData, setcheckUsuarioData] = useState(false);

  const [todos, settodosPermisos] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [showSaveButton, setShowSaveButton] = useState(false);

  const navigate = useNavigate();

  console.log("permisos", permisos);
  console.log("usuarioSection", usuario.permisos);

  useEffect(() => {
    const fTodos = permisos.filter((permiso) => permiso.status === "PERMISOS");
    const fInProgress = permisos.filter(
      (permiso) => permiso.status === "AGREGAR PERMISOS"
    );

    settodosPermisos(fTodos);
    setInProgress(fInProgress);

    // Determinar si hay elementos en la categoría "AGREGAR PERMISOS" para mostrar u ocultar el botón de guardar
    setShowSaveButton(fInProgress.length > 0);
  }, [permisos]);

  const estados = ["PERMISOS", "AGREGAR PERMISOS"];

  const Section = ({
    status,
    permisos,
    usuarioPermiso,
    setPermisos,
    setUserPermits,
    userPermits,
    todos,
    inProgress,
  }) => {
    const [{ isOver }, drop] = useDrop(() => ({
      accept: "permiso",
      drop: (item) => addItemToSection(item.id),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }));

    const addItemToSection = (id) => {
      console.log("droppedItem", id, status);

      setPermisos((prev) => {
        const mTasks = prev.map((t) => {
          if (t._id === id) {
            return { ...t, status: status };
          }
          return t;
        });

        console.log("nuevosPermisos", mTasks);
        return mTasks;
      });
    };

    let title = "PERMISOS DISPONIBLES";
    let bg = "bg-red-300";
    let taskToMap = [];

    if (status === "PERMISOS") {
      bg = "bg-red-300";
      title = "PERMISOS DISPONIBLES";
      taskToMap = todos;
    }
    if (status === "AGREGAR PERMISOS") {
      bg = "bg-blue-300";
      title = "OTORGAR PERMISOS";
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
          taskToMap.map((permiso, index) => (
            <PermitCard key={index} permiso={permiso} permisos={permisos} />
            // <PermisoCardDnd key={index} permiso={permiso} permisos={permisos} />
          ))}
      </div>
    );
  };
  const Header = ({ title, bg, count }) => {
    return (
      <div className={`${bg} flex p-2 rounded-lg shadow-md`}>
        <h2 className="text-white font-bold">{title}</h2>
      </div>
    );
  };

  // Función para guardar los permisos de la categoría "AGREGAR PERMISOS"
  const handleSavePermissions = async () => {
    const result = await Swal.fire({
      title: `GUARDAR PERMISOS SELECCIONADOS?`,
      text: "Podran ser eliminados en caso de un error",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Guardar!",
    });

    if (result.isConfirmed) {
      try {
        console.log("nuevos permisos de usuarios", inProgress);
        // Agregar la propiedad select: false a cada objeto en inProgress
        const inProgressWithSelect = inProgress.map((item) => ({
          ...item,
          select: false,
        }));

        // Paso 1: Crear una copia del array de permisos del usuario
        const newArrayObjeto = [...usuario.permisos];

        // Paso 2: Concatenar los elementos de inProgressWithSelect al newArrayObjeto
        const mergedArray = newArrayObjeto.concat(...inProgressWithSelect);

        console.log("inProgressSelect", mergedArray)

        // Paso 3: Actualizar el estado del usuario con el nuevo array de permisos 
         setcheckUsuarioData(true);
         setUsuario({
           ...usuario,
           permisos: mergedArray,
         });
      } catch (error) {
        toast.error(error);
      }
    }
  };

  // useEffect para actualizar el formulario después de que juridicoData cambie
  useEffect(() => {
    let neData = usuario;
    // console.log("uausarioDataActualizado", neData);

    if (checkUsuarioData) {
      console.log("handleUpdateUsuario", neData);
      handleUpdatePermisos(neData);
    }

    return () => {
      console.log("fase desmintaje");
    };
  }, [usuario]);

  const handleUpdatePermisos = async (newData) => {
    console.log("newData en el handle", newData);
    try {
      // Actualizar los datos en el servidor
      const responseUpdate = await axios.put(
        `http://localhost:3000/api/usersData/${usuario._id}`,
        newData
      );

      toast.success("PERMISOS ACTUALIZADOS");
      navigate("/usuarios");
    } catch (error) {
      setcheckUsuarioData(false);
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-baseline">
      <div className=" w-[800px] flex gap-5 p-4">
        {estados.map((status, index) => (
          <Section
            key={index}
            status={status}
            permisos={permisos}
            usuarioPermiso={usuario.permisos}
            setPermisos={setPermisos}
            setUserPermits={setUserPermits}
            userPermits={userPermits}
            todos={todos}
            inProgress={inProgress}
          />
        ))}
      </div>
      {showSaveButton && ( // Mostrar el botón de guardar solo si hay elementos en la categoría "AGREGAR PERMISOS"
        <button
          className=" bg-black text-white p-2 rounded-md shadow-md"
          onClick={handleSavePermissions}
        >
          Guardar Permisos
        </button>
      )}
    </div>
  );
};
