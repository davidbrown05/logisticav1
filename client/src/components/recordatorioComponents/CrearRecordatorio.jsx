import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";
import { BsChatLeftTextFill } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import { RiErrorWarningFill } from "react-icons/ri";
import { MdEditCalendar } from "react-icons/md";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import { RecordatoriosContext } from "../../context/RecordatoriosContext";
import { ActualizarRecordatorioModal } from "./ActualizarRecordatorioModal";
import { MensajeModal } from "./MensajeModal";

export const CrearRecordatorio = () => {
  const { recordatorios, setrecordatorios, loadingRecordatorios } =
    useContext(RecordatoriosContext);
  const [recordatoriosData, setrecordatoriosData] = useState(
    recordatorios || []
  );
  const [checkRecordatorios, setcheckRecordatorios] = useState(false);
  const [checkRecordatoiosDelete, setcheckRecordatoiosDelete] = useState(false);
  const [checkRecordatoiosUpdate, setcheckRecordatoiosUpdate] = useState(false);
  const [idRecordatorio, setidRecordatorio] = useState("");

  const [openModal, setopenModal] = useState(false);
  const [openModalMensaje, setopenModalMensaje] = useState(false);
  const [recordatorioData, setrecordatorioData] = useState(null);

  console.log("recodatoriosData", recordatoriosData);
  console.log("recordatorios", recordatorios);

  useEffect(() => {
    setrecordatoriosData(recordatorios);
  }, [setrecordatorios]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    console.log("formData", data);

    const fechaLRecordatorioInput = new Date(data.fechaRecordatorio);
    const fechaRecordatorioFormateada = fechaLRecordatorioInput.toISOString();
    data.fechaRecordatorio = fechaRecordatorioFormateada;
    // Actualizar el estado directamente con el nuevo recordatorio
    //setrecordatoriosData((prevData) => [...prevData, data]);
    // setrecordatoriosData(data);
    //console.log("nuevoRecordatorio", [...recordatoriosData, data]);
    // setcheckRecordatorios(true);

    // Enviar solo el nuevo recordatorio al servidor
    try {
      const responseCreate = await axios.post(
        `http://localhost:3000/api/recordatorios`,
        data // Aquí solo envías el objeto data
      );

      const nuevosDatos = responseCreate.data;
      console.log("Recordatorio creado", nuevosDatos);

      // Actualiza el estado solo con el nuevo recordatorio
      setrecordatorios((prevRecordatorios) => [
        ...prevRecordatorios,
        nuevosDatos,
      ]);
      setrecordatoriosData((prevData) => [...prevData, nuevosDatos]); // Asegúrate de actualizar recordatoriosData también

      toast.success("Recordatorio creado con éxito");
    } catch (error) {
      console.error("Error al crear el recordatorio:", error);
      toast.error("Error al crear el recordatorio");
    }
  });

  useEffect(() => {
    let newData = recordatoriosData;

    console.log("recordatoriosNewData", newData);

    if (checkRecordatorios) {
      console.log("handleUpdate", newData);
      handleUpdate(newData);
    }
    if (checkRecordatoiosDelete) {
      console.log("handleUpdate", newData);
      handleUpdate(newData);
    }
    if (checkRecordatoiosUpdate) {
      console.log("handleUpdate", newData);
      setopenModal(false);
      handleUpdate(newData);
    }

    return () => {
      console.log("fase desmintaje");
    };
  }, [recordatoriosData]);

  const handleUpdate = async (newData) => {
    console.log("newData en el handle", newData);

    const updatePromise = async () => {
      try {
        if (checkRecordatoiosDelete) {
          // Petición DELETE si se está eliminando un recordatorio
          const responseDelete = await axios.delete(
            `http://localhost:3000/api/recordatorios/${idRecordatorio}`
          );
          console.log(
            "Recordatorio eliminado del servidor",
            responseDelete.data
          );
          toast.success("Recordatorio eliminado del servidor");

          // Actualizar la lista después de eliminar el recordatorio
          setrecordatorios((prevRecordatorios) =>
            prevRecordatorios.filter(
              (recordatorio) => recordatorio._id !== idRecordatorio
            )
          );
        }

        // Restablecer los flags de verificación
        setcheckRecordatoiosDelete(false);
        setcheckRecordatorios(false);
        setcheckRecordatoiosUpdate(false);
      } catch (error) {
        setcheckRecordatorios(false);
        setcheckRecordatoiosDelete(false);
        setcheckRecordatoiosUpdate(false);
        console.log(error);
        throw error;
      }
    };

    // Usa toast.promise para manejar las notificaciones basadas en la promesa
    toast.promise(updatePromise(), {
      pending: "Actualizando recordatorios...",
      success: "Recordatorios actualizados con éxito 👌",
      error: "Error al actualizar los Recordatorios 🤯",
    });
  };

  // Función para ordenar recordatorios por fecha
  const ordenarRecordatorios = (data) => {
    return data.sort((a, b) => {
      const fechaA = moment(a.fechaRecordatorio);
      const fechaB = moment(b.fechaRecordatorio);

      // Primero los que ya pasaron, luego los futuros
      if (fechaA.isBefore(moment()) && fechaB.isAfter(moment())) return -1;
      if (fechaA.isAfter(moment()) && fechaB.isBefore(moment())) return 1;

      return fechaA - fechaB;
    });
  };

  const eliminarRecordatorio = async (index, dato) => {
    console.log("index", index);
    const result = await Swal.fire({
      title: `ELIMINAR RECORDATORIO?`,
      text: `"${dato.recordatorio}" ${dato._id}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar",
    });

    if (result.isConfirmed) {
      //setloadingUpload(true);
      try {
        setidRecordatorio(dato._id);
        const newArrayRecordatorios = [...recordatoriosData];
        newArrayRecordatorios.splice(index, 1);

        setrecordatoriosData(newArrayRecordatorios);
        setcheckRecordatoiosDelete(true);
      } catch (error) {
        setcheckRecordatoiosDelete(false);
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const recordatoriosOrdenados = ordenarRecordatorios(recordatorios);

  // Función para exportar la tabla a Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      recordatoriosOrdenados.map((recordatorio) => ({
        CONTACTO: recordatorio.contacto,
        ASUNTO: recordatorio.recordatorio,
        "FECHA RECORDATORIO": moment(recordatorio.fechaRecordatorio).format(
          "DD-MMM-YYYY"
        ),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Recordatorios");
    XLSX.writeFile(workbook, "Recordatorios.xlsx");
  };

  return (
    <>
      <div className=" flex flex-col items-center gap-10 bg-slate-900">
        <form onSubmit={onSubmit} className="p-3">
          <div className="form-container mt-10 flex flex-col items-center bg-slate-800 lg:w-[1200px] mx-auto rounded-lg ">
            <div className="form-header bg-black  text-white w-full  h-10 p-2 rounded-tl-md rounded-tr-md">
              RECORDATORIOS
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-between gap-5  lg:grid-cols-3 lg:gap-4  p-6 w-full lg:w-[1000px]">
              <div className="flex flex-col">
                <label className=" text-[15px]">CONTACTO</label>
                <input
                  type="text"
                  // onChange={(e) => (direccionRef.current = e.target.value)}
                  className="border p-2 rounded-md shadow-sm text-slate-800 font-bold"
                  {...register("contacto", { required: true })}
                />
                {errors.contacto && (
                  <p className=" text-red-500">RECORDATORIO REQUERIDO</p>
                )}
              </div>
              <div className="flex flex-col">
                <label className=" text-[15px]">ASUNTO</label>
                <textarea
                  type="text"
                  // onChange={(e) => (direccionRef.current = e.target.value)}
                  className="border p-2 rounded-md shadow-sm text-slate-800 font-bold"
                  {...register("recordatorio", { required: true })}
                />
                {errors.recordatorio && (
                  <p className=" text-red-500">RECORDATORIO REQUERIDO</p>
                )}
              </div>

              <div className="flex flex-col ">
                <label className="font-semibold">FECHA RECORDATORIO</label>
                <input
                  // value={datosVentas.fechaVenta}
                  {...register("fechaRecordatorio", { required: true })}
                  // defaultValue={moment(datosVentas.fechaVenta).format(
                  //   "YYYY-MM-DD"
                  // )}
                  type="date"
                  className="border p-2 rounded-md shadow-sm text-slate-900 font-bold"

                  // onChange={(e) => {
                  //   const newValue = e.target.value;
                  //   setDatosVentas((prevDatos) => ({
                  //     ...prevDatos,
                  //     fechaVenta: newValue,
                  //   }));
                  //   setValue("fechaVenta", newValue);
                  // }}
                />
                {errors.fechaRecordatorio && (
                  <p className=" text-red-500">FECHA REQUERIDA</p>
                )}
              </div>

              {/* Agrega los demás campos del primer formulario */}
            </div>

            <div className=" ">
              {/* botones agregar y cancelar */}
              <div className="flex gap-5 m-6 ">
                <div className="flex flex-col">
                  <button className="bg-black text-white px-4 py-2 rounded">
                    Guardar
                  </button>
                </div>
                <div className="flex flex-col">
                  <Link
                    to={"/compradores"}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Cancelar
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </form>
        {/* TABLA */}
        {recordatoriosOrdenados.length > 0 && (
          <div className="flex flex-col gap-2 items-center">
            <h1 className="text-yellow-400">
              RECORDATORIOS: {recordatoriosOrdenados.length}
            </h1>
            <button
              className="bg-green-800 text-white px-4 py-2 rounded"
              onClick={exportToExcel}
            >
              Exportar a Excel
            </button>
          </div>
        )}
        <div className="md:w-[800px] lg:w-[900px] xl:w-[950px] overflow-x-auto w-[330px]">
          {recordatoriosOrdenados && recordatoriosOrdenados.length > 0 ? (
            <table className="w-full mt-4 bg-slate-800 rounded-md shadow-md mb-4">
              <thead>
                <tr>
                  <th className="border p-2"></th>
                  <th className="border p-2">CONTACTO</th>
                  <th className="border p-2">ASUNTO</th>
                  <th className="border p-2">FECHA RECORDATORIO</th>
                  <th className="border p-2"></th>
                  <th className="border p-2"></th>
                </tr>
              </thead>
              <tbody className="">
                {recordatoriosOrdenados.map((dato, index) => (
                  <tr key={index} className="mt-2">
                    <td className="border p-3 text-center">
                      {new Date(dato.fechaRecordatorio) < new Date() && (
                        <RiErrorWarningFill className="text-[30px] text-yellow-500" />
                      )}
                    </td>
                    <td className="border p-3 text-center">{dato.contacto}</td>
                    <td className="border p-3 text-center">
                      {dato.recordatorio}
                    </td>
                    <td className="border p-3 text-center">
                      {moment(dato.fechaRecordatorio).format("DD-MMM-YYYY")}
                    </td>

                    {/* <td className="border p-3 text-center">
                      <button
                        onClick={() => {
                          setrecordatorioData(dato);
                          setopenModalMensaje(true);
                          //  mandarMensaje(index, dato);
                        }}
                        className="bg-green-500 text-white px-2 py-1 rounded shadow-lg"
                      >
                        <BsChatLeftTextFill />
                      </button>
                    </td> */}
                    <td className="border p-3 text-center">
                      <button
                        onClick={() => {
                          setidRecordatorio(dato._id);
                          setrecordatorioData(dato);
                          setopenModal(true);
                        }}
                        className="bg-gray-500 text-white px-2 py-1 rounded shadow-lg"
                      >
                        <MdEditCalendar />
                      </button>
                    </td>
                    <td className="border p-3 text-center">
                      <button
                        onClick={() => {
                          eliminarRecordatorio(index, dato);
                        }}
                        className="bg-red-500 text-white px-2 py-1 rounded shadow-lg"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="font-bold text-xl mb-10">Aún no hay Recordatorios.</p>
          )}
        </div>
      </div>
      <ActualizarRecordatorioModal
        openModal={openModal}
        setopenModal={setopenModal}
        setrecordatorios={setrecordatorios}
        idRecordatorio={idRecordatorio}
        recordatorioData={recordatorioData}
      />
      <MensajeModal
        openModalMensaje={openModalMensaje}
        setopenModalMensaje={setopenModalMensaje}
        recordatorioData={recordatorioData}
      />
    </>
  );
};
