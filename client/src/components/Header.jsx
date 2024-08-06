import React from 'react'
import { MdMenu } from "react-icons/md";
import { NavBar } from './NavBar';
import { Link } from 'react-router-dom';
import {  useSelector } from "react-redux";
import { FaUser } from "react-icons/fa";



export const Header = ({openSideMenu, setOpenSideMenu }) => {
  const { currentUser } = useSelector((state) => state.user);
  let user = currentUser ? currentUser.email : ""
  return (
    <>
    <div className=" bg-black text-white flex items-center justify-between p-7 w-full">
        <Link to = {"/inventario"}>LOGISTICA INMOBILIARIA</Link>
        <div className='flex  items-center gap-1'>
        <p className='flex items-center gap-2 text-[15px]'><FaUser/>{user}</p>
        <button
          onClick={() => {
            setOpenSideMenu(!openSideMenu);
          }}
        >
          <MdMenu size={30} />
        </button>
        </div>
      </div>
      <NavBar
      openSideMenu={openSideMenu}
      setOpenSideMenu={setOpenSideMenu}
    ></NavBar>
    </>
    
  )
}
