import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const RecordatoriosContext = createContext();

const RecordatoriosProvider = ({ children}) => {
  const [recordatorios, setrecordatorios] = useState([]);
  const [loadingRecordatorios, setloadingRecordatorios] = useState(false); 

  const fetchRecordatorios = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/recordatorios`
      );
      console.log("recordatoriosDataContext", response.data);
      setrecordatorios(response.data);
      setloadingRecordatorios(true)
    } catch (error) {
      console.log(error);
      setloadingRecordatorios(false)
    }
  };

  useEffect(() => {
    // Limpiar el estado de juridico al desmontar o cuando cambia el id
    return () => {
      setrecordatorios([]);
    };
  }, []);  // Agregar id como dependencia para que se vuelva a ejecutar cuando cambie

  useEffect(() => {
    fetchRecordatorios();
  }, []);  // Agregar id como dependencia para que se vuelva a ejecutar cuando cambie

  return (
    <RecordatoriosContext.Provider value={{ recordatorios,setrecordatorios,loadingRecordatorios }}>
      {loadingRecordatorios && children}
    </RecordatoriosContext.Provider>
  );
};

export default RecordatoriosProvider;