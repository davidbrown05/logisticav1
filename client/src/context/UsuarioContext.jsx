import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UsuarioContext = createContext();

const UsuarioProvider = ({ children, id }) => {
  const [userCOntext, setUserCOntext] = useState([]);
  const [loadingUserCOntext, setLoadingUserCOntext] = useState(false); 

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/usersData/${id}`
      );
      console.log("UserDataContext", response.data);
      setUserCOntext(response.data);
      setLoadingUserCOntext(true)
    } catch (error) {
      console.log(error);
      setLoadingUserCOntext(false)
    }
  };

  useEffect(() => {
    // Limpiar el estado de juridico al desmontar o cuando cambia el id
    return () => {
        setUserCOntext([]);
    };
  }, [id]);  // Agregar id como dependencia para que se vuelva a ejecutar cuando cambie

  useEffect(() => {
    fetchUsers();
  }, [id]);  // Agregar id como dependencia para que se vuelva a ejecutar cuando cambie

  return (
    <UsuarioContext.Provider value={{ userCOntext,setLoadingUserCOntext,loadingUserCOntext }}>
      {loadingUserCOntext && children}
    </UsuarioContext.Provider>
  );
};

export default UsuarioProvider;