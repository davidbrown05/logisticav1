import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AdeudosContext = createContext();

const AdeudosProvider = ({ children, id }) => {
  const [adeudos, setAdeudos] = useState([]);
  const [loadingAdeudos, setLoadingAdeudos] = useState(false); 

  const fetchAdeudos = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/adeudosData/${id}`
      );
      console.log("adeudosDataContext", response.data[0]);
      setAdeudos(response.data[0]);
      setLoadingAdeudos(true)
    } catch (error) {
      console.log(error);
      setLoadingAdeudos(false)
    }
  };

  useEffect(() => {
    // Limpiar el estado de juridico al desmontar o cuando cambia el id
    return () => {
      setAdeudos([]);
    };
  }, [id]);  // Agregar id como dependencia para que se vuelva a ejecutar cuando cambie

  useEffect(() => {
    fetchAdeudos();
  }, [id]);  // Agregar id como dependencia para que se vuelva a ejecutar cuando cambie

  return (
    <AdeudosContext.Provider value={{ adeudos,setAdeudos,loadingAdeudos }}>
      {loadingAdeudos && children}
    </AdeudosContext.Provider>
  );
};

export default AdeudosProvider;