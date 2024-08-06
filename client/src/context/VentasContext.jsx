import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const VentasContext = createContext();

const VentasProvider = ({ children, id }) => {
  const [ventas, setVentas] = useState({});
  const [isLoadingVentas, setisLoadingVentas] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true)

  const fetchVentas = async () => {
    setisLoadingVentas(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/ventasData/${id}`
      );
      console.log("ventasDataContext", response.data[0]);
      setVentas(response.data[0]);
      console.log("ventasDataContext", ventas);
      setisLoadingVentas(false);
    } catch (error) {
      console.log(error);
      setisLoadingVentas(false);
    }
  };

  

  useEffect(() => {
    if (firstLoad ) { // Realiza la llamada solo si es la primera carga o si hay un nuevo id
      fetchVentas();
      setFirstLoad(false); // Marca que ya se ha realizado la primera carga
    }
  }, [ventas]); // Dependencia id para que se ejecute cuando cambie
  
  useEffect(() => {
    console.log("ventasDataContext", ventas);
  }, [ventas]); // Utiliza ventas como dependencia para asegurarte de que refleje su valor actualizado

  return (
    <VentasContext.Provider value={{ ventas, setVentas,isLoadingVentas }}>
       {!isLoadingVentas && children}
    </VentasContext.Provider>
  );
};

export default VentasProvider;
