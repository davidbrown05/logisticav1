import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import {
    fetchData,
  selectAllJuridico,
  getJuridicoErrors,
  getJuridicoStatus,
} from "../redux/juridico/juridicoSlice";

export const JuridicoThunk = () => {
  const dispatch = useDispatch();
  const juridico = useSelector(selectAllJuridico);
  const juridicoStatus = useSelector(getJuridicoStatus);
  const juridicoError = useSelector(getJuridicoErrors);

  const [juridicoData, setjuridicoData] = useState([]);

  useEffect(() => {
    if (juridicoStatus === "idle") {
      dispatch(fetchData());
    }
  }, [juridicoStatus, dispatch]);

  const getJuridicoData = async () => {
    try {
     
      const response = await axios.get(
        "http://localhost:3000/api/juridicoData"
      );
      console.log("responseData", response.data);
      setjuridicoData(response.data);
    
    } catch (error) {
      console.log(error);
     
    }
  };

  useEffect(() => {
    getJuridicoData();
  }, []);

  return (
    <>
      {juridicoStatus === "loading" ? (
        <p>Loading...</p>
      ) : juridicoStatus === "succeeded" ? (
        <div>
          <p>Datos exitosos</p>
          {/* Mostrar los datos obtenidos */}
          <pre>{JSON.stringify(juridico, null, 2)}</pre>
        </div>
      ) : juridicoStatus === "failed" ? (
        <div>
          <p>Error al cargar los datos</p>
          {/* Mostrar el mensaje de error */}
          <pre>{juridicoError}</pre>
        </div>
      ) : null}
    </>
  );
};
