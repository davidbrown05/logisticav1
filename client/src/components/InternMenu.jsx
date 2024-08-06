import React, { useContext, useEffect, useState } from "react";
import {
    FaHome,
    FaBook,
    FaCreditCard,
    FaPercentage,
    FaChartArea,
    FaTrashAlt,
    FaEdit,
  } from "react-icons/fa";
  import { BsCalendar2DateFill } from "react-icons/bs";
  
  import { NavLink, useLocation } from "react-router-dom";

export const InternMenu = () => {
    const sidebarOptionsFull = [
        { icon: <FaEdit className="text-2xl" />, label: "EDITAR", to: "/" },
        {
          icon: <FaBook className="text-2xl" />,
          label: "JURIDICO",
          to: `/juridico/${item._id}`,
        },
        {
          icon: <FaCreditCard className="text-2xl" />,
          label: "VENTAS",
          to: `/ventas/${item._id}`,
        },
        {
          icon: <BsCalendar2DateFill className="text-2xl" />,
          label: "PAGOS Y ADEUDOS",
          to: `/pagosadeudos/${item._id}`,
        },
        {
          icon: <FaPercentage className="text-2xl" />,
          label: "COMISIONES",
          to: `/comisiones/${item._id}`,
        },
        {
          icon: <FaChartArea className="text-2xl" />,
          label: "DEUDA",
          to: `/deudas/${item._id}`,
        },
        {
          icon: <FaTrashAlt className="text-2xl" />,
          label: "ELIMINAR PROPIEDAD",
          onClick: () => deleteProperty(),
        },
      ];
      const sidebarOptionsMid = [
        { icon: <FaEdit className="text-2xl" />, label: "EDITAR", to: "/" },
        {
          icon: <FaBook className="text-2xl" />,
          label: "JURIDICO",
          to: `/juridico/${item._id}`,
        },
    
        {
          icon: <FaTrashAlt className="text-2xl" />,
          label: "ELIMINAR PROPIEDAD",
          onClick: () => deleteProperty(),
        },
      ];
    
      // Determinar qué array usar para el mapeo basado en las condiciones de juridico
    const optionsToMap = item.juridicoDir && item.juridicoadmin && item.juridicoJur
    ? sidebarOptionsFull
    : sidebarOptionsMid;
    
      
      const location = useLocation();
      return (
        <div>
          <div
            className={`fixed bg-black px-3 top-0 w-80 h-full flex flex-col justify-between py-6 z-50 transition-all ${
              propertyMenu ? "right-0" : "-right-full"
            } overflow-y-auto`}
          >
            <div className="overflow-y-auto">
              <div className="flex flex-col items-center">
                <img src={item.foto} className=" h-[100px] w-[100px] rounded-lg" />
                <h1 className="text-md text-gray-300 uppercase font-bold text-center my-5">
                  {item.direccion}
                </h1>
              </div>
              <ul className="pl-4">
                {optionsToMap.map((option, index) => (
                  <li
                    onClick={() => {
                      // Ejecuta la función onClick si está definida
                      if (option.onClick) {
                        option.onClick();
                      }
                      setPropertyMenu(!propertyMenu);
                    }}
                    key={index}
                    className="hover:bg-[#262837] p-4 rounded-tl-xl rounded-bl-xl group transition-colors"
                  >
                    <NavLink
                      to={option.to}
                      // isActive={() => {
                      //     // Comprueba si la ubicación actual coincide con la ruta del NavLink
                      //     return location.pathname === option.to;
                      //   }}
                      className={`${
                        location.pathname === option.to ? "bg-[#e43434]" : ""
                      } group-hover:bg-[#e43434] p-2 flex gap-4 items-center rounded-xl text-white group-hover:text-white transition-colors`}
                    >
                      {option.icon}
                      {option.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* overlay */}
          {propertyMenu ? (
            <div
              onClick={() => setPropertyMenu(!propertyMenu)}
              className="bg-black/80 fixed w-full h-screen z-30 top-0 left-0 "
            ></div>
          ) : (
            ""
          )}
        </div>
      );
}
