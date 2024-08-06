import React, { useState, useEffect, useContext } from "react";
import { FaPlus } from "react-icons/fa6";

import { useForm } from "react-hook-form";
import { Rings } from "react-loader-spinner";
import { UsuarioContext } from "../../context/UsuarioContext";
import moment from "moment";
import { FaTrashAlt } from "react-icons/fa";
import { FiExternalLink  } from "react-icons/fi";
import { Switch } from "@nextui-org/react";
import Swal from "sweetalert2";
import axios from "axios";
import { toast } from "react-toastify";
import { FcDocument } from "react-icons/fc";
import { ComisionesContext } from "../../context/ComisionesContext";

export const ListaGastosEmpresa = ({
  comisiones,
  setComisiones,
  comisionesData,
  setcomisionesData,
}) => {
  const [gastos, setGastos] = useState(0);

  const calcularGastosAdicionales = (data) => {
    // Calcula la suma de precios en gastosLista con status igual a true
    const sumaPrecios = data.empresaLista.reduce(
      (total, gasto) => total + gasto.cantidad,
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

  const canDeletePagos = true;

  return (
    <>
      <div className="form-container mt-10 flex flex-col items-center w-screen  lg:w-[1000px] max-w-[1500px] bg-[#f3f4f6]">
      <div className="form-header bg-black text-white w-full h-10 p-2 rounded-tl-md rounded-tr-md flex justify-between">
          <p> LISTA DE GASTOS EMPRESA</p>
          <p className=" text-white">TOTAL ${gastos.toLocaleString("es-MX")}</p>
        </div>

        <div className="w-full overflow-x-auto p-5">
          {comisionesData.empresaLista &&
          comisionesData.empresaLista.length > 0 ? (
            <table className="w-full mt-4 bg-white rounded-md shadow-md mb-4 overflow-x-auto">
              <thead>
                <tr>
                  <th className="border p-2">USUARIO</th>
                  <th className="border p-2">FECHA</th>

                  <th className="border p-2">CANTIDAD</th>
                  <th className="border p-2">OBSERVACION</th>

                  <th className="border p-2">RECIBO</th>
                 
                </tr>
              </thead>
              <tbody className="">
                {comisionesData.empresaLista.map((document, index) => (
                  <tr key={index} className="mt-2 ">
                    <td className="border p-3  max-w-[200px]">
                      {document.usuario}
                    </td>
                    <td className="border p-3 text-center">
                      {" "}
                      {moment(document.fecha).format("YYYY-MMM-DD ")}
                    </td>

                    <td className="border p-3 text-center">
                      ${document.cantidad.toLocaleString("es-MX")}
                    </td>
                    <td className="border p-3 text-center">
                      {document.observacionPago}
                    </td>

                    <td className="border p-3 text-center">
                        {document.documento ? (
                          <a
                            className=" text-[25px] rounded shadow-lg"
                            href={document.documento}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <button>
                              <FcDocument />
                            </button>
                          </a>
                        ) : (
                          <span>N/A</span> // Puedes cambiar esto por cualquier otro contenido que desees mostrar cuando no haya documento
                        )}
                      </td>
                   
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="font-bold text-xl mb-10">
              Aún no hay gastos de empresa.
            </p>
          )}
        </div>
      </div>
    </>
  );
};
