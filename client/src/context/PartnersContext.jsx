import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const PartnersContext = createContext();

const PartnersProvider = ({ children, id }) => {
  const [partners, setPartners] = useState([]);
  const [loadingPartners, setLoadingPartners] = useState(false);

  const fetchPartners = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/partners`);
      console.log("partnersDataContext", response.data);
      setPartners(response.data);
      setLoadingPartners(true);
    } catch (error) {
      console.log(error);
      setLoadingPartners(false);
    }
  };

  useEffect(() => {
    // Limpiar el estado de juridico al desmontar o cuando cambia el id
    return () => {
      setPartners([]);
    };
  }, [id]); // Agregar id como dependencia para que se vuelva a ejecutar cuando cambie

  useEffect(() => {
    fetchPartners();
  }, []); // Agregar id como dependencia para que se vuelva a ejecutar cuando cambie

  return (
    <PartnersContext.Provider
      value={{ partners, setPartners, loadingPartners }}
    >
      {loadingPartners && children}
    </PartnersContext.Provider>
  );
};

export default PartnersProvider;
