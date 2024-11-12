import React, { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";
import { LoaderContext } from "./LoaderContext";
import { LoaderModal } from "../components/LoaderModal";

export const JuridicoContext = createContext();

const JuridicoProvider = ({ children, id }) => {
  const { setloaderContext } = useContext(LoaderContext);
  const [juridico, setJuridico] = useState([]);
  const [loadingJuridco, setLoadingJuridico] = useState(false);

  const fetchJuridico = async () => {
    setloaderContext(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/juridicoData/${id}`
      );
      console.log("juridicoDataContext", response.data[0]);
      setJuridico(response.data[0]);
      setLoadingJuridico(true);
      setloaderContext(false);
    } catch (error) {
      console.log(error);
      setLoadingJuridico(false);
      setloaderContext(false);
    }
  };

  useEffect(() => {
    // Limpiar el estado de juridico al desmontar o cuando cambia el id
    return () => {
      setJuridico([]);
    };
  }, [id]); // Agregar id como dependencia para que se vuelva a ejecutar cuando cambie

  useEffect(() => {
    fetchJuridico();
  }, [id]); // Agregar id como dependencia para que se vuelva a ejecutar cuando cambie

  return (
    <>
      <JuridicoContext.Provider
        value={{ juridico, setJuridico, loadingJuridco }}
      >
        {loadingJuridco && children}
      </JuridicoContext.Provider>
      <LoaderModal />
    </>
  );
};

export default JuridicoProvider;
