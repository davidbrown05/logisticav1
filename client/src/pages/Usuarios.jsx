import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { toast } from "react-toastify";
import { IoSearchSharp } from "react-icons/io5";

export const Usuarios = () => {
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

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setisLoading] = useState(false);
  const [dataDownloaded, setDownloaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // const getUsuarios = async () => {
  //   try {
  //     setisLoading(true);
  //     const response = await axios.get("http://localhost:3000/api/usersData");
  //     console.log("responseData", response.data);
  //     setUsuarios(response.data);
  //     setisLoading(false);
  //     setDownloaded(true);
  //   } catch (error) {
  //     console.log(error);
  //     setisLoading(false);
  //   }
  // };

  const getUsuarios = async () => {
    try {
      setisLoading(true);
      const response = await axios.get("http://localhost:3000/api/usersData", {
        params: { searchTerm, page, limit: 10 },
      });
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
    getUsuarios();
  }, [page]);

  const eliminarUsuario = async (index, user) => {
    console.log("index", index);
    console.log("user", user);
    const result = await Swal.fire({
      title: `ELIMINAR USUARIO?`,
      text: "No podras recuperar estos datos",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar",
    });

    if (result.isConfirmed) {
      setisLoading(true);
      try {
        const userId = user._id;
        console.log("userID", userId);

        const responseDeleteUser = await axios.delete(
          `http://localhost:3000/api/usersData/${userId}`
        );

        toast.success("USUARIO ELIMINADO");
        await getUsuarios();
        setisLoading(false);
      } catch (error) {
        setisLoading(false);

        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      setPage(1); // Reset page to 1 when search term changes
      await getUsuarios();
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };


  return (
    <>
      <div className="flex flex-col w-full max-w-[1500px] mx-auto p-5">
        {dataDownloaded ? (
          <div className="overflow-x-auto mt-10 flex flex-col">
            <div className="flex items-center border border-gray-300 rounded-lg p-2 shadow-xl mt-9 w-full max-w-[800px] justify-between gap-2 mx-auto">
              <IoSearchSharp className="text-[20px]" />
              <input
                type="text"
                placeholder="Buscar Usuario"
                className="flex-grow outline-none w-full"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown} // Evento para manejar el enter
              />
            </div>
            <div className="flex self-end gap-4 mt-4">
              <Link
                to={"/signup"}
                className="bg-black p-2 text-white text-sm rounded-md shadow-lg"
              >
                CREAR NUEVO USUARIO
              </Link>
            </div>
            <table className="w-full mt-4 bg-white shadow-md mb-4 rounded-lg overflow-hidden">
              <thead>
                <tr>
                  <th className="border p-2">NOMBRE</th>
                  <th className="border p-2">CORREO</th>
                  <th className="border p-2">PASSWORD</th>
                  <th className="border p-2"></th>
                  <th className="border p-2"></th>
                  <th className="border p-2"></th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((comprador, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="border p-3 text-center">{comprador.username}</td>
                    <td className="border p-3 text-center">{comprador.email}</td>
                    <td className="border p-3 text-center">{comprador.password}</td>
                    <td className="border p-3 text-center">
                      <Link to={`/permisos1/${comprador._id}`}>
                      <button className="hidden md:block bg-black text-white px-2 py-1 rounded shadow-lg">
                          Permisos
                        </button>
                      </Link>
                    </td>
                    <td className="border p-3 text-center">
                      <Link to={`/editarusuario/${comprador._id}`}>
                        <button className="bg-blue-500 text-white px-2 py-1 rounded shadow-lg">
                          Editar
                        </button>
                      </Link>
                    </td>
                    <td className="border p-3 text-center">
                      <button
                        onClick={() => eliminarUsuario(index, comprador)}
                        className="bg-red-500 text-white px-2 py-1 rounded shadow-lg"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* pagination */}
            <div className="flex justify-center mt-4">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-4 py-2 mx-1 rounded ${
                    i + 1 === page ? "bg-black text-white" : "bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center">Cargando datos...</div>
        )}
      </div>
    </>
  );
};
