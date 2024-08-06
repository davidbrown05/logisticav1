import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const PagosContext = createContext();

const PagosProvider = ({ children, id }) => {
  const [pagos, setPagos] = useState([]);
  const [loadingPagos, setLoadingPagos] = useState(false); 

  const fetchPagos = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/pagosData/${id}`
      );
      console.log("juridicoDataContext", response.data[0]);
      setPagos(response.data[0]);
      setLoadingPagos(true)
    } catch (error) {
      console.log(error);
      setLoadingPagos(false)
    }
  };

  useEffect(() => {
    // Limpiar el estado de juridico al desmontar o cuando cambia el id
    return () => {
      setPagos([]);
    };
  }, [id]);  // Agregar id como dependencia para que se vuelva a ejecutar cuando cambie

  useEffect(() => {
    fetchPagos();
  }, [id]);  // Agregar id como dependencia para que se vuelva a ejecutar cuando cambie

  return (
    <PagosContext.Provider value={{ pagos,setPagos,loadingPagos }}>
      {loadingPagos && children}
    </PagosContext.Provider>
  );
};

export default PagosProvider;