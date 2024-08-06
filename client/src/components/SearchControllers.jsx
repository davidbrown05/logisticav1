import React, { useState, useContext } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { InmuebleContext } from "../context/InmuebleContext";
import axios from "axios";

export const SearchControllers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { searchInmuebles } = useContext(InmuebleContext);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      searchInmuebles(searchTerm);
    }
  };
  return (
    <div className="flex items-center border border-gray-300 rounded-lg p-2 shadow-xl  mt-9 w-[300px] md:w-[600px] lg:w-[800px] xl:w-[800px] justify-between gap-2 ">
      <IoSearchSharp className="text-[20px]" />
      <input
        type="text"
        placeholder="Buscar Inmueble"
        className="flex-grow outline-none w-[300px] xl:w-[1000px]"
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown} // Evento para manejar el enter
      />
    </div>
  );
};
