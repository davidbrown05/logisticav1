import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoSearchSharp } from "react-icons/io5";

export const CompradoresModal = ({ openModal, setopenModal, setComprador,setCompradorRef }) => {
  const [isLoading, setisLoading] = useState(false);
  const [compradores, setCompradores] = useState(false);
  const [dataDownloaded, setDownloaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getCompradores = async () => {
    try {
      setisLoading(true);
      const response = await axios.get("http://localhost:3000/api/comprador", {
        params: { searchTerm, page, limit: 10 },
      });
      console.log("responseData", response.data);
      setCompradores(response.data.compradores);
      setisLoading(false);
      setDownloaded(true);
    } catch (error) {
      console.log(error);
      setisLoading(false);
    }
  };

  useEffect(() => {
    getCompradores();
  }, [page]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevenir el comportamiento por defecto
      e.stopPropagation();
      setPage(1); // Reset page to 1 when search term changes
      await getCompradores();
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <>
      
        {openModal && (
          <div
            onClick={() => setopenModal(!openModal)}
            className="w-screen h-screen  fixed top-0 left-0 bg-[rgba(0,0,0,.5)] flex items-center justify-center overflow-y-auto z-30"
          >
          
              <div
                onClick={(e) => e.stopPropagation()}
                className="form-container mt-10 flex flex-col items-center bg-[#f3f4f6] rounded-md"
              >
                <div className="form-header bg-black text-white w-full md:w-[800px] lg:w-[1000px] h-10 p-2 rounded-tl-md rounded-tr-md flex items-center justify-between">
                  <h1> ESCOGER COMPRADOR:</h1>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setopenModal(!openModal);
                      }}
                      className=" bg-red-500 rounded-lg px-4"
                    >
                      CANCELAR
                    </button>
                  </div>
                </div>
                <div className="flex items-center border border-gray-300 rounded-lg p-2 shadow-xl  mt-9 w-[300px] lg:w-[600px] justify-between gap-2 ">
                  <IoSearchSharp className="text-[20px]" />
                  <input
                    type="text"
                    placeholder="Buscar Comprador"
                    className="flex-grow outline-none w-[300px] xl:w-[1000px]"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown} // Evento para manejar el enter
                  />
                </div>

                <div className="w-full">
                  {compradores.length > 0 ? (
                    <table className="w-full mt-4 bg-white  rounded-md shadow-md mb-4">
                      <thead>
                        <tr>
                          <th className="border p-2">COMPRADOR</th>

                          <th className="border p-2"></th>
                        </tr>
                      </thead>
                      <tbody className="">
                        {compradores.map((comprador, index) => (
                          <tr key={index} className="mt-2 hover:bg-gray-100">
                            <td className="border p-3 text-center ">
                              {comprador.nombreCompleto}
                            </td>

                            <td className="border p-3 text-center">
                              <button
                                onClick={() => {
                                  setCompradorRef(comprador);
                                  setopenModal(!openModal)
                                }}
                                className="bg-blue-500 text-white px-2 py-1 rounded shadow-lg"
                              >
                                Seleccionar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="font-bold text-xl mb-10">
                      Aún no hay compradores.
                    </p>
                  )}
                </div>
              </div>
            
          </div>
        )}
      
    </>
  );
};
