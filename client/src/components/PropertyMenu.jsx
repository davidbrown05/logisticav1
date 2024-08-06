import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Swal from "sweetalert2";
import { BsBank2 } from "react-icons/bs";

import {
  RiHome8Fill,
  RiContactsBook2Fill,
  RiLoginBoxLine,
} from "react-icons/ri";
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
import { VerPropiedadModal } from "./VerPropiedadModal";

export const PropertyMenu = ({
  propertyMenu,
  setPropertyMenu,
  item,
  getPropiedades,
  openModal,
  setopenModal
}) => {


  const verPropiedad = () =>{
    setopenModal(!openModal)
  }
  
  const deleteProperty = async () => {
    const result = await Swal.fire({
      title: `Eliminar ${item.direccion}`,
      text: "No podras recuperar esta propiedad y su información",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const responseJuridico = await axios.get(
          `http://localhost:3000/api/juridicoData/${item._id}`
        );
        const responseVentas = await axios.get(
          `http://localhost:3000/api/ventasData/${item._id}`
        );
        const responseAdeudos = await axios.get(
          `http://localhost:3000/api/adeudosData/${item._id}`
        );
        const responsePagos = await axios.get(
          `http://localhost:3000/api/pagosData/${item._id}`
        );
        const responseComisiones = await axios.get(
          `http://localhost:3000/api/comisionesData/${item._id}`
        );
        const responseDeuda = await axios.get(
          `http://localhost:3000/api/propertyDeudaData/${item._id}`
        );

        const juridicoId = responseJuridico.data[0]._id;
        const ventasId = responseVentas.data[0]._id;
        const adeudosId = responseAdeudos.data[0]._id;
        const pagosId = responsePagos.data[0]._id;
        const comisionesId = responseComisiones.data[0]._id;
        const deudaId = responseDeuda.data[0]._id;
        console.log("juridcoId", juridicoId);
        console.log("ventasId", ventasId);
        console.log("adeudosId", adeudosId);
        console.log("pagosId", pagosId);
        console.log("pagcomisionesIdosId", comisionesId);
        console.log("deudaId", deudaId);

        const responseDeleteJuridico = await axios.delete(
          `http://localhost:3000/api/juridicoData/${juridicoId}`
        );
        const responseDeleteVentas = await axios.delete(
          `http://localhost:3000/api/ventasData/${ventasId}`
        );
        const responseDeleteAdeudos = await axios.delete(
          `http://localhost:3000/api/adeudosData/${adeudosId}`
        );
        const responseDeletePagos = await axios.delete(
           `http://localhost:3000/api/pagosData/${pagosId}`
        );
        const responseDeleteComisiones = await axios.delete(
          `http://localhost:3000/api/comisionesData/${comisionesId}`
        );
        const responseDeleteDeuda = await axios.delete(
          `http://localhost:3000/api/propertyDeudaData/${deudaId}`
        );

        const responseDeleteProperty = await axios.delete(
          `http://localhost:3000/api/products/${item._id}`
        );

        toast.success("PROPIEDAD ELIMINADA");
        getPropiedades();
      } catch (error) {
        toast.error(error);
      }
    }
  };

  const sidebarOptionsFull = [
    {
      icon: <FaHome className="text-2xl" />,
      label: "INFORMACION",
      onClick: () => verPropiedad(),
    },
    {
      icon: <FaEdit className="text-2xl" />,
      label: "EDITAR",
      to: `/editar/${item._id}`,
    },
    {
      icon: <FaBook className="text-2xl" />,
      label: "JURIDICO",
      to: `/juridico/${item._id}`,
    },
    {
      icon: <BsBank2 className="text-2xl" />,
      label: "ADEUDOS",
      to: `/adeudos/${item._id}`,
    },
    {
      icon: <FaCreditCard className="text-2xl" />,
      label: "VENTAS",
      to: `/ventas/${item._id}`,
    },

    {
      icon: <BsCalendar2DateFill className="text-2xl" />,
      label: "PAGOS",
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
      to: `/propertydeuda/${item._id}`,
    },
    {
      icon: <FaTrashAlt className="text-2xl" />,
      label: "ELIMINAR PROPIEDAD",
      onClick: () => deleteProperty(),
    },
  ];
  const sidebarOptionsMid = [
    {
      icon: <FaEdit className="text-2xl" />,
      label: "EDITAR",
      to: `/editar/${item._id}`,
    },
    {
      icon: <FaBook className="text-2xl" />,
      label: "JURIDICO",
      to: `/juridico/${item._id}`,
    },
    {
      icon: <BsBank2 className="text-2xl" />,
      label: "ADEUDOS",
      to: `/adeudos/${item._id}`,
    },

    {
      icon: <FaTrashAlt className="text-2xl" />,
      label: "ELIMINAR PROPIEDAD",
      onClick: () => deleteProperty(),
    },
  ];

  // Determinar qué array usar para el mapeo basado en las condiciones de juridico
  const optionsToMap =
    item.juridicoDir && item.juridicoadmin && item.juridicoJur
      ? sidebarOptionsFull
      : sidebarOptionsMid;

  const location = useLocation();

  useEffect(() => {
    if (propertyMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [propertyMenu]);

  return (
    <>
    <VerPropiedadModal openModal={openModal} setopenModal={setopenModal} setPropertyMenu={setPropertyMenu} propertyMenu={propertyMenu} item={item}/>
    <div>
      <div
        className={`fixed bg-black px-3 top-0 w-80 lg:w-[400px] h-full flex flex-col justify-between py-6 z-50 transition-all ${
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
    </>
  );
  
};
