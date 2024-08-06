import React, { useState, useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { toast } from "react-toastify";

// DnD
import { DndContext, DragOverlay } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { PermisoCard } from "../components/PermisoCard";

export default function Permisos() {
  //get product id from url
  const { id } = useParams();
  console.log("id", id);
  const [permisos, setPermisos] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [loading, setisLoading] = useState(false);
  const [dataDownloaded, setDownloaded] = useState(false);

  const [container, setContainer] = useState([]);
  const [activeid, setactiveid] = useState(null);

  const [containerName, setContainerName] = useState("");
  const [itemName, setItemName] = useState("");
  const [showAddContainerModal, setShowAddContainerModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);

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
      // const response = await axios.get("http://localhost:3000/api/usersData", {
      //   params: { searchTerm, page, limit: 10 },
      // });

      const response = await axios.get(
        `http://localhost:3000/api/usersData/${id}`
      );
      console.log("responseData", response.data)

      // const user = response.data.find((item) => {
      //   return item._id === id;
      // });

      setUsuario(user);
      console.log("usuario", usuario);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPermisos();
    getUsuario();
  }, []);

  useEffect(() => {
    if (usuario !== null) {
      console.log("usuario", usuario);
      // Aquí puedes realizar acciones adicionales después de que usuario se actualice
    }
  }, [usuario]);

  const permisosIds = useMemo(() => {
    return permisos.map((item) => item._id);
  }, [permisos]);

  return (
    <>
      <div className="grid lg:grid-cols-3  m-5 mx-auto items-center justify-between gap-5 p-1">
        <DndContext>
         
          {/* div table todos los permisos */}
          <div>
            <SortableContext items={permisosIds}>
              {dataDownloaded ? (
                <div>
                  {permisos.map((item, index) => (
                    <PermisoCard key={index} permiso={item} />
                  ))}
                </div>
              ) : (
                <div>Cargando datos...</div>
              )}
            </SortableContext>
          </div>
          {/* zona de drop */}
          <div>DROPZONE</div>
          <div>div3</div>
         
        </DndContext>
      </div>
    </>
  );
}
