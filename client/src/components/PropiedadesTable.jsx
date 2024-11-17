import React, { useEffect, useState, useContext } from "react";
import { PropertyMenu } from "./PropertyMenu";
import axios from "axios";
import moment from "moment";
import "moment/locale/es"; // Importa el idioma español

moment.locale("es"); // Configura el idioma a nivel global
import { InmuebleContext } from "../context/InmuebleContext";
//import { useDispatch, useSelector } from "react-redux";
//import { fetchJuridicoData, selectAllJuridico,getJuridicoErrors,getJuridicoStatus } from "../redux/juridico/juridicoSlice";
import { toast } from "react-toastify";
import { Pagination } from "./Pagination";

export const PropiedadesTable = () => {
  const [propertyMenu, setPropertyMenu] = useState(false);
  const [item, setItem] = useState({});
  const [propiedades, setPropiedades] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [notificationShown, setNotificationShown] = useState(false);
  const [openModal, setopenModal] = useState(false)

  const { inmuebles, loadingInmuebles, setInmuebles } =
    useContext(InmuebleContext);
  const [inmueblesData, setInmueblesData] = useState(inmuebles);

  // const getPropiedades = async () => {
  //   try {
  //     setisLoading(true);
  //     const response = await axios.get("http://localhost:3000/api/products");
  //     console.log("responseData", response.data);
  //     setPropiedades(response.data);
  //     setisLoading(false);
  //   } catch (error) {
  //     console.log(error);
  //     setisLoading(false);
  //   }
  // };

  useEffect(() => {
    setInmueblesData(inmuebles);
  }, [inmuebles]);

  const handleCellClick = (item) => {
    setPropertyMenu(true);
    setItem(item);
  };

  function getStatusColorClass(statusVenta) {
    switch (statusVenta) {
      case "CANCELADA":
        return "bg-red-300";
      case "PENDIENTE":
        return "bg-yellow-100";
      case "VENDIDA":
        return "bg-green-300";
      case "DISPONIBLE":
        return "bg-gray-300";
      case "NO DISPONIBLE":
        return "bg-yellow-200";
      // Agrega más casos según sea necesario para otros estados
      default:
        return "";
    }
  }

  if (!loadingInmuebles) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {!loadingInmuebles ? (
        // Mostrar un indicador de carga mientras se cargan los datos
        <div className="text-center mt-5">
          <p>Loading...</p>
        </div>
      ) : (
        // Renderizar la tabla cuando los datos estén disponibles
        <div className="overflow-x-auto mt-10 p-10 w-screen 2xl:w-[1500px]">
          <table className=" table-auto rounded-xl shadow-lg overflow-x-auto text-center">
            <thead>
              <tr>
                <th className="px-4 py-2">FOTO</th>
                <th className="px-4 py-2">EXP</th>
                <th className="px-4 py-2">FECHA</th>
                <th className="px-4 py-2">DIRECCION</th>
                <th className="px-4 py-2">HABITADA</th>
                <th className="px-4 py-2">ESTATUS VENTA</th>
                <th className="px-4 py-2">FORMA PAGO</th>
                <th className="px-4 py-2">COMPRADOR</th>
                <th className="px-4 py-2">PRECIO</th>
                <th className="px-4 py-2">PRECIO FINAL</th>
                <th className="px-4 py-2">TIEMPO TRANSCURRIDO</th>
              </tr>
            </thead>
            <tbody>
              {inmuebles.map((expediente, index) => (
                <tr
                  onClick={() => handleCellClick(expediente)}
                  key={index}
                  className={
                    index % 2 === 0
                      ? "bg-gray-100 hover:bg-gray-200 cursor-pointer "
                      : "bg-white hover:bg-gray-200 cursor-pointer"
                  }
                >
                  <td className="border px-4 py-2">
                    <img
                      className="rounded-md"
                      src={
                        expediente.foto
                          ? expediente.foto
                          : "https://res.cloudinary.com/ddjajfmtw/image/upload/v1720735461/wl5bc6xzgbv3ell7pbbx.jpg"
                      }
                      alt={`Imagen de expediente ${expediente.numeroExpediente}`}
                      style={{ maxWidth: "50px", maxHeight: "50px" }}
                    />
                  </td>
                  <td className="border px-4 py-2 cursor-pointer">
                    {expediente.folioEmpresa}
                  </td>
                  <td className="border px-4 py-2">
                    {/* Formatear la fecha utilizando Moment.js */}
                    {moment(expediente.createdAt).format("DD/MMM/YYYY")}
                  </td>
                  <td className="border px-4 py-2">{expediente.direccion}</td>
                  <td className="border px-4 py-2">{expediente.visitada}</td>
                  <td
                    className={`border px-4 py-2 ${getStatusColorClass(
                      expediente.estatusVenta
                    )}`}
                  >
                    {expediente.estatusVenta}
                  </td>
                  <td className="border px-4 py-2">{expediente.formaPago}</td>
                  <td className="border px-4 py-2">{expediente.comprador}</td>
                  <td className="border px-4 py-2">
                    ${expediente.precio.toLocaleString()}
                  </td>
                  <td className="border px-4 py-2">
                    ${expediente.precioFinal}
                  </td>
                  <td className="border px-4 py-2">
                  {moment().diff(moment(expediente.createdAt), 'days')} días
                  {/* {moment(expediente.createdAt).locale("es").fromNow(true)} */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination />
        </div>
        
      )}
      
      <PropertyMenu
        propertyMenu={propertyMenu}
        setPropertyMenu={setPropertyMenu}
        item={item}
        openModal={openModal}
        setopenModal={setopenModal}
        // getPropiedades={getPropiedades}
      />
    </>
  );
};
