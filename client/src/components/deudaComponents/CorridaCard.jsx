import React from "react";
import moment from "moment";
import { FaCommentAlt } from "react-icons/fa";
import { MdEventRepeat } from "react-icons/md";
import { FcDocument } from "react-icons/fc";

//CORRIDAS SE PASA A ESTE COMPONENTE PARA VERIFICAR SI LA CORRIDA SELECCIONADA ES LA ULTIMA DEL ARRAY Y HABILITAR O DESHABILITAR EL BOTON DE NUEVA CORRIDA

export const CorridaCard = ({
  corrida,
  setopenModal,
  setcorridaIndex,
  index,
  handleRondas,
  corridaIndex,
  corridas,
  estado,
}) => {
  console.log("indexCorridaCard", corridaIndex);
  console.log("corridasCard", corridas);
  console.log("corridaCard", corrida);

  const timepoTranscurrido = (fecha) => {
    const fechaInicioInversion = moment(fecha);
    const fechaActual = moment();
    const tiempoTranscurrido = fechaActual.diff(fechaInicioInversion, "days");
    return `${tiempoTranscurrido} días`;
    // settimepoTrans(tiempoTranscurrido);
  };

  // Obtener el valor de la ronda del último elemento del array
  const ultimaRonda = corridas[corridas.length - 1]?.ronda;

  // Verificar si la ronda de la corrida actual coincide con la última ronda
  const esUltimaRonda = corrida.ronda === ultimaRonda && estado === "activo";

  return (
    <>
      <div className=" flex flex-col items-start">
        <div className=" bg-white m-5 p-5 rounded-lg shadow-lg flex flex-col gap-3">
          <div>
            <p className=" font-semibold underline">CONTRATO DE INVERSION</p>
            <a
              className=" text-[25px] rounded shadow-lg"
              href={corrida.documento}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button>
                <FcDocument />
              </button>
            </a>
          </div>
          <div>
            <p className=" font-semibold underline">
              FECHA DE CONTRATO VIGENTE
            </p>
            <p>{moment(corrida.fechaContratoVigente).format("DD-MMM-YYYY")}</p>
          </div>
          <div>
            <p className=" font-semibold underline">FECHA DE FINALIZACION</p>
            <p>{moment(corrida.fechaFinalizacion).format("DD-MMM-YYYY")}</p>
          </div>
          <div>
            <p className=" font-semibold underline">
              TIEMPO TRASNCIRRIDO DE CONTRATO A LA FECHA
            </p>
            <p>
              {esUltimaRonda
                ? timepoTranscurrido(corrida.fechaContratoVigente)
                : "RONDA FINALIZADA"}
            </p>
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
            <p className=" font-semibold underline">UTILIDAD A GENERAR</p>
            <p>${corrida.utilidad.toLocaleString("es-MX")}</p>
          </div>
          <div>
            <p className=" font-semibold underline">TOTAL REEMBOLSO</p>
            <p>${corrida.reembolzo.toLocaleString("es-MX")}</p>
          </div>
          <div className=" flex gap-5 text-[25px] mt-9 ">
            <FaCommentAlt
              onClick={() => {
                setcorridaIndex(index);
                setopenModal(true);
              }}
              className="cursor-pointer"
            />
            {esUltimaRonda && (
              <MdEventRepeat
                onClick={handleRondas}
                className="cursor-pointer"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
