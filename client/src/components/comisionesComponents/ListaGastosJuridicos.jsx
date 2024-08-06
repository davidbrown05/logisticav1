import React, { useState, useEffect, useContext } from "react";
import { FaPlus } from "react-icons/fa6";

import { useForm } from "react-hook-form";
import { Rings } from "react-loader-spinner";
import { UsuarioContext } from "../../context/UsuarioContext";
import moment from "moment";
import { FaTrashAlt } from "react-icons/fa";
import { Switch } from "@nextui-org/react";
import Swal from "sweetalert2";
import axios from "axios";
import { toast } from "react-toastify";
import { FcDocument } from "react-icons/fc";
import { ComisionesContext } from "../../context/ComisionesContext";
import { FiExternalLink  } from "react-icons/fi";

export const ListaGastosJuridicos = ({
  comisiones,
  setComisiones,
  comisionesData,
  setcomisionesData,
}) => {
 
  const [gastos, setGastos] = useState(0);

  const calcularGastosAdicionales = (data) => {
    // Calcula la suma de precios en gastosLista con status igual a true
    const sumaPrecios = data.juridicoLista.reduce(
      (total, gasto) => total + gasto.precio,
      0
    );

    console.log("sumaGastos", sumaPrecios);

    setGastos(sumaPrecios);
  };

  // useEffect para actualizar el formulario después de que juridicoData cambie
  useEffect(() => {
    let neData = comisionesData;
    calcularGastosAdicionales(neData);
  }, [comisionesData]);

  return (
    <>
      <div className="form-container mt-10 flex flex-col items-center w-screen  lg:w-[1000px] max-w-[1500px] bg-[#f3f4f6]">
      <div className="form-header bg-black text-white w-full h-10 p-2 rounded-tl-md rounded-tr-md flex justify-between">
          <p> LISTA DE GASTOS JURIDICOS</p>
          <p className=" text-white">TOTAL ${gastos.toLocaleString("es-MX")}</p>
        </div>

        <div className="w-full overflow-x-auto p-5">
          {comisionesData.juridicoLista &&
          comisionesData.juridicoLista.length > 0 ? (
            <table className="w-full mt-4 bg-white rounded-md shadow-md mb-4 overflow-x-auto">
              <thead>
                <tr>
                  <th className="border p-2">USUARIO</th>
                  <th className="border p-2">FECHA</th>
                  <th className="border p-2">CONCEPTO</th>
                  <th className="border p-2">CANTIDAD</th>
                  <th className="border p-2">OBSERVACIÓN</th>
                  <th className="border p-2">ESTADO</th>
                 
                </tr>
              </thead>
              <tbody className="">
                {comisionesData.juridicoLista.map((dato, index) => (
                  <tr key={index} className="mt-2">
                    <td className="border p-3 text-center">{dato.usuario}</td>
                    <td className="border p-3 text-center">
                      {moment(dato.fecha).format("YYYY-MMM-DD")}
                    </td>
                    <td className="border p-3 text-center">{dato.concepto}</td>
                    <td className="border p-3 text-center">
                      ${dato.precio.toLocaleString("es-MX")}
                    </td>
                    <td className="border p-3 max-w-[200px]">
                      {dato.observacion}
                    </td>
                    <td className="border p-3 text-center">
                      {/* <input
                        value={dato.status}
                        type="checkbox"
                        onChange={(e) => {
                          handleOnchangeSwitch(index);
                        }}
                      /> */}
                      <Switch isSelected={dato.status} disabled={true}></Switch>
                    </td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="font-bold text-xl mb-10">
              Aún no hay gastos judiciales.
            </p>
          )}
        </div>
      </div>
    </>
  );
};
