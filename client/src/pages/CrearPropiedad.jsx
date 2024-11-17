import React, { useState, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { CreateProperty } from "../components/crearPropiedadForms/CreateProperty";
import { CreatePropertyCloud } from "../components/crearPropiedadForms/CreatePropertyCloud";
import CreatePropertyOpt from "../components/crearPropiedadForms/CreatePropertyOpt";
import { CreatePropBackend } from "../components/crearPropiedadForms/CreatePropBackend";

export const CrearPropiedad = () => {
  return (
    <>
      <div className=" mb-10">
         <CreatePropBackend/>  
        {/* <CreatePropertyCloud /> */}
        {/* <CreatePropertyOpt/> */}
      </div>
    </>
  );
};
