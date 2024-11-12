import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiExternalLink } from "react-icons/fi";
import axios from "axios";
import moment from "moment";

export const JuridicoNotPreview = () => {
  const [pastTasks, setPastTasks] = useState([]);
  const [loadingJuridicoNot, setLoadingJuridicoNot] = useState(false);
  const [notificationShown, setNotificationShown] = useState(false);

  //Función para filtrar tareas pasadas usando flatMap
  const filterPastDueTasks = (data) => {
    const now = new Date();
    return data.flatMap((item) =>
      item.tareasLista.filter((task) => new Date(task.fechaLimite) < now)
    );
  };

  const fetchJuridico = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/juridiconot`);
      console.log("juridicoNotData", response.data);

      setLoadingJuridicoNot(true);

      const pastDueTasks = filterPastDueTasks(response.data);
      setPastTasks(pastDueTasks);

      if (pastDueTasks.length > 0 && !notificationShown) {
        toast.warn(`Hay ${response.data.length} tarea(s) retrasada(s)`, {
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

  return (
    <div className="xl:w-[600px] mb-10">
      {!loadingJuridicoNot ? (
        <p>Loading...</p>
      ) : (
        <main className="flex flex-col items-center gap-8 mt-5">
          <h1 className="font-bold">TAREAS RETRASADAS</h1>
          {pastTasks.length === 0 ? (
            <p>Aún no hay tareas</p>
          ) : (
            <>
              {/* tabla */}
              <div className="md:w-[500px] lg:w-[500px] xl:w-[500px] overflow-x-auto w-[340px]">
                {pastTasks.length > 0 ? (
                  <table className="w-full mt-4 bg-white  rounded-md shadow-md mb-4">
                    <thead>
                      <tr>
                        <th className="border p-2">ENCARGADO PROCESO</th>
                        <th className="border p-2">ACTIVIDAD</th>
                        <th className="border p-2">FECHA LIMITE</th>
                        <th className="border p-2"></th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {pastTasks.map((item, index) => (
                        <tr key={index} className="mt-2 text-center">
                          <td className="border p-3  max-w-[200px]">
                            {item.encargado}
                          </td>
                          <td className="border p-3 text-center">
                            {" "}
                            {moment(item.fechaLimite).format("DD/MMM/YYYY")}
                          </td>
                          <td className="border p-3 text-center">
                            {item.actividad}
                          </td>
                          <td className="border p-3 text-center">
                            <button
                              onClick={(e) => {
                                window.location.href = item.url;
                              }}
                              className="bg-yellow-500 text-white px-2 py-1 rounded shadow-lg"
                            >
                              <FiExternalLink />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="font-bold text-xl mb-10">
                    Aún no hay observaciones.
                  </p>
                )}
              </div>
            </>
          )}
        </main>
      )}
    </div>
  );
};
