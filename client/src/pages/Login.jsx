import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import {
  signInSuccess,
  signInStart,
  signInFailure,
} from "../redux/user/userSlice";

export const Login = () => {
  const { currentUser } = useSelector((state) => state.user);
  console.log("reduxCurrentUser", currentUser);

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  // const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { login } = useAuth();

  const navigate = useNavigate();

  // const onSubmit = handleSubmit(async (data) => {
  //   console.log("formData", data);
  //   await login(data);
  //   navigate("/inventario");
  // });

  const onSubmitAxios = handleSubmit(async (userData) => {
    console.log("userData", userData);
    handleAxiosLogin(userData);
    // try {

    //   const response = await axios.post(
    //     "http://localhost:3000/api/auth/signin",
    //     userData
    //   );

    //   const data = await response.data
    //   console.log(data);

    //   toast.success("LOGIN SECCESFUL");
    //   dispatch(signInSuccess(data));
    //   //navigate("/inventario");
    // } catch (error) {
    //   toast.error(error.message);
    //   dispatch(signInFailure(error.message));
    //  // setLoading(false);
    // }
  });

  const handleAxiosLogin = async (userData) => {
    dispatch(signInStart());
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/signin",
        userData
      );
      const data = response.data;
      console.log("responseData", data);
      // Solo considerar éxito si no hay mensaje de error
      if (response.status === 200 && !data.message) {
        toast.success("LOGIN SUCCESSFUL");
        dispatch(signInSuccess(data));
      } else {
        throw new Error(data.message || "Unexpected error");
      }
      // navigate("/inventario");
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message); // Muestra el mensaje de error del servidor
        dispatch(signInFailure(error.response.data.message));
      } else {
        toast.error(error.message);
        dispatch(signInFailure(error.message));
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen  w-full p-1">
      <div className="bg-gray-300 p-8 rounded shadow-md w-full md:w-[800px] lg:w-[1000px]  ">
        <img
          src="logoLogitica.webp"
          alt="Imagen"
          className="mx-auto mb-1 rounded-lg w-[900px] h-[300px] object-contain "
        />
        {currentUser ? (
          <div className=" flex flex-col items-center gap-3 w-full">
            <p className="text-center text-xl font-semibold ">
              Bienvenido {currentUser.email}
            </p>
            {/* Puedes agregar el texto que desees aquí */}
            <Link to={"/inventario"}>
              <button
                onClick={() => {
                  // Agrega la lógica para continuar según tus necesidades
                }}
                className="w-full bg-black text-white p-2 rounded"
              >
                INVENTARIO
              </button>
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmitAxios}>
            <div className="mb-4 ">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-3 py-2 border rounded"
                {...register("email", { required: true })}
              />
              {errors.email && (
                <p className=" text-red-500">email is required</p>
              )}
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Contraseña"
                className="w-full px-3 py-2 border rounded"
                {...register("password", { required: true })}
              />
              {errors.password && (
                <p className=" text-red-500">password is required</p>
              )}
            </div>

            <button className="w-full bg-black text-white py-2 rounded">
              Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
