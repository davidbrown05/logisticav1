import React, { useEffect, useState } from "react";
import { RiCloseCircleFill } from "react-icons/ri";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { Rings } from "react-loader-spinner";
import moment from "moment";
import Swal from "sweetalert2";

export const reciboModal = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

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
              className="form-container mt-10 flex flex-col items-center bg-[#f3f4f6] rounded-md"
            >
              <div className="form-header bg-black text-white w-[1000px] h-10 p-2 rounded-tl-md rounded-tr-md flex items-center justify-between">
                <h1> AGREGAR NUEVO COMENTARIO DE CORRIDA:</h1>
                <div className="flex gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    type="submit"
                    className=" bg-green-500 rounded-lg px-4"
                  >
                    AGREGAR
                  </button>
                  <button
                    onClick={() => {
                      setcomentarioValue("");
                      setopenModal(!openModal);
                    }}
                    className=" bg-red-500 rounded-lg px-4"
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
