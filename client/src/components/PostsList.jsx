import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAllPosts,
  getPostsErrors,
  getPostsStatus,
  fetchPosts,
  forceUpdatePosts
} from "../redux/juridico/postSlice";


export const PostsList = () => {
  // const posts = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const posts = useSelector(selectAllPosts);
  const postsStatus = useSelector(getPostsStatus);
  const postsErors = useSelector(getPostsErrors);
  console.log("listaPosts", posts);

  const [notificationShown, setNotificationShown] = useState(false);
  const [pastTasks, setPastTasks] = useState([]);

  useEffect(() => {
    if (postsStatus === "idle") {
      dispatch(fetchPosts());
    }
  }, [postsStatus, dispatch]);

 

  //Función para filtrar tareas pasadas usando flatMap
  const filterPastDueTasks = (data) => {
    const now = new Date();
    return data.flatMap((item) =>
      item.tareasLista.filter((task) => new Date(task.fechaLimite) < now)
    );
  };

  // Llamar a la función para obtener las tareas pasadas
  const pastDueTasks = filterPastDueTasks(posts);
  console.log("Tareas pasadas de fecha:", pastDueTasks);

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
      toast.warn(`Hay ${pastDueTasks.length} tarea(s) retrasada(s)`, {
        position: toast.POSITION.TOP_LEFT,
      });
    }
    setNotificationShown(true); // Marcar la notificación como mostrada
  }, [pastDueTasks]);

  // Agregar una función para forzar la actualización de los datos
  const handleUpdatePosts = () => {
    dispatch(forceUpdatePosts());
  };

  return (
    <>
    <div className="  xl:w-[600px] mb-10 " >
      {postsStatus === "loading" ? (
        <p>Loading...</p>
      ) : (
        <main className="flex flex-col items-center gap-8 mt-8">
          <h1 className="font-bold">TAREAS PASADAS</h1>
          <button onClick={handleUpdatePosts} className="btn btn-primary">Actualizar Tareas</button>
          {pastTasks.length === 0 ? (
            <p>Aún no hay tareas</p>
          ) : (
            <>
              {pastTasks.map((tarea) => (
                <div
                  className=" bg-white shadow-lg xl:w-[500px] flex items-center gap-5 p-3"
                  key={tarea._id}
                >
                  <div className="flex flex-col">
                    <label className=" font-bold">Encargado Proceso</label>
                    <p> {tarea.encargado}</p>
                  </div>
                  <div className="flex flex-col">
                    <label className=" font-bold">Actividad</label>
                    <p> {tarea.actividad}</p>
                  </div>
                  <div className="flex flex-col">
                    <label className=" font-bold">Fecha Limite</label>
                    <p> {tarea.fechaLimite}</p>
                  </div>
                  <button onClick={() =>   window.open( tarea.url, '_blank') }>Ver</button>
                </div>
              ))}
            </>
          )}
        </main>
      )}
      </div>
    </>
  );
};
