import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const PropertyDeudaContext = createContext();

const PropertyDeudaProvider = ({ children, id }) => {
  const [propertyDeuda, setpropertyDeuda] = useState([]);
  const [loadingPropertyDeuda, setloadingPropertyDeuda] = useState(false);

  const fetchPropertyDeudas = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/propertyDeudaData/${id}`
      );
      console.log("propertyDeudasContext", response.data[0]);
      setpropertyDeuda(response.data[0]);
      setloadingPropertyDeuda(true);
    } catch (error) {
      console.log(error);
      setpropertyDeuda(false);
    }
  };

  useEffect(() => {
    // Limpiar el estado de juridico al desmontar o cuando cambia el id
    return () => {
      setpropertyDeuda([]);
    };
  }, [id]); // Agregar id como dependencia para que se vuelva a ejecutar cuando cambie

  useEffect(() => {
    fetchPropertyDeudas();
  }, [id]); // Agregar id como dependencia para que se vuelva a ejecutar cuando cambie

  return (
    <PropertyDeudaContext.Provider
      value={{ propertyDeuda, setpropertyDeuda, loadingPropertyDeuda }}
    >
      {loadingPropertyDeuda && children}
    </PropertyDeudaContext.Provider>
  );
};

export default PropertyDeudaProvider;
