import React, { useState, useContext, useEffect } from "react";
import { Switch } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { JuridicoContext } from "../../context/JuridicoContext";
import axios from "axios";
import { toast } from "react-toastify";

export const PermisosComponent = ({ id }) => {
  const { juridico, setJuridico } = useContext(JuridicoContext);

  const [juridicoData, setJuridicoData] = useState(juridico);

  const [isSelected, setIsSelected] = useState(juridico.direccion);
  const [isSelectedAdmin, setIsSelectedAdmin] = useState(
    juridico.administracion
  );
  const [isSelectedJuridico, setIsSelectedJuridico] = useState(
    juridico.juridico
  );

  const [checkJuridico, setCheckJuridico] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("juridicoData", juridicoData);
    const newData = juridicoData;
    if (checkJuridico) {
      console.log("handleUpdate2", newData);
      handleUpdate1(newData);
    }
  }, [juridicoData]);

  console.log("PermisosJuridicos", juridico);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const submit = handleSubmit(async (data) => {
    console.log("formData", data);

    // handleUpdate1(data);
  });

  //UPDATE INFORMATION 1
  const handleUpdate1 = async (data) => {
    // e.preventDefault();
    setLoading(true);

    try {
      // Actualizar los datos en el servidor
      const responseUpdate = await axios.put(
        `http://localhost:3000/api/juridicoData/${juridicoData._id}`,
        data
      );

      // Volver a obtener los datos del servidor después de la actualización
      const response = await axios.get(
        `http://localhost:3000/api/juridicoData/${id}`
      );

      // obtener la propiedad correspondiente
      const responseInmueble = await axios.get(
        `http://localhost:3000/api/products/${id}`
      );

      const inmueble = responseInmueble.data;

      // Actualizar el campo estatusVenta del inmueble
      const updatedInmueble = {
        ...inmueble,
        juridicoDir: data.direccion,
        juridicoadmin: data.administracion,
        juridicoJur: data.juridico,
      };

      // Actualizar los datos del Inmueble
      const responseUpdateInmueble = await axios.put(
        `http://localhost:3000/api/products/${id}`,
        updatedInmueble
      );

      // Actualizar el contexto con los nuevos datos
      console.log("responseJuridico", responseUpdate.data)
      console.log("responsedata", response.data[0])
    //  setJuridico(response.data[0]);
      setJuridico(responseUpdate.data);

      setLoading(false);
      toast.success("DATOS GENERALES ACTUALIZADOS");
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.message);
    }
  };

  const onSubmit = (data) => {
    console.log("Formulario enviado con datos:", data);

    // Actualizar el contexto con los nuevos datos
    setJuridicoData((prevJuridico) => ({
      ...prevJuridico,
      // Actualizar los campos necesarios con los datos del formulario

      obvAdmin: data.obvAdmin,
      obvDir: data.obvDir,
      obvJuridicas: data.obvJuridicas,
      juridico: isSelectedJuridico,
      direccion: isSelected,
      administracion: isSelectedAdmin,
    }));

    setCheckJuridico(true);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-container mt-10 flex flex-col items-center w-[320px] md:w-[800px]  lg:w-[1000px] max-w-[1500px] bg-[#f3f4f6]">
          <div className="form-header bg-black text-white w-full h-10 p-2 rounded-tl-md rounded-tr-md">
            PERMISOS JURIDIOS
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center mt-8 mb-8 gap-10 ">
            {/* DIV DIRECCION */}
            <div className="flex flex-col items-center gap-5">
              <Switch isSelected={isSelected} onValueChange={setIsSelected} />
              <p>{juridicoData.user_dir}</p>
              <div className="flex flex-col">
                <label className=" font-semibold">
                  Observaciones Dirección
                </label>
                <input
                  value={juridicoData.obvDir}
                  type="text"
                  {...register("obvDir", { required: true })}
                  onChange={(e) => {
                    setJuridicoData((prevDatosJuridico) => ({
                      ...prevDatosJuridico,
                      obvDir: e.target.value,
                    }));
                    setValue("obvDir", e.target.value);
                  }}
                  // onChange={(e) => (direccionRef.current = e.target.value)}
                  className="border p-2 rounded-md shadow-sm"
                />
              </div>
              <button
                type="submit"
                className=" bg-black p-2 text-white rounded-md"
              >
                Confirmar Direccion
              </button>
            </div>
            {/* DIV ADMINISTRATIVO */}
            <div className="flex flex-col items-center gap-5">
              <Switch
                isSelected={isSelectedAdmin}
                onValueChange={setIsSelectedAdmin}
              />
              <p>{juridicoData.user_admin}</p>
              <div className="flex flex-col">
                <label className=" font-semibold">
                  Observaciones Administracion
                </label>
                <input
                  value={juridicoData.obvAdmin}
                  type="text"
                  {...register("obvAdmin", { required: true })}
                  onChange={(e) => {
                    setJuridicoData((prevDatosJuridico) => ({
                      ...prevDatosJuridico,
                      obvAdmin: e.target.value,
                    }));
                    setValue("obvAdmin", e.target.value);
                  }}
                  // onChange={(e) => (direccionRef.current = e.target.value)}
                  className="border p-2 rounded-md shadow-sm"
                />
              </div>
              <button
                type="submit"
                className=" bg-black p-2 text-white rounded-md"
              >
                Confirmar Administración
              </button>
            </div>
            {/* DIV JURIDICO */}
            <div className="flex flex-col items-center gap-5">
              <Switch
                isSelected={isSelectedJuridico}
                onValueChange={setIsSelectedJuridico}
              />
              <p>{juridicoData.user_Juridico}</p>
              <div className="flex flex-col">
                <label className=" font-semibold">Observaciones Juridico</label>
                <input
                  value={juridicoData.obvJuridicas}
                  type="text"
                  {...register("obvJuridicas", { required: true })}
                  onChange={(e) => {
                    setJuridicoData((prevDatosJuridico) => ({
                      ...prevDatosJuridico,
                      obvJuridicas: e.target.value,
                    }));
                    setValue("obvJuridicas", e.target.value);
                  }}
                  // onChange={(e) => (direccionRef.current = e.target.value)}
                  className="border p-2 rounded-md shadow-sm"
                />
              </div>
              <button
                type="submit"
                className=" bg-black p-2 text-white rounded-md"
              >
                Confirmar Juridico
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};
