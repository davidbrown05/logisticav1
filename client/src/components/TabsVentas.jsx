import React, { useRef, useState, useContext } from "react";
import { VentasContext } from "../context/VentasContext";
import { DatosVentas } from "./ventasComponents/DatosVentas";
import { DocumentasVentas } from "./ventasComponents/DocumentasVentas";

export const TabsVentas = ({ id }) => {
  const { isLoadingVentas } = useContext(VentasContext);
  console.log("isLoadingVentas", isLoadingVentas);
  const [selectedTab, setSelectedTab] = useState(0);
  const firstBtnRef = useRef();

  const data = [
    {
      label: "DATOS GENERALES",
      value: "DATOS GENERALES",
    },
    {
      label: "DOCUMENTACION",
      value: "DOCUMENTACION",
    },
  ];

  const handleTabClick = (index) => {
    setSelectedTab(index);
  };

  // Función para renderizar el contenido de acuerdo al paso actual
  const renderStepContent = () => {
    switch (selectedTab) {
      case 0:
        return <DatosVentas id={id} />;
      case 1:
        return <DocumentasVentas id={id} /> ;
      case 2:
        return <div>SEGUIMIENTO PROCESAL</div>;

      default:
        return null;
    }
  };

  return (
    <>
      {/* EMPIEZA EL CODIGO DE DISEÑO PARA TABS */}
      <div className="flex p-3 justify-between items-center gap-x-2 bg-gray-200 overflow-x-auto ">
        {data.map((item, index) => (
          <button
            ref={index === selectedTab ? firstBtnRef : null}
            key={index}
            onClick={() => handleTabClick(index)}
            className={`outline-none w-full p-2 hover:bg-gray-300 hover:text-black rounded-xl text-center  ${
              selectedTab === index ? "  bg-black text-white" : ""
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      {/* TERMINA DISEÑO DE TABS */}
      {/* EMPIEZA DISEÑO DE STEPPER */}
      <div className="flex flex-col items-center gap-10  mt-1">
        {/* Mostrar contenido dinámico según el paso actual */}
        <div className="step-content  p-4 mt-1">{renderStepContent()}</div>
      </div>
    </>
  );
};
