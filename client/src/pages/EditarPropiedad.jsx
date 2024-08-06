import React, { useState, useContext, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { InmuebleContext } from "../context/InmuebleContext";
import { Editar } from "../components/editarPropiedadComponents/Editar";
import { IoIosHome } from "react-icons/io";
import { MdMenu } from "react-icons/md";
import { PropertyMenu } from "../components/PropertyMenu";

function EditarPropiedad() {
    //get product id from url
  const { id } = useParams();
  console.log("id", id);

  const { inmuebles, loadingInmuebles } = useContext(InmuebleContext);

  console.log("inmuebles", inmuebles);

  

  //get the single product based on the id
  const product = inmuebles.find((item) => {
    return item._id === id;
  });

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
            EDITAR PROPIEDAD:
          </h1>

          <p className=" font-semibold text-center text-[15px] md:text-[20px] xl:text-[20px] text-gray-500">
            {direccion}
          </p>
        </div>
      </div>
   <Editar product={product}/>
   <PropertyMenu
              propertyMenu={propertyMenu}
              setPropertyMenu={setPropertyMenu}
              item={product}
            />
   </>
  )
}

export default EditarPropiedad