import React, { useRef, useState } from "react";

import { AdeudosLista } from "./AdeudosLista";

export const TabsAdeudos = ({ id }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const firstBtnRef = useRef();

  

  const data = [
    {
      label: "ADEUDOS",
      value: "ADEUDOS",
    },
  ];

  const handleTabClick = (index) => {
    setSelectedTab(index);
  };

  // Función para renderizar el contenido de acuerdo al paso actual
  const renderStepContent = () => {
    switch (selectedTab) {
      case 0:
        return <AdeudosLista id={id} />;

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
