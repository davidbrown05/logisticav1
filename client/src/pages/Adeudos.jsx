import React, { useState, useContext, useEffect } from "react";
import { AdeudosContext } from "../context/AdeudosContext";
import axios from "axios";
import { Rings } from "react-loader-spinner";
//import useParams
import { Link, useParams } from "react-router-dom";
import UsuarioProvider from "../context/UsuarioContext";
import { PropertyMenu } from "../components/PropertyMenu";
import { InmuebleContext } from "../context/InmuebleContext";
import { TabsAdeudos } from "../components/adeudosComponents/TabsAdeudos";
import AdeudosProvider from "../context/AdeudosContext";
import { useSelector } from "react-redux";
import { IoIosHome } from "react-icons/io";
import { MdMenu } from "react-icons/md";


const Adeudos = () => {
  const { currentUser } = useSelector((state) => state.user);
  //get product id from url
  const { id } = useParams();
  const { inmuebles, loadingInmuebles } = useContext(InmuebleContext);
  console.log(id);
  const [adeudosData, setadeudosData] = useState([]);

  const [isLoadingAdeudos, setisLoadingAdeudos] = useState(true);
  const [pagosObjectString, setPagosObjectString] = useState(null);

  //get the single product based on the id
  const product = inmuebles.find((item) => {
    return item._id === id;
  });

  console.log("productItem", product);

  //destructuring product
  const { _id, direccion, foto } = product;

  const [propertyMenu, setPropertyMenu] = useState(false);
  const handleCellClick = (item) => {
    setPropertyMenu(true);
    // setItem(item);
  };
  return (
    <>
      <div className="bg-gray-200 flex items-center justify-center h-[50px]">
        <button
          className=" bg-black text-white  p-1 rounded-md px-2 flex items-center gap-4 "
          onClick={handleCellClick}
        >
          <MdMenu />
          MENU DE LA PROPIEDAD
        </button>
      </div>
      <div className="flex flex-col items-center m-10">
        <img
          src={foto}
          className="h-[100px] w-[100px] md:w-[150px] md:h-[150px] lg:w-[180px] lg:h-[180px] rounded-lg"
        />
        <div className=" flex flex-col  items-center  justify-between ">
          <h1 className="text-[20px] md:text-[30px] text-center p-8 font-semibold">
            MODULO DE ADEUDOS:
          </h1>

          <p className=" font-semibold text-center text-[15px] md:text-[20px] xl:text-[20px] text-gray-500">
            {direccion}
          </p>
        </div>
      </div>

      {isLoadingAdeudos ? (
        <UsuarioProvider id={currentUser._id}>
          <AdeudosProvider id={id}>
            <TabsAdeudos id={id} />
            <PropertyMenu
              propertyMenu={propertyMenu}
              setPropertyMenu={setPropertyMenu}
              item={product}
            />
          </AdeudosProvider>
        </UsuarioProvider>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <p>Cargando datos de pagos y adeudos...</p>
          <div className=" flex flex-col gap-2 mx-auto items-center w-[80px] h-[80px]">
            {/* <h1 className=" font-semibold"> loading...</h1> */}
            <Rings
              visible={true}
              height="100%"
              width="100%"
              color="#e43434"
              ariaLabel="rings-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Adeudos;
