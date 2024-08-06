import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAllPagosLists,
  getPagosListsErrors,
  getPagosListsStatus,
  fetchPagosLists,
  forceUpdatePagosLists
} from "../redux/juridico/pagosPendientesSlice";

export const LatePaymentsListe = () => {
       // const posts = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const posts = useSelector(selectAllPagosLists);
  const postsStatus = useSelector(getPagosListsStatus);
  const postsErors = useSelector(getPagosListsErrors);
  console.log("payments list", posts);

  const [notificationShown, setNotificationShown] = useState(false);
  const [pastTasks, setPastTasks] = useState([]);

  useEffect(() => {
    if (postsStatus === "idle") {
      dispatch(fetchPagosLists());
    }
  }, [postsStatus, dispatch]);

 

  //Función para filtrar tareas pasadas usando flatMap
  const filterPastDueTasks = (data) => {
    const now = new Date();
    return data.flatMap((item) =>
      item.calendarioLista.filter((task) => new Date(task.fechaLimite) < now)
    );
  };

  // Llamar a la función para obtener las tareas pasadas
  const pastDueTasks = filterPastDueTasks(posts);
  console.log("pagos pasadas de fecha:", pastDueTasks);

  // Función para mostrar notificaciones con retraso
  //    const showDelayedNotifications = (tasks) => {
  //      tasks.forEach((task, index) => {
  //        setTimeout(() => {
  //          toast.warn(
  //            `Tarea retrasada: ${task.actividad} - Fecha Límite: ${task.fechaLimite}`,
  //            {
  //              position: toast.POSITION.TOP_LEFT,
  //            }
  //          );
  //        }, index * 3000); // 3000ms (3 segundos) de retraso entre cada notificación
  //      });
  //    };

  // Mostrar una notificación si hay tareas pasadas
  useEffect(() => {
    if (pastDueTasks.length > 0 && !notificationShown) {
      setPastTasks(pastDueTasks);
      toast.warn(`Hay ${pastDueTasks.length} pagos(s) retrasado(s)`, {
        position: toast.POSITION.TOP_LEFT,
      });
    }
    setNotificationShown(true); // Marcar la notificación como mostrada
  }, [pastDueTasks]);

  // Agregar una función para forzar la actualización de los datos
  const handleUpdatePosts = () => {
    dispatch(forceUpdatePagosLists());
  };
 
  return (
    <>
    <div className="  xl:w-[600px] mb-10 " >
      {postsStatus === "loading" ? (
        <p>Loading...</p>
      ) : (
        <main className="flex flex-col items-center gap-8 mt-8">
          <h1 className="font-bold">PAGOS RETRASADOS</h1>
         
          {pastTasks.length === 0 ? (
            <p>Aún no hay pagos retrasados</p>
          ) : (
            <>
              {pastTasks.map((item) => (
                <div
                  className=" bg-white shadow-lg xl:w-[500px] flex items-center gap-5 p-3"
                  key={item._id}
                >
                  <div className="flex flex-col">
                    <label className=" font-bold">CLIENTE</label>
                    <p> {item.comprador}</p>
                  </div>
                  <div className="flex flex-col">
                    <label className=" font-bold">PAGO PENDIENTE</label>
                    <p> {item.cantidad}</p>
                  </div>
                  <div className="flex flex-col">
                    <label className=" font-bold">Fecha Limite</label>
                    <p> {item.fechaLimite}</p>
                  </div>
                  <div className="flex flex-col">
                    <label className=" font-bold">TELEFONO</label>
                    <p> {item.telefono}</p>
                  </div>
                  <div className="flex flex-col">
                    <label className=" font-bold">DIRECCION</label>
                    <p> {item.direccion}</p>
                  </div>
                  <button onClick={() =>   window.open( item.url, '_blank') }>Ver</button>
                </div>
              ))}
            </>
          )}
        </main>
      )}
      </div>
    </>
  );
}
