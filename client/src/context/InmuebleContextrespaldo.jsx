import React, { createContext, useEffect, useState } from "react";
import axios from 'axios'

export const InmuebleContext = createContext()

const InmuebleProvider = ({ children }) => {
    const [inmuebles, setInmuebles] = useState([]);
    const [loadingInmuebles, setLoadingInmuebles] = useState(false); // Nuevo estado para el estado de carga
  
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/products");
        console.log("responseData", response.data)
        setInmuebles(response.data)
        setLoadingInmuebles(true);
      } catch (error) {
        console.log(error);
        setLoadingInmuebles(false);
      }
    };

    const searchInmuebles = async (searchTerm) => {
      setLoadingInmuebles(false);
      try {
       // const response = await axios.get(`http://localhost:3000/api/products?direccion=${searchTerm}`);
        const response = await axios.get(`http://localhost:3000/api/products?searchTerm=${encodeURIComponent(searchTerm)}`);
        console.log("responseDataFilter", response.data)
        setInmuebles(response.data);
        setLoadingInmuebles(true);
      } catch (error) {
        console.log(error);
        setLoadingInmuebles(false);
      }
    };
  
    //fetch menu
    useEffect(() => {
      fetchProducts();
    }, []);
  
    return <InmuebleContext.Provider value={{inmuebles,loadingInmuebles,setInmuebles,searchInmuebles }}>
        {loadingInmuebles && children}
    </InmuebleContext.Provider>
  };
  
  
  export default InmuebleProvider