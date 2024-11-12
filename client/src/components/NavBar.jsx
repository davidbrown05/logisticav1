import React from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  RiHome8Fill,
  RiContactsBook2Fill,
  RiLoginBoxLine,
} from "react-icons/ri";
import { SlNotebook } from "react-icons/sl";

import { FaHome, FaChartLine,FaUsers  } from "react-icons/fa";
import { FaUsersBetweenLines, FaUsersGear } from "react-icons/fa6";
import { BiSolidReport } from "react-icons/bi";
import { MdOutlineMenuBook, MdAddHome } from "react-icons/md";
import { NavLink, useLocation } from "react-router-dom";
import {
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
} from "../redux/user/userSlice";

export const NavBar = ({ openSideMenu, setOpenSideMenu }) => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();

    // Verificar si el currentUser tiene el correo sergio@gmail.com
    const isSergio = currentUser === "sergio@gmail.com";
  const sidebarOptions = [
    {
      icon: <FaHome className="text-2xl" />,
      label: "INVENTARIO",
      to: "/inventario",
    },
    {
      icon: <MdAddHome className="text-2xl" />,
      label: "CREAR PROPIEDAD",
      to: "/crear",
    },
    {
      icon: <FaUsersBetweenLines className="text-2xl" />,
      label: "COMPRADORES",
      to: "/compradores",
    },
    {
      icon: <BiSolidReport className="text-2xl" />,
      label: "REPORTES",
      to: "/reportes",
    },
    {
      icon: <FaUsersGear className="text-2xl" />,
      label: "USUARIOS",
      to: "/usuarios",
    },
    {
      icon: <FaChartLine className="text-2xl" />,
      label: "DEUDA GLOBAL",
      to: "/deuda",
    },
    {
      icon: <FaUsers  className="text-2xl" />,
      label: "PARTNERS",
      to: "/partners",
    },
    {
      icon: <SlNotebook className="text-2xl" />,
      label: "RECORDATORIOS",
      to: "/recordatorios",
    },
    {
      icon: <RiLoginBoxLine className="text-2xl" />,
      label: `Cerrar Sesion`,
      onClick: () => handleSignOut(),
    },
  ];

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const response = await axios.post(
        "http://localhost:3000/api/auth/signout"
      );

      const data = await response.data;

      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  return (
    <div>
      <div
        className={`fixed bg-black  top-0 w-80 h-full flex flex-col justify-between py-6 z-50 transition-all ${
          openSideMenu ? "left-0" : "-left-full"
        } overflow-y-auto`}
      >
        <div className="overflow-y-auto">
          <ul className="pl-4">
            <li>
              <h1 className="text-md text-gray-300 uppercase font-bold text-center my-5">
                LOGISTICA INMOBILIARIA
              </h1>
            </li>
            {sidebarOptions.map((option, index) => (
              <li
                onClick={() => {
                  // Ejecuta la función onClick si está definida
                  if (option.onClick) {
                    option.onClick();
                  }
                  setOpenSideMenu(!openSideMenu);
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
      {openSideMenu ? (
        <div
          onClick={() => setOpenSideMenu(!openSideMenu)}
          className="bg-black/80 fixed w-full h-screen z-30 top-0 left-0 "
        ></div>
      ) : (
        ""
      )}
    </div>
  );
};
