import React, { useEffect, useState } from "react";
import { RiCloseCircleFill } from "react-icons/ri";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { Rings } from "react-loader-spinner";
import moment from "moment";
import Swal from "sweetalert2";
//import pdfMake from "pdfmake/build/pdfmake";
//import pdfFonts from "pdfmake/build/vfs_fonts";
//pdfMake.vfs = pdfFonts.pdfMake.vfs;
import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { convertNumberToText } from "../../constant/numberLetters";

export const ReciboPagos = ({ product, reciboInfo, setCurrentStep }) => {
  console.log("reciboInfo", reciboInfo);
  const isDisabled = true;

  const [defaultFile, setDefaultFile] = useState("/logoLogitica.webp");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const handlePrecioChange = (event) => {
    const inputPrecio = event.target.value.replace(/[^0-9]/g, "");
    const formattedPrecio = `$${inputPrecio.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ","
    )}`;
    setValue("montoTotal", inputPrecio);
  };

  const handleGeneratePDF = (imageUrl) => {
    console.log("generando PDF");
    // Obtén la URL de la imagen
    //const imageUrl = `${window.location.origin}/logoLogitica.webp`;
    //const imageUrl = `https://images.pexels.com/photos/1337380/pexels-photo-1337380.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`;
    const docDefinition = {
      pageSize: "LETTER",
      content: [
        {
          image: imageUrl, // Incluye la imagen
          width: 100, // Ancho de la imagen en el PDF (ajusta según sea necesario)
          margin: [0, 20, 0, 10], // Márgenes [izquierda, arriba, derecha, abajo]
        },
        { text: "RECIBO DE PAGO PROVISIONAL", style: "header" },
        {
          text: `\nBUENO POR $${reciboInfo.cantidadPago.toLocaleString(
            "es-MX"
          )} PESOS.\n`,
        },
        {
          text: `Recibimos de la Sra. ${
            product.compradorRef.nombreCompleto
          } la cantidad de $${reciboInfo.cantidadPago.toLocaleString(
            "es-MX"
          )} (son ${
            reciboInfo.cantidadPago
          } pesos 00/100 M.N.) a través de efectivo/transferencia por concepto de ${
            reciboInfo.tipoPago
          }.\n`,
        },
        { text: `Ubicación del inmueble: ${product.direccion}\n` },
        {
          text: `El precio establecido de venta es por la cantidad de $${product.precio.toLocaleString(
            "es-MX"
          )} pesos.\n`,
        },
        {
          text: `Condiciones de entrega: La propiedad se entregará en las condiciones actuales haciéndose el vendedor/comprador responsable del proceso jurídico. El comprador/vendedor correrá con los adeudos de servicios (agua, predial, luz, y gas) así como de todos los que se generen para la protocolización definitiva. En caso de que el comprador cancelara habrá una penalización del ${reciboInfo.penalizacion}% sobre la cantidad que ampara el presente recibo.\n`,
        },
        { text: `Vendedor/Intermediario: ${product.empresa}\n` },
        { text: `Fecha: ${moment().format("LL")}\n` },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
      },
    };

    pdfMake.createPdf(docDefinition).download(`recibo_pago_provisional.pdf`);
  };

  const handleGeneratePDF1 = (imageUrl) => {
    const docDefinition = {
      pageSize: "LETTER",
      content: [
        {
          image: imageUrl, // Incluye la imagen
          width: 100, // Ancho de la imagen en el PDF (ajusta según sea necesario)
          margin: [0, 20, 0, 10], // Márgenes [izquierda, arriba, derecha, abajo]
        },
        {
          text: "RECIBO DE PAGO PROVISIONAL",
          style: "header",
          alignment: "center",
        },
        {
          text: `\nBUENO POR $${reciboInfo.cantidadPago.toLocaleString(
            "es-MX"
          )} PESOS.\n`,
          style: "content",
        },
        {
          text: `RECIBIMOS DE LA SRA. ${
            product.compradorRef.nombreCompleto
          } LA CANTIDAD DE $${reciboInfo.cantidadPago.toLocaleString(
            "es-MX"
          )} (SON ${convertNumberToText(
            String(reciboInfo.cantidadPago)
          )} PESOS 00/100 M.N.) A TRAVÉS DE EFECTIVO/TRANSFERENCIA POR CONCEPTO DE ${
            reciboInfo.tipoPago
          }.\n`,
          style: "content",
        },
        {
          text: `UBICADO EN: ${product.direccion}\n`,
          style: "content",
        },
        {
          text: `EN EL ENTENDIDO DE QUE LA SRA. ${product.compradorRef.nombreCompleto} SABE Y LE CONSTAN LAS CONDICIONES FÍSICAS Y LEGALES DEL INMUEBLE MATERIA DE LA PRESENTE ASÍ COMO LOS TIEMPOS Y EL PROCEDIMIENTO ESTABLECIDOS PARA LA COMPRA DEFINITIVA DEL MISMO.\n`,
          style: "content",
        },
        {
          text: `EL PRECIO ESTABLECIDO DE VENTA ES POR LA CANTIDAD DE $${product.precio.toLocaleString(
            "es-MX"
          )} PESOS. (SON ${convertNumberToText(
            String(product.precio)
          )} PESOS 00/100 M.N.)\n`,
          style: "content",
        },
        {
          text: `CONDICIONES DE ENTREGA: LA PROPIEDAD SE ENTREGARÁ EN LAS CONDICIONES ACTUALES HACIÉNDOSE EL VENDEDOR/COMPRADOR RESPONSABLE DEL PROCESO JURÍDICO. EL COMPRADOR/VENDEDOR CORRERÁ CON LOS ADEUDOS DE SERVICIOS (AGUA, PREDIAL, LUZ Y GAS) ASÍ COMO DE TODOS LOS QUE SE GENEREN PARA LA PROTOCOLIZACIÓN DEFINITIVA. EN CASO DE QUE EL COMPRADOR CANCELARA HABRÁ UNA PENALIZACIÓN DEL ${reciboInfo.penalizacion}% SOBRE LA CANTIDAD QUE AMPARA EL PRESENTE RECIBO.\n`,
          style: "content",
        },
        {
          canvas: [
            { type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 },
          ],
          margin: [0, 60, 0, 5],
        },
        {
          text: `\nVENDEDOR/INTERMEDIARIO:\nLOGISTICA INMOBILIARIA SVG DE CD JUAREZ\n`,
          style: "footer",
        },
        {
          text: `CD JUAREZ CHIHUAHUA A ${moment().format("LL")}\n`,
          style: "footer",
        },
      ],
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          margin: [0, 0, 0, 20],
        },
        content: {
          fontSize: 12,
          margin: [0, 0, 0, 10],
        },
        footer: {
          fontSize: 10,
          alignment: "center",
          margin: [0, 20, 0, 0],
        },
      },
    };

    pdfMake.createPdf(docDefinition).download(`recibo_pago_provisional_${product.compradorRef.nombreCompleto}.pdf`);
  };

  const getImageDataUrl = async (imageUrl) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const getImageDataUrl1 = (filePath) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        const reader = new FileReader();
        reader.onloadend = function () {
          resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(xhr.response);
      };
      xhr.onerror = reject;
      xhr.open("GET", filePath);
      xhr.responseType = "blob";
      xhr.send();
    });
  };
  const getImageDataUrl2 = (filePath) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        const blob = xhr.response;
        const url = URL.createObjectURL(blob);
        resolve(url);
      };
      xhr.onerror = reject;
      xhr.open("GET", filePath);
      xhr.responseType = "blob";
      xhr.send();
    });
  };

  const getImageDataUrl3 = async (imageUrl) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const onSubmit = async (data) => {
    console.log("formData", data);
    const imageUrlogo = `https://asset.cloudinary.com/ddjajfmtw/b5718475b03fabc01d68599c587b3017`;
    const logUrl = "https://res.cloudinary.com/ddjajfmtw/image/upload/fl_preserve_transparency/v1720030602/sdqw8ktg6i1gvdbbzdfe.jpg?_s=public-apps"
    const imageUrl =
      "https://images.pexels.com/photos/1337380/pexels-photo-1337380.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
     
    try {
      const dataUrl = await getImageDataUrl(logUrl);
      handleGeneratePDF1(dataUrl);
    } catch (error) {
      console.error("Error al obtener el dataURL de la imagen:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="form-container mt-10 flex flex-col items-center bg-[#f3f4f6] rounded-md"
      >
        <div className="form-header bg-black text-white w-[1000px] h-10 p-2 rounded-tl-md rounded-tr-md flex items-center justify-between">
          <h1> GENERAR COMPROBANTE:</h1>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setCurrentStep(0);
              }}
              className=" bg-red-500 rounded-lg px-4"
            >
              CANCELAR
            </button>
          </div>
        </div>
        {/* PRIMERA COLUMNA */}
        {defaultFile && ( // Renderizar la imagen solo si defaultFile es válido
          <img
            className="w-[80px] m-5 shadow-lg object-cover rounded-md"
            src={defaultFile}
            alt=""
          />
        )}
        <div className="flex items-center justify-between w-[900px] ">
          <div className="flex flex-col mt-10  w-full p-5">
            <label>NOMBRE COMPRADOR</label>
            <input
              defaultValue={product.compradorRef.nombreCompleto}
              //   onChange={(e) => {
              //     handlePrecioChange(e);
              //   }}
              type="text"
              className={`border p-2 rounded-md shadow-sm ${
                isDisabled ? "bg-gray-200" : ""
              }`}
              disabled={isDisabled}
              // {...register("comprador", { required: true })}
            />
          </div>
          <div className="flex flex-col mt-10  w-full p-5">
            <label>MONTO TOTAL</label>
            <input
              defaultValue={`$${product.precio.toLocaleString("es-MX")}`}
              onChange={handlePrecioChange}
              type="text"
              className={`border p-2 rounded-md shadow-sm ${
                isDisabled ? "bg-gray-200" : ""
              }`}
              disabled={isDisabled}
              //  {...register("montoTotal", { required: true })}
            />
          </div>
          <div className="flex flex-col mt-10  w-full p-5">
            <label>PORCENTAJE PENALIZACION</label>
            <input
              //  defaultValue={comentarioValue}
              //   onChange={(e) => {
              //     handlePrecioChange(e);
              //   }}
              type="text"
              className="border p-2 rounded-md shadow-sm"
              {...register("penalizacion", { required: true })}
            />
          </div>
        </div>
        {/* SEGUNDA COLUMNA */}
        <div className="flex w-[900px]">
          <div className="flex flex-col mt-5 w-full p-5">
            <label>CANTIDAD</label>
            <input
              defaultValue={`$${reciboInfo.cantidadPago.toLocaleString(
                "es-MX"
              )}`}
              //   onChange={(e) => {
              //     handlePrecioChange(e);
              //   }}
              type="text"
              className={`border p-2 rounded-md shadow-sm ${
                isDisabled ? "bg-gray-200" : ""
              }`}
              disabled={isDisabled}
              // {...register("cantidad", { required: true })}
            />
          </div>
          <div className="flex flex-col mt-5 w-full p-5">
            <label>CONCEPTO</label>
            <input
              defaultValue={reciboInfo.tipoPago}
              //   onChange={(e) => {
              //     handlePrecioChange(e);
              //   }}
              type="text"
              className={`border p-2 rounded-md shadow-sm ${
                isDisabled ? "bg-gray-200" : ""
              }`}
              disabled={isDisabled}
              // {...register("concepto", { required: true })}
            />
          </div>
          <div className="flex flex-col mt-5 w-full p-5">
            <label>TIPO DE VENTA</label>
            <input
              //  defaultValue={comentarioValue}
              //   onChange={(e) => {
              //     handlePrecioChange(e);
              //   }}
              type="text"
              className="border p-2 rounded-md shadow-sm"
              {...register("tipoVenta", { required: true })}
            />
          </div>
          <div className="flex flex-col mt-5 w-full p-5">
            <label>TRANSACCION</label>
            <input
              defaultValue={reciboInfo.transaccion}
              //   onChange={(e) => {
              //     handlePrecioChange(e);
              //   }}
              type="text"
              className={`border p-2 rounded-md shadow-sm ${
                isDisabled ? "bg-gray-200" : ""
              }`}
              disabled={isDisabled}
              // {...register("transaccion", { required: true })}
            />
          </div>
        </div>
        {/* TERCERA COLUMNA */}
        <div className="flex items-center justify-between w-[900px]">
          <div className="flex flex-col mt-5 w-full p-5">
            <label>C/V PROCESO JURIDICO</label>
            <select
              // onChange={(e) => (tipoVentaRef.current = e.target.value)}
              className="border p-2 rounded-md shadow-sm"
              {...register("procesoJuridico", { required: true })}
            >
              <option value="COMPRADOR">COMPRADOR</option>
              <option value="VENDEDOR">VENDEDOR</option>
            </select>
          </div>
          <div className="flex flex-col mt-5 w-full p-5">
            <label>C/V PAGO DE SERVICIOS</label>
            <select
              // onChange={(e) => (tipoVentaRef.current = e.target.value)}
              className="border p-2 rounded-md shadow-sm"
              {...register("pagoServicios", { required: true })}
            >
              <option value="COMPRADOR">COMPRADOR</option>
              <option value="VENDEDOR">VENDEDOR</option>
            </select>
          </div>

          <div className="flex flex-col mt-5 w-full p-5">
            <label>ADMINISTRADORA</label>
            <input
              defaultValue={product.empresa}
              //   onChange={(e) => {
              //     handlePrecioChange(e);
              //   }}
              type="text"
              className={`border p-2 rounded-md shadow-sm ${
                isDisabled ? "bg-gray-200" : ""
              }`}
              disabled={isDisabled}
              //  {...register("administradora", { required: true })}
            />
          </div>
        </div>
        {/* CUARTA COLUMNA */}
        <div className="flex items-center justify-between w-[900px]">
          <div className="flex flex-col mt-10  w-full p-5">
            <label>DIRECCION</label>
            <input
              defaultValue={product.direccion}
              //   onChange={(e) => {
              //     handlePrecioChange(e);
              //   }}
              type="text"
              className={`border p-2 rounded-md shadow-sm ${
                isDisabled ? "bg-gray-200" : ""
              }`}
              disabled={isDisabled}
              //  {...register("direccion", { required: true })}
            />
          </div>
          <button
            type="submit"
            className="mt-10  p-2 bg-black text-white rounded-lg shadow-xl"
          >
            IMPRIMIR
          </button>
        </div>
      </div>
    </form>
  );
};
