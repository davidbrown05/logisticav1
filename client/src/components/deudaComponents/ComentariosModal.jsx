import React, { useEffect, useState } from "react";
import { RiCloseCircleFill } from "react-icons/ri";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { Rings } from "react-loader-spinner";
import moment from "moment";
import Swal from "sweetalert2";

export const ComentariosModal = ({
  openModal,
  setopenModal,
  setPartners,
  partners,
  setcomentarios,
  comentarios,
  partnerInfo,
  setpartnerInfo,
  corridaIndex,
  selectedRondaTab
}) => {
  console.log("partnerInfo", partnerInfo);
  console.log("comentarios", comentarios);
  console.log("comentariosCorridaIndex", selectedRondaTab)
  const [comentarioValue, setcomentarioValue] = useState("");
  const [checkPartner, setcheckPartner] = useState(false);
  const [loadingUpload, setloadingUpload] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit((data) => {
    const fechaVentaInput = new Date();
    const fechaLimiteFormateada = fechaVentaInput.toISOString();
    data.fechaComentario = fechaLimiteFormateada;
    console.log("formData", data);

    // Crear una copia del array de corridas
    const nuevosComentarios = [...comentarios];

    // Agregar la nueva corrida al array
    nuevosComentarios.push(data);

    // Actualizar el estado con el nuevo array de corridas
    setcomentarios(nuevosComentarios);

    // setopenModal(!openModal);
    setcheckPartner(true);

    setpartnerInfo({
      ...partnerInfo,
      corridas: partnerInfo.corridas.map((corrida, index) => {
        if (index === selectedRondaTab) {
          return {
            ...corrida,
            comentarios: nuevosComentarios,
          };
        }
        return corrida;
      }),
    });
  });

  useEffect(() => {
    const newDataPartner = partnerInfo;
    console.log("newDataParter", newDataPartner);

    if (checkPartner) {
      handleUpdate(newDataPartner);
    }
  }, [partnerInfo]);

  const handleUpdate = async (newData) => {
    console.log("newData en el handle", newData);
    try {
      // Actualizar los datos en el servidor
      const responseUpdate = await axios.put(
        `http://localhost:3000/api/partners/${partnerInfo._id}`,
        newData
      );

      //  const nuevosDatos = await responseUpdate.data;
      const nuevosDatos = responseUpdate.data;
      const updatedPartners = partners.map((partner) =>
        partner._id === nuevosDatos._id ? nuevosDatos : partner
      );

      console.log("datos actualizados", nuevosDatos);

      // Volver a obtener los datos del servidor después de la actualización
      const response = await axios.get(
        `http://localhost:3000/api/partners/${newData._id}`
      );

      // Actualizar el contexto con los nuevos datos

      setPartners(updatedPartners);
      // setPartners([...partners, updatedPartners]);

      setcheckPartner(false);
      setloadingUpload(false);
      setopenModal(!openModal);
      toast.success("COMENTARIOS ACTUALIZADOS");
    } catch (error) {
      setcheckPartner(false);
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <>
      {openModal && (
        <div
          onClick={() => setopenModal(!openModal)}
          className="w-screen h-screen fixed top-0 left-0 bg-[rgba(0,0,0,.5)] flex items-center justify-center overflow-y-auto z-30"
        >
          <form onSubmit={onSubmit}>
            <div
              onClick={(e) => e.stopPropagation()}
              className="form-container mt-10 flex flex-col items-center bg-[#f3f4f6] rounded-md w-[340px] md:w-[900px]"
            >
              <div className="form-header bg-black text-white w-full h-10 p-2 rounded-tl-md rounded-tr-md flex items-center justify-between">
                <h1 className="text-[10px] md:w-[15px]"> AGREGAR NUEVO COMENTARIO DE CORRIDA:</h1>
                <div className="flex flex-col md:flex-row  gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    type="submit"
                    className=" bg-green-500 rounded-lg px-4 text-[10px] md:text-[15px]"
                  >
                    AGREGAR
                  </button>
                  <button
                    onClick={() => {
                      setcomentarioValue("");
                      setopenModal(!openModal);
                    }}
                    className=" bg-red-500 rounded-lg px-4 text-[10px] md:text-[15px]"
                  >
                    CANCELAR
                  </button>
                </div>
              </div>
              <div className="flex flex-col mt-10 mb-10 w-full p-5">
                <label>COMENTARIO</label>
                <textarea
                  defaultValue={comentarioValue}
                  //   onChange={(e) => {
                  //     handlePrecioChange(e);
                  //   }}
                  type="text"
                  className="border p-2 rounded-md shadow-sm"
                  {...register("comentarioCorrida", { required: true })}
                />
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
