import React, { useState, useRef, useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export const PermisosUsers = ({ usuario, userPermits, setUsuario }) => {
  console.log("permisosUser", usuario);
  console.log("userPermits", userPermits);
  const [permisosActuales, setpermisosActuales] = useState(userPermits);
  const [editar, setEditar] = useState(false);
  const [seleccionados, setSeleccionados] = useState(userPermits);
  const selectedExtrasRef = useRef([]);
  const [checkUsuarioData, setcheckUsuarioData] = useState(false);
  const navigate = useNavigate();

  const toggleEditar = () => {
    setEditar(!editar);
  };

  const toggleSeleccionados = (id) => {
    const updatedOptions = permisosActuales.map((option) =>
      option._id === id ? { ...option, select: !option.select } : option
    );

    setpermisosActuales(updatedOptions);
  };

  useEffect(() => {
    const selectedItems = permisosActuales.filter((option) => option.select);
    console.log("permisosSeleccionadosEffect", selectedItems);
    selectedExtrasRef.current = selectedItems;
    console.log("productoExtra", selectedExtrasRef.current);
  }, [permisosActuales]);

  const handleDeletePermit = async (index) => {
    const result = await Swal.fire({
      title: `BORRAR ESTE PERMISO?`,
      text: "Puedes volver a agregar este permiso en cualquier momento",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Borrar!",
    });

    if (result.isConfirmed) {
      try {
        console.log("permisosSeleccionados", selectedExtrasRef.current);

        // Obtener los permisos no seleccionados
        const permisosNoSeleccionados = permisosActuales.filter((permiso) => {
          // Verificar si el permiso actual no está en los permisos seleccionados
          return !selectedExtrasRef.current.some(
            (seleccionado) => seleccionado._id === permiso._id
          );
        });

        console.log("permisosNoSeleccionados", permisosNoSeleccionados);

        setcheckUsuarioData(true);
        setUsuario({
          ...usuario,
          permisos: permisosNoSeleccionados,
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

  const UserCard = ({ permit, index }) => {
    return (
      <div
        className={`relative p-4 mt-8 shadow-md rounded-md  border bg-white flex justify-between`}
      >
        <p>{permit.permiso}</p>

        {editar && (
          <input
            type="checkbox"
            checked={permit.select}
            onChange={() => toggleSeleccionados(permit._id)}
          />
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="bg-black text-white rounded-md flex flex-col items-center justify-center p-2 mb-5 w-[400px]">
        <p> PERMISOS ACTUALES DE:</p>
        <p> {usuario.email}</p>
      </div>
      {permisosActuales.length > 0 ? (
        <div>
          <div className="flex flex-col">
            <button
              className={`rounded-md p-1 ${
                editar ? "bg-red-700" : "bg-blue-700"
              } text-white`}
              onClick={editar ? handleDeletePermit : toggleEditar}
            >
              {editar ? "Eliminar Seleccionados?" : "Editar Permisos"}
            </button>
            {permisosActuales.map((permit, index) => (
              <UserCard key={index} permit={permit} />
            ))}
          </div>
        </div>
      ) : (
        <p>Este usuario aún no cuenta con permisos</p>
      )}
    </div>
  );
};
