import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
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

  const [juridicoNot, setJuridicoNot] = useState([])
  const [loadingJuridicoNot, setLoadingJuridicoNot] = useState(false)
  let pastDueTasks;

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

  


  const fetchJuridico = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/juridicoData`);
      console.log("juridicoNotData", response.data);
      setJuridicoNot(response.data);
      const pastDueTasks = filterPastDueTasks(response.data);
      setPastTasks(pastDueTasks);
      setLoadingJuridicoNot(true);
      
      if (pastDueTasks.length > 0 && !notificationShown) {
        toast.warn(`Hay ${pastDueTasks.length} tarea(s) retrasada(s)`, {
          position: toast.POSITION.TOP_LEFT,
        });
        setNotificationShown(true);
      }
    } catch (error) {
      console.log(error);
      setLoadingJuridicoNot(false);
    }
  };

  useEffect(() => {
    fetchJuridico();
  }, []);

  // Llamar a la función para obtener las tareas pasadas
  //const pastDueTasks = filterPastDueTasks(posts);
  

  //console.log("Tareas pasadas de fecha:", pastDueTasks);

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
  // useEffect(() => {
  //   if (pastDueTasks.length > 0 && !notificationShown) {
  //     setPastTasks(pastDueTasks);
  //     toast.warn(`Hay ${pastDueTasks.length} tarea(s) retrasada(s)`, {
  //       position: toast.POSITION.TOP_LEFT,
  //     });
  //   }
  //   setNotificationShown(true); // Marcar la notificación como mostrada
  // }, [pastDueTasks]);

  

  return (
    <>
    <div className="  xl:w-[600px] mb-10 " >
      {!loadingJuridicoNot  ? (
        <p>Loading...</p>
      ) : (
        <main className="flex flex-col items-center gap-8 mt-8">
          <h1 className="font-bold">TAREAS PASADAS</h1>
        
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
