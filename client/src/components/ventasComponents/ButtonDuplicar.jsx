import React, { useState, useRef, useEffect, useContext } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { Rings } from "react-loader-spinner";
import { InmuebleContext } from "../../context/InmuebleContext";
import Swal from "sweetalert2";

export const ButtonDuplicar = ({ id, setduplicarPropiedad }) => {
  const { inmuebles, loadingInmuebles, setInmuebles } =
    useContext(InmuebleContext);
  const handleDuplicar = async () => {
    console.log("Property ID", id);
    const result = await Swal.fire({
      title: `DUPLICAR PROPIEDAD?`,
      text: "No podras recuperar estos datos",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Duplicar",
    });

    if (result.isConfirmed) {
      try {
        console.log("DUPLICANDO PROPIEDAD");
        duplicarDatos();
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    } else {
      setduplicarPropiedad(false);
    }
  };

  const duplicarDatos = async () => {
    //PRIMERO OBTENEMOS TODOS LOS DATOS DE CADA SECCION CORRESPONDIENTES A LA PROPIEDAD ACTUAL
    // obtener la propiedad actual
    const responseInmueble = await axios.get(
      `http://localhost:3000/api/products/${id}`
    );
    //obtener juridico de propiedad actual
    const responseJuridico = await axios.get(
      `http://localhost:3000/api/juridicoData/${id}`
    );
    //obtener adeudos de propiedad actual
    const responseAdeudos = await axios.get(
      `http://localhost:3000/api/adeudosData/${id}`
    );
    //obtener ventas de propiedad actual
    const responseVentas = await axios.get(
      `http://localhost:3000/api/ventasData/${id}`
    );
    //obtener pagos de propiedad actual
    const responsePagos = await axios.get(
      `http://localhost:3000/api/pagosData/${id}`
    );
    //obtener comisiones de propiedad actual
    const responseComisiones = await axios.get(
      `http://localhost:3000/api/comisionesData/${id}`
    );
    //obtener deuda de propiedad actual
    const responseDeuda = await axios.get(
      `http://localhost:3000/api/comisionesData/${id}`
    );

    const inmueble = responseInmueble.data;
    const juridico = responseJuridico.data[0];
    const adeudos = responseAdeudos.data[0];
    const ventas = responseVentas.data[0];
    const pagos = responsePagos.data[0];
    const comisiones = responseComisiones.data[0];
    const propertyDeuda = responseDeuda.data[0];
    console.log("inmueble", inmueble);
    console.log("juridico", juridico);
    console.log("adeudos", adeudos);
    console.log("ventas", ventas);
    console.log("pagos", pagos);
    console.log("comisiones", comisiones);
    console.log("propertyDeuda", propertyDeuda);

    // Actualizar el campo estatusVenta del inmueble
    const datosPropiedadNueva = {
      assetid: inmueble.assetid,
      ciudad: inmueble.ciudad,
      codigoPostal: inmueble.codigoPostal,
      colonia: inmueble.colonia,
      comprador: "N/A",
      compradorRef: inmueble.compradorRef,
      contacto: inmueble.contacto,
      direccion: inmueble.direccion,
      empresa: inmueble.empresa,
      estado: inmueble.estado,
      estatusInmueble: inmueble.estatusInmueble,
      estatusJuridico: inmueble.estatusJuridico,
      estatusVenta: "NO DISPONIBLE",
      folioEmpresa: `${inmueble.folioEmpresa} DUPLICADO`,
      formaPago: inmueble.formaPago,
      foto: inmueble.foto,
      juridicoDir: false,
      juridicoJur: false,
      juridicoadmin: false,
      llaves: inmueble.llaves,
      metrosTerreno: inmueble.metrosTerreno,
      nivel: inmueble.nivel,
      nombreAcreditado: inmueble.nombreAcreditado,
      numBanos: inmueble.numBanos,
      numExterior: inmueble.numExterior,
      numInterior: inmueble.numInterior,
      numRecamaras: inmueble.numRecamaras,
      precio: inmueble.precio,
      precioFinal: inmueble.precioFinal,
      tipoInmueble: inmueble.tipoInmueble,
      tipoVenta: inmueble.tipoVenta,

      visitada: inmueble.visitada,
    };

    //AGREGAR PROPIEDAD DUPLICADA

    console.log("datosPropiedadNueva", datosPropiedadNueva);
    const response = await axios.post(
      "http://localhost:3000/api/products",
      datosPropiedadNueva
    );

    //ID DE LA NUEVA PROPIEDAD

    const responseNewInmueble = response.data;
    const propertyId = response.data._id;

    const datosNuevosJuridicos = {
      propertyId: propertyId,
      encargadoProceso: juridico.encargadoProceso,
      expediente: juridico.expediente,
      juzgado: juridico.juzgado,
      acreditado: juridico.acreditado,
      numExpediente: juridico.numExpediente,
      cesion: juridico.cesion,
      cesionario: juridico.cesionario,
      proceso: juridico.proceso,
      juicio: juridico.juicio,
      jurisdiccion: juridico.jurisdiccion,
      estatusProcesal: juridico.estatusProcesal,
      gastos: juridico.gastos,
      fondo: juridico.fondo,
      gravamen: juridico.gravamen,
      extrajudicial: juridico.extrajudicial,
      observacionesJuridicas: juridico.observacionesJuridicas,
      user_dir: "N/A",
      user_admin: "N/A",
      user_Juridico: "N/A",
      gastosLista: juridico.gastosLista,
      documentosLista: juridico.documentosLista,
      assetid: juridico.assetid,
      tareasLista: juridico.tareasLista,
      direccion: false,
      administracion: false,
      juridico: false,
      obvDir: "N/A",
      obvAdmin: "N/A",
      obvJuridicas: "N/A",
    };

    const datosNuevosAdeudos = {
      propertyId: propertyId,
      adeudoLista: adeudos.adeudoLista,
    };

    const datosNuevosVentas = {
      propertyId: propertyId,
      tipoVenta: "N/A",
      asesor: "N/A",
      comprador: "N/A",
      moneda: "M/A",
      precioInicial: ventas.precioInicial,
      precioFinal: ventas.precioFinal,
      formaPago: "N/A",
      estatusVenta: "N/A",
      fechaVenta: null,
      documentosVenta: [],

      compradorRef: null,
    };

    const datosNuevosPagos = {
      propertyId: propertyId,
      comprador: "N/A",
      montoTotal: pagos.montoTotal,
      montoTotalEmpresa: 0,
      pagosLista: [],
      calendarioLista: [],
      reembolsosLista: [],
      empresaLista: [],
    };

    const datosNuevosComisiones = {
      propertyId: propertyId,
      localizacion: "N/A",
      empresa: "N/A",
      contacto: "N/A",
      telefono: "N/A",
      valorEmpresa: "N/A",
      porcentajeComision: 0,
      montoTotal: 0,
      saldo: 0,
      empresaLista: [],
      juridicoLista: [],
      otrosLista: [],
      observacionesLista: [],
    };

    const datosNuevosPropertyDeuda = {
      propertyId: propertyId,
      contacto: "N/A",
      empresa: "N/A",
      direccion: "N/A",
      montoTotal: 0,
      deudaLista: [],
    };

    //AGREGAR JURIDICO CLONADO
    const responseCloneJuridico = await axios.post(
      "http://localhost:3000/api/juridicoData",
      datosNuevosJuridicos
    );
    //AGREGAR ADEUDOS CLONADO
    const responseCloneAdeudo = await axios.post(
      "http://localhost:3000/api/adeudosData",
      datosNuevosAdeudos
    );
    //AGREGAR VENTAS CLONADO
    const responseCloneVentas = await axios.post(
      "http://localhost:3000/api/ventasData",
      datosNuevosVentas
    );
    //AGREGAR PAGOS CLONADO
    const responseClonePagos = await axios.post(
      "http://localhost:3000/api/pagosData",
      datosNuevosPagos
    );
    //AGREGAR COMISIONES CLONADO
    const responseCloneComisiones = await axios.post(
      "http://localhost:3000/api/comisionesData",
      datosNuevosComisiones
    );
    //AGREGAR PROPERTYDEUDA CLONADO
    const responseClonePropertyDeuda = await axios.post(
      "http://localhost:3000/api/propertyDeudaData",
      datosNuevosPropertyDeuda
    );

    toast.success("PROPIEDAD DUPLICADA");
    setInmuebles([...inmuebles, responseNewInmueble]);
  };

  return (
    <>
      <button
        className="bg-blue-500 text-white p-2 rounded-md shadow-sm hover:bg-blue-600"
        onClick={() => {
          setduplicarPropiedad(true);
          handleDuplicar();
        }} // Usa setcancelarPropiedad tal como lo pediste
      >
        Duplicar
      </button>
    </>
  );
};

/**
 *-------------------------------------------------------------------------	DUPLICAR PROPIEDAD
 */
export async function btnDuplicar_click(event) {
  $w("#imgLoadDuplicar").show();
  $w("#txtDuplicar").show();

  let itemId = $w("#dynamicDataset").getCurrentItem()._id;

  let property = await wixData
    .query("inventario")
    .limit(1000)
    .eq("_id", itemId)
    .find();

  let propertyData = property.items[0];
  let propertyItems = property.items;
  let lastIndex = propertyItems[propertyItems.length - 1];
  console.log(propertyData);

  let juridico = await wixData
    .query("juridico")
    .eq("referencia", itemId)
    .find();

  let juridicoData = juridico.items[0];

  let pagos = await wixData
    .query("pagosyadeudos")
    .eq("referencia", itemId)
    .find();

  let pagosData = pagos.items[0];

  let deuda = await wixData.query("deuda").eq("referencia", itemId).find();

  let deudaData = deuda.items[0];

  /*  let calle = $w('#ipCalle').value;
      let calleFormatted = calle.formatted.toString();
      let latitude = calle.location.latitude;
      let longitude = calle.location.longitude;*/

  let calendarioPagos = pagosData.pagosLista;
  let tareasLista = juridicoData.tareasLista;
  let deudaLista = deudaData.listaDeuda;

  let propNumber = lastIndex.refnumber + 1;
  let toInsert = {
    refnumber: Number(propNumber),
    title: `Folio ${propNumber}`,
    referencia: propertyData.referencia,

    direccion: propertyData.direccion,
    direccionGoogle: propertyData.direccionGoogle,
    numInt: propertyData.numInt,
    numExt: propertyData.numExt,
    colonia: propertyData.colonia,
    codigoPostal: Number(propertyData.codigoPostal),
    precioInicial: Number(propertyData.precioInicial),

    estado: propertyData.estado,
    ciudad: propertyData.ciudad,
    terreno: Number(propertyData.terreno),
    construccion: Number(propertyData.construccion),
    recamaras: propertyData.recamaras,
    nivel: Number(propertyData.nivel),
    banos: propertyData.banos,

    estatusInmueble: propertyData.estatusInmueble,
    estatusJuridico: propertyData.estatusJuridico,
    estatusVenta: "NO DISPONIBLE",
    nombreAcreditado: propertyData.nombreAcreditado,
    contacto: propertyData.contacto,
    visitada: propertyData.visitada,
    formaPago: propertyData.formaPago,
    tipoInmueble: propertyData.tipoInmueble,
    tipoVenta: propertyData.tipoVenta,
    folioEmpresa: propertyData.folioEmpresa,
    empresa: propertyData.empresa,
    llaves: propertyData.llaves,
    foto: propertyData.foto,
    latitude: propertyData.latitude,
    longitude: propertyData.longitude,
    proceso: "SIN PROCESO",
  };
  await wixData.insert("inventario", toInsert).then((resProperty) => {
    console.log("propiedad agregada");
    console.log(resProperty);

    let toInsertJuridico = {
      title: "Folio " + propNumber.toString(),
      referencia: resProperty._id,

      encargadoProceso: juridicoData.encargadoProceso,
      numeroExpediente: juridicoData.numeroExpediente,
      numeroCesion: juridicoData.numeroCesion,
      nombreAcreditado: juridicoData.nombreAcreditado,
      proceso: juridicoData.proceso,
      datosRegistroGravamen: juridicoData.datosRegistroGravamen,
      extrajudicialDeudor: juridicoData.extrajudicialDeudor,
      tipoJuicio: juridicoData.tipoJuicio,
      jurisdiccion: juridicoData.jurisdiccion,
      expediente: juridicoData.expediente,
      juzgado: juridicoData.juzgado,
      estatusProcesal: juridicoData.estatusProcesal,

      gastosLista: juridicoData.gastosLista,
      obvservacionesLista: juridicoData.obvservacionesLista,
      documentosLista: juridicoData.documentosLista,
      tareasLista: juridicoData.tareasLista,
      tareasInactivasLista: juridicoData.tareasInactivasLista,

      fondoGastos: juridicoData.fondoGastos,

      obvDireccion: `Sin Comentarios`,
      obvAdmin: `Sin Comentarios`,
      obvJuridico: `Sin Comentarios`,

      userDir: `No definido`,
      userAdmin: `No definido`,
      userJuridico: `No definido`,

      direccion: false,
      administracion: false,
      juridico: false,
    };
    wixData.insert("juridico", toInsertJuridico).then((resJuridico) => {
      let toInsertVenta = {
        title: "Folio " + propNumber.toString(),
        referencia: resProperty._id,
        precioInicial: Number(propertyData.precioInicial),
        documentosVeta: [],
        pagoEstatusProcesal: [],
      };

      wixData.insert("venta", toInsertVenta).then((resVenta) => {
        let toInsertPagosyAdeudos = {
          title: "Folio " + propNumber.toString(),
          referencia: resProperty._id,
          adeudosLista: pagosData.adeudosLista,
          calendarioLista: [],
          calendarioPagadoLista: [],
          observacionesLista: [],
          pagosLista: [],
          empresaLista: [],
          reembolsoLista: [],
        };

        wixData
          .insert("pagosyadeudos", toInsertPagosyAdeudos)
          .then((resPagosyAdeudos) => {
            let toinsertComisiones = {
              title: "Folio " + propNumber.toString(),
              referencia: resProperty._id,
              listaJuridico: juridicoData.gastosLista,
              listaEmpresa: [],
              listaObservaciones: [],
              listaOtros: [],
            };

            wixData
              .insert("comisiones", toinsertComisiones)
              .then((resComisiones) => {
                let toinsertDeuda = {
                  title: "Folio " + propNumber.toString(),
                  referencia: resProperty._id,
                  listaDeuda: [],
                };

                wixData.insert("deuda", toinsertDeuda).then((resDeuda) => {
                  wixData
                    .get("inventario", resProperty._id)
                    .then((newPropertyData) => {
                      newPropertyData.juridicoDb = resJuridico._id;
                      newPropertyData.ventaDb = resVenta._id;
                      newPropertyData.pagosyadeudosDb = resPagosyAdeudos._id;
                      newPropertyData.comisionesDb = resComisiones._id;
                      newPropertyData.deudaDb = resDeuda._id;

                      wixData.update("inventario", newPropertyData).then(() => {
                        $w("#imgLoadDuplicar").hide();
                        $w("#btnDuplicar").disable();
                        $w("#txtDuplicar").text = "Propiedad Duplicada";
                        $w("#txtDuplicar")
                          .show()
                          .then(() => {
                            setTimeout(() => {
                              wixLocation.to("/inventario");
                            }, 1500);
                          });
                      }); // closes update inventario
                    });
                });
              });
          });
      });
    }); // closes then() de insert juridico
  }); // closes then() de insert propiedades
}
