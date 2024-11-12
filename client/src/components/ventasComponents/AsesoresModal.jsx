import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoSearchSharp } from "react-icons/io5";

export const AsesoresModal = ({
  openModalAsesor,
  setopenModalAsesor,
  setAsesor,
  setCompradorRef,
}) => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setisLoading] = useState(false);
  const [dataDownloaded, setDownloaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getUsers = async () => {
    try {
      setisLoading(true);
      const response = await axios.get("http://localhost:3000/api/usersData", {
        params: { searchTerm, page, limit: 10 },
      });
      console.log("responseData", response.data);
      setUsuarios(response.data.users);
      setTotalPages(response.data.totalPages);
      setisLoading(false);
      setDownloaded(true);
    } catch (error) {
      console.log(error);
      setisLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
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
      {openModalAsesor && (
        <div
          onClick={() => setopenModalAsesor(!openModalAsesor)}
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
                    setopenModalAsesor(!openModalAsesor);
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
                placeholder="Buscar Asesor"
                className="flex-grow outline-none w-[300px] xl:w-[1000px]"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown} // Evento para manejar el enter
              />
            </div>

            <div className="w-full">
              {usuarios.length > 0 ? (
                <table className="w-full mt-4 bg-white  rounded-md shadow-md mb-4">
                  <thead>
                    <tr>
                      <th className="border p-2">COMPRADOR</th>

                      <th className="border p-2"></th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {usuarios.map((comprador, index) => (
                      <tr key={index} className="mt-2 hover:bg-gray-100">
                        <td className="border p-3 text-center ">
                          {comprador.username}
                        </td>

                        <td className="border p-3 text-center">
                          <button
                            onClick={() => {
                              setAsesor(comprador.username);
                              setopenModalAsesor(!openModalAsesor);
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
                  Aún no hay usuarios.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
