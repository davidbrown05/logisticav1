import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { toast } from "react-toastify";
import { IoSearchSharp } from "react-icons/io5";

const listaCompradores = [
  {
    nombre: "Juan",
    telefono: "123456789",
    correo: "juan@example.com",
    direccion: "Calle 123",
  },
  {
    nombre: "María",
    telefono: "987654321",
    correo: "maria@example.com",
    direccion: "Avenida 456",
  },
  {
    nombre: "Pedro",
    telefono: "555555555",
    correo: "pedro@example.com",
    direccion: "Plaza 789",
  },
  {
    nombre: "Luisa",
    telefono: "999888777",
    correo: "luisa@example.com",
    direccion: "Carrera 321",
  },
  {
    nombre: "Carlos",
    telefono: "111222333",
    correo: "carlos@example.com",
    direccion: "Paseo 654",
  },
  {
    nombre: "Ana",
    telefono: "777666555",
    correo: "ana@example.com",
    direccion: "Camino 987",
  },
  {
    nombre: "Miguel",
    telefono: "444333222",
    correo: "miguel@example.com",
    direccion: "Ruta 159",
  },
  {
    nombre: "Sofía",
    telefono: "222111000",
    correo: "sofia@example.com",
    direccion: "Sendero 753",
  },
  {
    nombre: "Alejandro",
    telefono: "666777888",
    correo: "alejandro@example.com",
    direccion: "Callejón 357",
  },
  {
    nombre: "Carmen",
    telefono: "888999000",
    correo: "carmen@example.com",
    direccion: "Pasaje 852",
  },
  // Agrega los demás compradores aquí
];

export const Compradores = () => {
  const [compradores, setCompradores] = useState([]);
  const [loading, setisLoading] = useState(false);
  const [dataDownloaded, setDownloaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleEditar = (index) => {
    // Lógica para la edición
  };

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

  const handleEliminar = async (index, comprador) => {
    const result = await Swal.fire({
      title: `Eliminar ${comprador.firstName}${comprador.lastName}`,
      text: "No podras recuperar esta propiedad y su información",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        // Lógica para la eliminación
        const nuevosCompradores = [...compradores];
        nuevosCompradores.splice(index, 1);
        setCompradores(nuevosCompradores);
      } catch (error) {
        toast.error(error);
      }
    }
  };

  const deleteComprador = async (index, comprador) => {
    const result = await Swal.fire({
      title: `Eliminar ${comprador.firstName} ${comprador.lastName}`,
      text: "No podras recuperar este comprador!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#d33",
      confirmButtonText: "COMFIRMAR!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `http://localhost:3000/api/comprador/${comprador._id}`
        );
        toast.success("COMPRADOR ELIMINADO");
        getCompradores();
      } catch (error) {
        toast.error(error);
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      setPage(1); // Reset page to 1 when search term changes
      await getCompradores();
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <>
      {dataDownloaded ? (
        <div className="flex flex-col w-full max-w-[1500px] mx-auto p-5 items-center ">
          <div className="flex items-center border border-gray-300 rounded-lg p-2 shadow-xl mt-9 w-full max-w-[800px] justify-between gap-2 mb-5">
            <IoSearchSharp className="text-[20px]" />
            <input
              type="text"
              placeholder="Buscar Comprador"
              className="flex-grow outline-none w-full"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown} // Evento para manejar el enter
            />
          </div>

          <div className="overflow-x-auto w-full max-w-[1000px] mt-4 flex flex-col gap-5">
            <Link
              to={"/crearcomprador"}
              className="bg-black p-2 text-white text-sm rounded-md shadow-lg self-end "
            >
              CREAR NUEVO COMPRADOR
            </Link>
            <table className="w-full bg-white rounded-md shadow-md mb-4">
              <thead>
                <tr>
                  <th className="border p-2">NOMBRE</th>
                  <th className="border p-2">TELÉFONO</th>
                  <th className="border p-2">CORREO</th>
                  <th className="border p-2">DIRECCIÓN</th>
                  <th className="border p-2"></th>
                  <th className="border p-2"></th>
                </tr>
              </thead>
              <tbody>
                {compradores.map((comprador, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="border p-3 text-center">
                      {comprador.nombreCompleto}
                    </td>
                    <td className="border p-3 text-center">
                      {comprador.phone}
                    </td>
                    <td className="border p-3 text-center">
                      {comprador.email}
                    </td>
                    <td className="border p-3 text-center">
                      {comprador.direccion}
                    </td>
                    <td className="border p-3 text-center">
                      <Link
                        to={{
                          pathname: `/editarcomprador/${comprador._id}`,
                          state: { comprador },
                        }}
                      >
                        <button className="bg-blue-500 text-white px-2 py-1 rounded shadow-lg">
                          Editar
                        </button>
                      </Link>
                    </td>
                    <td className="border p-3 text-center">
                      <button
                        onClick={() => deleteComprador(index, comprador)}
                        className="bg-red-500 text-white px-2 py-1 rounded shadow-lg"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center">Cargando datos...</div>
      )}
    </>
  );
};
