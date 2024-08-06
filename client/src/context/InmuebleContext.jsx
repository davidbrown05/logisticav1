import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const InmuebleContext = createContext();

const InmuebleProvider = ({ children }) => {
  const [inmuebles, setInmuebles] = useState([]);
  const [loadingInmuebles, setLoadingInmuebles] = useState(false); // Nuevo estado para el estado de carga
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  const fetchProducts = async (page = 1) => {
    try {
      // const response = await axios.get("http://localhost:3000/api/products");
      const response = await axios.get(
        `http://localhost:3000/api/products?page=${page}&limit=${limit}`
      );
      console.log("responseData", response.data);
      setInmuebles(response.data.products);
      setPage(response.data.page);
      setTotalPages(response.data.totalPages);
      setLoadingInmuebles(true);
    } catch (error) {
      console.log(error);
      setLoadingInmuebles(false);
    }
  };

  const searchInmuebles = async (searchTerm, page = 1) => {
    setLoadingInmuebles(false);
    try {
      // const response = await axios.get(`http://localhost:3000/api/products?direccion=${searchTerm}`);
      //  const response = await axios.get(`http://localhost:3000/api/products?searchTerm=${encodeURIComponent(searchTerm)}`);
      const response = await axios.get(
        `http://localhost:3000/api/products?searchTerm=${encodeURIComponent(
          searchTerm
        )}&page=${page}&limit=${limit}`
      );
      console.log("responseDataFilter", response.data);
      setInmuebles(response.data.products);
      setPage(response.data.page);
      setTotalPages(response.data.totalPages);
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

  return (
    <InmuebleContext.Provider
      value={{
        inmuebles,
        loadingInmuebles,
        setInmuebles,
        searchInmuebles,
        page,
        setPage,
        totalPages,
        fetchProducts
      }}
    >
      {loadingInmuebles && children}
    </InmuebleContext.Provider>
  );
};

export default InmuebleProvider;
