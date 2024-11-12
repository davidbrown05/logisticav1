import React, { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { FiExternalLink } from "react-icons/fi";
import axios from "axios";
import moment from "moment";
import { RecordatoriosContext } from "../context/RecordatoriosContext";

export const RecordatoriosNot = () => {
    const [pastTasks, setPastTasks] = useState([]); // Para almacenar tareas atrasadas
    const [notificationShown, setNotificationShown] = useState(false); // Controlar la notificación
    const { recordatorios, loadingRecordatorios } = useContext(RecordatoriosContext);
  
    // Función para filtrar tareas pasadas
    const filterPastDueTasks = (data) => {
      const now = new Date();
      return data.filter((task) => {
        const fechaRecordatorio = new Date(task.fechaRecordatorio); // Convertir el string de fecha a un objeto Date
        console.log("Fecha del recordatorio:", fechaRecordatorio); // Verificar la fecha en consola
        return fechaRecordatorio < now; // Filtrar si la fecha es anterior a la actual
      });
    };
  
    useEffect(() => {
      console.log("Recordatorios cargados:", recordatorios); // Log para verificar los datos
      console.log("Cargando recordatorios:", loadingRecordatorios); // Log para verificar el estado de carga
      if (loadingRecordatorios) {
        const pastDueTasks = filterPastDueTasks(recordatorios);
        setPastTasks(pastDueTasks);
  
        // Si hay recordatorios atrasados y aún no se ha mostrado la notificación
        if (pastDueTasks.length > 0 && !notificationShown) {
          toast.warn(`Tienes ${pastDueTasks.length} recordatorio(s) atrasado(s)`, {
            position: toast.POSITION.TOP_LEFT,
          });
          setNotificationShown(true); // Marcar como mostrada la notificación
        }
      }
    }, [recordatorios, loadingRecordatorios, notificationShown]); 


  return <></>;
};
