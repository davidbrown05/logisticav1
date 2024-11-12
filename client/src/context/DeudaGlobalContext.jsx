import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const DeudaGlobalContext = createContext();

const DeudaGlobalProvider = ({ children }) => {
  const [deudaGlobalContext, setdeudaGlobalContext] = useState([]);
  const [loadingdeudaGlobalContext, setLoadingdeudaGlobalContext] = useState(false);

  const fetchdeudaGlobal = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/propertyDeudaData`);
      console.log("deudaGlobalContextDataContext", response.data);
      setdeudaGlobalContext(response.data);
      setLoadingdeudaGlobalContext(true);
    } catch (error) {
      console.log(error);
      setLoadingdeudaGlobalContext(false);
    }
  };

  useEffect(() => {
    // Limpiar el estado de juridico al desmontar o cuando cambia el id
    return () => {
        setdeudaGlobalContext([]);
    };
  }, []); // Agregar id como dependencia para que se vuelva a ejecutar cuando cambie

  useEffect(() => {
    fetchdeudaGlobal();
  }, []); // Agregar id como dependencia para que se vuelva a ejecutar cuando cambie

  return (
    <DeudaGlobalContext.Provider
      value={{ deudaGlobalContext, setdeudaGlobalContext, loadingdeudaGlobalContext }}
    >
      {loadingdeudaGlobalContext && children}
    </DeudaGlobalContext.Provider>
  );
};

export default DeudaGlobalProvider;