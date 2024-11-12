import React, { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";
import { LoaderModal } from "../components/LoaderModal";
import { LoaderContext } from "./LoaderContext";

export const PartnersContext = createContext();

const PartnersProvider = ({ children, id }) => {
  const {setloaderContext} = useContext(LoaderContext)
  const [partners, setPartners] = useState([]);
  const [loadingPartners, setLoadingPartners] = useState(false);

  const fetchPartners = async () => {
    try {
      setloaderContext(true)
      const response = await axios.get(`http://localhost:3000/api/partners`);
      console.log("partnersDataContext", response.data);
      setPartners(response.data);
      setLoadingPartners(true);
      setloaderContext(false)
    } catch (error) {
      console.log(error);
      setLoadingPartners(false);
      setloaderContext(false)
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
    <>
    <PartnersContext.Provider
      value={{ partners, setPartners, loadingPartners }}
    >
      {loadingPartners && children}
    </PartnersContext.Provider>
    <LoaderModal/>
    </>
  );
};

export default PartnersProvider;
