import React from "react";
import moment from "moment";
import { FaCommentAlt } from "react-icons/fa";
import { MdEventRepeat } from "react-icons/md";

export const CorridaCard = ({ corrida,setopenModal,setcorridaIndex, index }) => {
  console.log("index", index)
  return (
    <>
      <div className=" flex flex-col items-start">
        <div className=" bg-white m-5 p-5 rounded-lg shadow-lg flex flex-col gap-3">
          <div>
            <p className=" font-semibold underline">
              FECHA DE CONTRATO VIGENTE
            </p>
            <p>{moment(corrida.fechaContratoVigente).format("DD-MMM-YYYY")}</p>
          </div>
          <div>
            <p className=" font-semibold underline">PLAZO</p>
            <p>{corrida.plazo}</p>
          </div>
          <div>
            <p className=" font-semibold underline">SUERTE PRINCIPAL</p>
            <p>${corrida.suertePrincipal.toLocaleString("es-MX")}</p>
          </div>
          <div>
            <p className=" font-semibold underline">PORCENTAJE UTILIDAD</p>
            <p>%{corrida.porcentajeUtilidad}</p>
          </div>
          <div>
            <p className=" font-semibold underline">UTILIDAD</p>
            <p>${corrida.utilidad.toLocaleString("es-MX")}</p>
          </div>
          <div>
            <p className=" font-semibold underline">TOTAL REEMBOLSO</p>
            <p>${corrida.reembolzo.toLocaleString("es-MX")}</p>
          </div>
          <div className=" flex gap-5 text-[25px] mt-9 ">
            <FaCommentAlt onClick={()=>{
              setcorridaIndex(index)
              setopenModal(true)
            }} className="cursor-pointer" />
            <MdEventRepeat className="cursor-pointer" />
          </div>
        </div>
      </div>
    </>
  );
};
