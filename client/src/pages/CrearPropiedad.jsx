import React, { useState, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { CreateProperty } from "../components/crearPropiedadForms/CreateProperty";
import { CreatePropertyCloud } from "../components/crearPropiedadForms/CreatePropertyCloud";
import CreatePropertyOpt from "../components/crearPropiedadForms/CreatePropertyOpt";
import { CreatePropBackend } from "../components/crearPropiedadForms/CreatePropBackend";

export const CrearPropiedad = () => {
  
  const saveProperty = async (e) => {
    e.preventDefault();
    console.log("submit", direccionRef.current);
    //DATOS DE LA PROPIEDAD
    const newProperty = {
      direccion: "Calle Principal",
      numExterior: 123,
      numInterior: 45,
      colonia: "Centro",
      codigoPostal: 12345,
      precio: 100000,
      estado: "Ciudad de México",
      tipoVenta: "Venta",
      tipoInmueble: "Casa",
      ciudad: "Ciudad de México",
      metrosTerreno: 200,
      numRecamaras: 3,
      numBanos: 2,
      nivel: "Planta Baja",
      estatusInmueble: "pendiente",
      estatusJuridico: "Legal",
      contacto: "Juan Pérez",
      llaves: "En la inmobiliaria",
      visitada: "No",
      empresa: "Inmobiliaria XYZ",
      folioEmpresa: "FOLIO123",
      nombreAcreditado: "Ana Gómez",
      foto: "https://images.pexels.com/photos/164522/pexels-photo-164522.jpeg?auto=compress&cs=tinysrgb&w=600",
    };

    try {
      setisLoading(true);
      const response = await axios.post(
        "http://localhost:3000/api/products",
        newProperty
      );
      // Obtener el _id de la propiedad recién creada
      const propertyId = response.data._id;
      console.log("propertyId", propertyId);
      //DATOS DE JURIDICO
      const datosJuridico = {
        propertyId: propertyId,
        encargadoProceso: "N/A",
        expediente: "N/A",
        juzgado: "N/A",
        acreditado: "N/A",
        numExpediente: "N/A",
        cesion: "N/A",
        cesionario: "N/A",
        proceso: "N/A",
        juicio: "N/A",
        jurisdiccion: "N/A",
        estatusProcesal: "N/A",
        gastos: 0,
        fondo: 0,
        gravamen: "N/A",
        extrajudicial: "N/A",
        observacionesJuridicas: []
      };

      // Crear automáticamente un documento en la colección "Juridico" con el mismo _id
      await axios.post(`http://localhost:3000/api/juridicoData`, datosJuridico);
      toast.success("NUEVA PROPIEDAD AGREGADA");
      setisLoading(false);
      navigate("/inventario");
    } catch (error) {
      toast.error(error.message);
      setisLoading(false);
    }
  };
  return (
    <>
      <div className=" mb-10">
      {/* <CreatePropBackend/> */}
         <CreatePropertyCloud/>  
       {/* <CreatePropertyOpt/> */}
          
      </div>
    </>
  );
};
