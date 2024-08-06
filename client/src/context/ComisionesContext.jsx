import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const ComisionesContext = createContext();

const ComisionesProvider = ({ children, id }) => {
  const [comisiones, setComisiones] = useState([]);
  const [loadingComisiones, setLoadingComisiones] = useState(false); 

  const fetchComisiones = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/comisionesData/${id}`
      );
      console.log("comisionesDataContext", response.data[0]);
      setComisiones(response.data[0]);
      setLoadingComisiones(true)
    } catch (error) {
      console.log(error); 
      setLoadingComisiones(false)
    }
  };

  useEffect(() => {
    // Limpiar el estado de juridico al desmontar o cuando cambia el id
    return () => {
      setComisiones([]);
    };
  }, [id]);  // Agregar id como dependencia para que se vuelva a ejecutar cuando cambie

  useEffect(() => {
    fetchComisiones();
  }, [id]);  // Agregar id como dependencia para que se vuelva a ejecutar cuando cambie

  return (
    <ComisionesContext.Provider value={{ comisiones,setComisiones,loadingComisiones }}>
      {loadingComisiones && children}
    </ComisionesContext.Provider>
  );
};

export default ComisionesProvider;