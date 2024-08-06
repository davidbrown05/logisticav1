import React, { useState, useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { toast } from "react-toastify";
import { createPortal } from "react-dom";
import { PermisoCard } from "../components/PermisoCard";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndContext, DndProvider, useDrop, useDrag } from "react-dnd";

import { PermisosSection } from "../components/permisosComponents/PermisosSection";
import { PermisosUsers } from "../components/permisosComponents/PermisosUsers";
 
const PermisosDnD = () => {
  //get product id from url
  const { id } = useParams();
  console.log("id", id);
  const [permisos, setPermisos] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [userPermits, setUserPermits] = useState([]);
  const [loading, setisLoading] = useState(false);
  const [dataDownloaded, setDownloaded] = useState(false);
  const [downloadedUser, setDownloadedUser] = useState(false);

  const [modulo, setmodulo] = useState("");

  const getPermisos = async () => {
    try {
      setisLoading(true);
      const response = await axios.get(
        "http://localhost:3000/api/permisosData"
      );
      console.log("responseDatapermisos", response.data);

      setPermisos(response.data);
      setisLoading(false);
      setDownloaded(true);
    } catch (error) {
      console.log(error);
      setisLoading(false);
    }
  };
  const getUsuario = async () => {
    try {
      setisLoading(true);
      // const response = await axios.get("http://localhost:3000/api/usersData");

      const response = await axios.get(
        `http://localhost:3000/api/usersData/${id}`
      );

      // const user = response.data.find((item) => {
      //   return item._id === id;
      // });

      const user = response.data
      console.log("respondeData", user)

      setUsuario(user);
      setUserPermits(user.permisos);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsuario();
    getPermisos();
  }, []);

  useEffect(() => {
    if (usuario) {
      console.log("usuario", usuario);
      console.log("userOermit", userPermits);
      setDownloadedUser(true);
      // Aquí puedes realizar acciones adicionales después de que usuario se actualice
    }
  }, [usuario]);

  return (
    <DndProvider backend={HTML5Backend}>
      <>
        <div className=" flex items-center gap-5 ">
          <Link to={"/usuarios"}>
            <button className=" bg-red-800 text-white p-2  ml-4 mt-4 rounded-md shadow-md">
              CANCELAR
            </button>
          </Link>
          <h3 className=" font-bold mt-4">
            SECCIÓN DE PERMISOS: ARRASTRE Y SUELTE PARA OTORGAR PERMISOS
          </h3>
        </div>

        <div className="flex flex-col lg:flex-row bg-gray-300 h-auto mt-10 p-2 rounded-md justify-evenly items-start gap-10">
          <div className=" bg-gray-100 h-auto overflow-x-auto  p-2 rounded-md">
            {dataDownloaded && downloadedUser ? (
              <div>
                <div className="flex flex-col">
                  <label className=" font-semibold">MODULO</label>
                  <select
                    value={modulo}
                    onChange={(e) => setmodulo(e.target.value)}
                    //onChange={(e) => (visitadaRef.current = e.target.value)}
                    className="border p-2 rounded-md shadow-sm"
                  >
                    <option value="" disabled>
                      Seleccione una Modulo
                    </option>
                    <option value="comisiones">COMISIONES</option>
                    <option value="compradores">COMPRADORES</option>
                    <option value="deudas">DEUDAS</option>
                    <option value="inmuebles">INMUEBLES</option>
                    <option value="juridico">JURIDICO</option>
                    <option value="pagos">PAGOS</option>
                    <option value="usuarios">USUARIOS</option>
                    <option value="ventas">VENTAS</option>
                  </select>
                </div>
                <PermisosSection 
                  // permisos={permisos}
                  permisos={permisos
                    .filter(
                      (permiso) =>
                        !userPermits.some((up) => up._id === permiso._id)
                    )
                    .filter(
                      (permiso) =>
                        modulo !== "" ? permiso.modulo === modulo : true // Aplicar filtro por módulo si se ha seleccionado alguno
                    )}
                  setPermisos={setPermisos}
                  usuario={usuario}
                  setUserPermits={setUserPermits}
                  userPermits={userPermits}
                  setUsuario={setUsuario}
                />
              </div>
            ) : (
              <div>Cargando datos...</div>
            )}
          </div>
          <div className="bg-gray-100 h-auto  p-2 rounded-md">
            {downloadedUser ? (
              <PermisosUsers
                usuario={usuario}
                userPermits={userPermits}
                setUsuario={setUsuario}
              />
            ) : (
              <div>Cargando permisos de usuaario</div>
            )}
          </div>
        </div>
      </>
    </DndProvider>
  );
};

export default PermisosDnD;
