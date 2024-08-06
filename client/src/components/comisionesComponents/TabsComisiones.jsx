import React, {useContext, useState} from "react";
import { GeneralComisionesData } from "./GeneralComisionesData";
import { ListaGastosJuridicos } from "./ListaGastosJuridicos";
import { ListaGastosEmpresa } from "./ListaGastosEmpresa";
import { ListaOtros } from "./ListaOtros";
import { ComisionesContext } from "../../context/ComisionesContext";

export const TabsComisiones = () => {
  const { comisiones, setComisiones, loadingComisiones } =
    useContext(ComisionesContext);

  const [comisionesData, setcomisionesData] = useState(comisiones);
  return (
    <>

    <div className=" flex flex-col items-center ">
      <GeneralComisionesData comisiones={comisiones} setComisiones={setComisiones} comisionesData={comisionesData} setcomisionesData={setcomisionesData} />
      <ListaGastosJuridicos comisiones={comisiones} setComisiones={setComisiones} comisionesData={comisionesData} setcomisionesData={setcomisionesData} />
      <ListaGastosEmpresa comisiones={comisiones} setComisiones={setComisiones} comisionesData={comisionesData} setcomisionesData={setcomisionesData} />
      <ListaOtros comisiones={comisiones} setComisiones={setComisiones} comisionesData={comisionesData} setcomisionesData={setcomisionesData} />
      </div>
    </>
  );
};
