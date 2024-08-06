import React, { useState, useCallback, useContext, useEffect } from "react";

import { FaPlus } from "react-icons/fa6";
import { JuridicoContext } from "../../context/JuridicoContext";
import { PagosContext } from "../../context/PagosContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import moment from "moment";
import { Rings } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
//import { forceUpdatePosts } from "../../redux/juridico/postSlice";
import { forceUpdatePagosLists } from "../../redux/juridico/pagosPendientesSlice";
//import { addTask } from "../../redux/juridico/juridicoSlice";
import { UsuarioContext } from "../../context/UsuarioContext";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndContext, DndProvider, useDrop, useDrag } from "react-dnd";

import { v4 as uuidv4 } from "uuid";
import { TaskCalSection } from "./TaskCalSection";

export const Calendario = ({
  id,
  product,
  setCurrentStep,
  setEditTask,
  currentUser,
}) => {
  const { pagos, setPagos } = useContext(PagosContext);
  const dispatch = useDispatch();
  const [checkPagos, setCheckPagos] = useState(false);
  const [checkPagosDelete, setcheckPagosDelete] = useState(false);
  const [cantidad, setCantidad] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const { userCOntext } = useContext(UsuarioContext);
  const [pagosData, setpagosData] = useState(pagos);
  const [pagosDeleteData, setPagosDeleteData] = useState(pagos);
  const [tasks, setTasks] = useState(pagosData.calendarioLista);
  const [comprador, setComprador] = useState(null); // Nuevo estado para almacenar los datos del comprador

  const handlePrecioChange = (event) => {
    // Eliminar caracteres no numéricos
    const inputPrecio = event.target.value.replace(/[^0-9]/g, "");

    // Formatear con comas y agregar el símbolo de peso
    const formattedPrecio = `$${inputPrecio.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ","
    )}`;

    // Actualizar el estado del precio
    setCantidad(formattedPrecio);

    // setValue("cantidadPago", inputPrecio, { shouldValidate: true });
  };

  // useEffect para actualizar el formulario después de que juridicoData cambie
  useEffect(() => {
    let neData = pagosData;
    console.log("juridicoDataDeletedActualizado", neData);
    console.log("tasks", tasks);

    if (checkPagos) {
      setTasks(pagosData.calendarioLista);
      console.log("handleUpdate2", neData);
      handleUpdate2(neData);
    }

    return () => {
      console.log("fase desmintaje");
    };
  }, [pagosData]);

  const handleUpdate2 = async (data) => {
    try {
      // Actualizar los datos en el servidor
      const responseUpdate = await axios.put(
        `http://localhost:3000/api/pagosData/${pagosData._id}`,
        data
      );
      const nuevosDatos = await responseUpdate.data;

      console.log("datos actualizados");

      // Volver a obtener los datos del servidor después de la actualización
      const response = await axios.get(
        `http://localhost:3000/api/pagosData/${id}`
      );

      // Actualizar el contexto con los nuevos datos
      // setJuridico(response.data[0]);
      setPagos(nuevosDatos);
      dispatch(forceUpdatePagosLists()); // Despachar la acción para agregar una nueva tarea

      setCheckPagos(false);
      toast.success("PAGOS ACTUALIZADOS");
    } catch (error) {
      setCheckPagos(false);
      console.log(error);
      toast.error(error.message);
    }
  };

  const onSubmit = handleSubmit((data) => {
    // Obtener la fecha actual
    const fechaActual = new Date();
    // Formatear la fecha actual como una cadena en formato ISO 8601
    const fechaAsignacionFormateada = fechaActual.toISOString();

    // Formatear la fecha límite desde el input
    const fechaLimiteInput = new Date(data.fechaLimite);
    const fechaLimiteFormateada = fechaLimiteInput.toISOString();
    // Generar una ID única
    const uniqueId = uuidv4();
    data._id = uniqueId;
    data.usuario = userCOntext.email;
    let amount = data.cantidad;
    // Remover el símbolo $ y las comas
    amount = amount.replace(/[$,]/g, "");

    data.cantidad = parseFloat(amount);
    data.fehcaAsignacion = fechaAsignacionFormateada; // Asignar la fecha de asignación formateada
    data.fechaLimite = fechaLimiteFormateada; // Asignar la fecha límite formateada
    data.status = "ACTIVA";
    data.url = `http://localhost:5173/pagosadeudos/${product._id}`;
    data.direccion = product.direccion;
    data.comprador = product.comprador;
    data.telefono = comprador.phone;
    console.log("formData", data);

    const newArrayObjeto = [...pagosData.calendarioLista];
    // Paso 2: Actualizar la copia con los datos de nuevaObservacion
    newArrayObjeto.push(data);

    // Actualizar el contexto con los nuevos datos
    setpagosData((prevJuridico) => ({
      ...prevJuridico,
      // Actualizar los campos necesarios con los datos del formulario
      calendarioLista: newArrayObjeto,
    }));

    setCheckPagos(true);
  });

  useEffect(() => {
    const fetchCompradorData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/comprador");
        const compradorData = response.data.find(
          (c) => c.nombreCompleto === product.comprador
        );
        console.log("compradorData", compradorData);
        setComprador(compradorData);
      } catch (error) {
        console.error("Error fetching comprador data:", error);
      }
    };

    fetchCompradorData();
  }, [product.comprador]);

  // Ordenar las tareas por fecha límite de menor a mayor
  const sortedTasks = tasks.slice().sort((a, b) => {
    const fechaLimiteA = moment(a.fechaLimite);
    const fechaLimiteB = moment(b.fechaLimite);
    return fechaLimiteA - fechaLimiteB;
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <>
      <div className="form-container mt-10 flex flex-col items-center w-full  lg:w-[1000px] max-w-[1500px] bg-[#f3f4f6]">
          {/* Formulario para agregar observaciones */}
          <form onSubmit={onSubmit}>
          <div className="form-container mt-10 flex flex-col items-center w-full  lg:w-[1000px] max-w-[1500px] bg-[#f3f4f6]">
          <div className="form-header bg-black text-white w-full h-10 p-2 rounded-tl-md rounded-tr-md">
                CALENDARIO DE PAGOS
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-10  p-6 ">
                <div className="flex w-[700px] gap-10">
                  <div className="flex flex-col">
                    <label>CANTIDAD</label>
                    <input
                      {...register("cantidad", { required: true })}
                      value={cantidad}
                      onChange={(e) => {
                        handlePrecioChange(e);
                      }}
                      type="text"
                      className="border p-2 rounded-md shadow-sm"
                    />
                  </div>
                  <div className="flex flex-col w-[610px] ">
                    <label className=" font-semibold">OBSERVACIONES</label>
                    <textarea
                      className="border p-2 rounded-md shadow-sm lg:w-[400px]"
                      {...register("observacion", { required: true })}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-semibold">FECHA DE TAREA</label>
                    <input
                      type="date"
                      className="border p-2 rounded-md shadow-sm"
                      {...register("fechaLimite", { required: true })}
                    />
                  </div>

                  <div>
                    <button
                      // onClick={agregarObservacion}
                      className="bg-black text-white px-2 py-2 rounded-full shadow-lg"
                    >
                      <FaPlus />
                    </button>
                  </div>
                  {loading && (
                    <div className="flex flex-col gap-2 mx-auto items-center w-[80px] h-[80px]">
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
                  )}
                </div>
              </div>
            </div>
          </form>
          <TaskCalSection
            tasks={sortedTasks}
            setEditTask={setEditTask}
            setTasks={setTasks}
            pagosData={pagosData}
            setpagosData={setpagosData}
            pagosDeleteData={pagosDeleteData}
            setPagosDeleteData={setPagosDeleteData}
            pagos={pagos}
            setPagos={setPagos}
            setCurrentStep={setCurrentStep}
          />

          {/* Formulario para eliminar observaciones */}
          <form></form>
        </div>
      </>
    </DndProvider>
  );
};
