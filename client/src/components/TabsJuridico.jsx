import React, { useRef, useState } from "react";
import { GastosJudiciales } from "./juridicoComponents/GastosJudiciales";
import { DocumentosJuridicos } from "./juridicoComponents/DocumentosJuridicos";
import { DatosGenerales } from "./juridicoComponents/DatosGenerales";
import { ObservacionesForm } from "./juridicoComponents/ObservacionesForm";
import { PermisosComponent } from "./juridicoComponents/PermisosComponent";
import { Seguimiento } from "./juridicoComponents/Seguimiento";
import { SeguimientoTabs } from "./juridicoComponents/SeguimientoTabs";
import { useDispatch, useSelector } from "react-redux";
import { selectAllPosts } from "../redux/juridico/postSlice";
import { IoNotifications } from "react-icons/io5";
import { Badge } from "@mui/material";

export const TabsJuridico = ({ id }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const firstBtnRef = useRef();
  const posts = useSelector(selectAllPosts);

  // Función para filtrar tareas pasadas usando flatMap
  const filterPastDueTasks = (data) => {
    const now = new Date();
    return data.flatMap((item) =>
      item.tareasLista.filter((task) => new Date(task.fechaLimite) < now)
    );
  };

  // Obtener el item jurídico basado en el id
  const juridicoItem = posts.find((item) => item.propertyId === id);

  console.log("juridicoItem", juridicoItem);

  // Verificar que juridicoItem y juridicoItem.tareasLista estén definidos antes de filtrar
  const pastDueTasks = juridicoItem?.tareasLista
    ? filterPastDueTasks([juridicoItem])
    : [];
  console.log("Tareas pasadas de fecha:", pastDueTasks);

  const data = [
    {
      label: "DATOS GENERALES",
      value: "arepas",
      desc: `It really matters and then like it really doesn't matter.
                    What matters is the people who are sparked by it. And the people 
                    who are like offended by it, it doesn't matter.`,
      menuItems: [],
    },
    {
      label: "SEGUIMIENTO PROCESAL",
      value: "entradas",
      desc: `Because it's about motivating the doers. Because I'm here
                    to follow my dreams and inspire other people to follow their dreams, too.`,
      menuItems: [],
    },
    {
      label: "GASTOS JUDICIALES",
      value: "desayunos",
      desc: `We're not always in the position that we want to be at.
                    We're constantly growing. We're constantly making mistakes. We're
                    constantly trying to express ourselves and actualize our dreams.`,
      menuItems: [],
    },
    {
      label: "OBSERVACIONES",
      value: "chachapas",
      desc: `Because it's about motivating the doers. Because I'm here
                    to follow my dreams and inspire other people to follow their dreams, too.`,
      menuItems: [],
    },
    {
      label: "DOCUMENTOS",
      value: "patacon",
      desc: `We're not always in the position that we want to be at.
                    We're constantly growing. We're constantly making mistakes. We're
                    constantly trying to express ourselves and actualize our dreams.`,
      menuItems: [],
    },
    {
      label: "PERMISOS",
      value: "empanadas",
      desc: `We're not always in the position that we want to be at.
                      We're constantly growing. We're constantly making mistakes. We're
                      constantly trying to express ourselves and actualize our dreams.`,
      menuItems: [],
    },
  ];

  const handleTabClick = (index) => {
    setSelectedTab(index);
  };

  // Función para renderizar el contenido de acuerdo al paso actual
  const renderStepContent = () => {
    switch (selectedTab) {
      case 0:
        return <DatosGenerales id={id} />;
      case 1:
        return <SeguimientoTabs id={id} />;
      case 2:
        return <GastosJudiciales id={id}/>;
      case 3:
        return <ObservacionesForm id={id} />;
      case 4:
        return <DocumentosJuridicos id={id} />;
      case 5:
        return <PermisosComponent id={id} />;

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
            className={` text-[10px] lg:text-[15px] flex justify-center outline-none w-full p-2 hover:bg-gray-300 hover:text-black rounded-xl text-center  ${
              selectedTab === index ? "  bg-black text-white" : ""
            }`}
          >
            {item.label}
            {item.label === "SEGUIMIENTO PROCESAL" &&
              pastDueTasks.length > 0 && (
                
                <Badge color="string"  badgeContent={pastDueTasks.length}>
                <IoNotifications className="inline ml-2 text-red-600 xl:text-[20px]" />
                </Badge>
                
              )}
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
