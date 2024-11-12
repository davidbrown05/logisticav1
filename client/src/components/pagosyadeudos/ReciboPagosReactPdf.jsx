import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image, Font } from '@react-pdf/renderer';
import moment from "moment";
import 'moment/locale/es';
import { convertNumberToText } from "../../constant/numberLetters";

moment.locale('es');

// Registra la fuente Roboto
Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf'
});

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    fontSize: 12,
    padding: 30,
  },
  header: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  content: {
    marginBottom: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
  },
  image: {
    width: 100,
    marginBottom: 10,
  },
});

// Componente del PDF
const ReciboPDF = ({ product, reciboInfo, formData }) => (
  <Document>
    <Page size="LETTER" style={styles.page}>
      <Image
        style={styles.image}
        src="https://res.cloudinary.com/ddjajfmtw/image/upload/fl_preserve_transparency/v1720030602/sdqw8ktg6i1gvdbbzdfe.jpg"
      />
      <Text style={styles.header}>RECIBO DE PAGO PROVISIONAL</Text>
      <Text style={styles.content}>BUENO POR ${reciboInfo.cantidadPago.toLocaleString('es-MX')} PESOS</Text>
      <Text style={styles.content}>
        RECIBIMOS DE LA SRA. {product.compradorRef.nombreCompleto} LA CANTIDAD DE ${reciboInfo.cantidadPago.toLocaleString('es-MX')} 
        (SON {convertNumberToText(String(reciboInfo.cantidadPago))} PESOS 00/100 M.N.) A TRAVÉS DE {formData.transaccion} POR CONCEPTO DE {reciboInfo.tipoPago}.
      </Text>
      <Text style={styles.content}>UBICADO EN: {product.direccion}</Text>
      <Text style={styles.content}>
        EN EL ENTENDIDO DE QUE LA SRA. {product.compradorRef.nombreCompleto} SABE Y LE CONSTAN LAS CONDICIONES 
        FÍSICAS Y LEGALES DEL INMUEBLE MATERIA DE LA PRESENTE ASÍ COMO LOS TIEMPOS Y EL PROCEDIMIENTO 
        ESTABLECIDOS PARA LA COMPRA DEFINITIVA DEL MISMO.
      </Text>
      <Text style={styles.content}>
        EL PRECIO ESTABLECIDO DE VENTA ES POR LA CANTIDAD DE ${product.precio.toLocaleString('es-MX')} PESOS. 
        (SON {convertNumberToText(String(product.precio))} PESOS 00/100 M.N.)
      </Text>
      <Text style={styles.content}>
        CONDICIONES DE ENTREGA: LA PROPIEDAD SE ENTREGARÁ EN LAS CONDICIONES ACTUALES HACIÉNDOSE EL {formData.procesoJuridico} 
        RESPONSABLE DEL PROCESO JURÍDICO. EL {formData.pagoServicios} CORRERÁ CON LOS ADEUDOS DE SERVICIOS 
        (AGUA, PREDIAL, LUZ Y GAS) ASÍ COMO DE TODOS LOS QUE SE GENEREN PARA LA PROTOCOLIZACIÓN DEFINITIVA. 
        EN CASO DE QUE EL COMPRADOR CANCELARA HABRÁ UNA PENALIZACIÓN DEL {formData.penalizacion}% SOBRE LA CANTIDAD QUE AMPARA EL PRESENTE RECIBO.
      </Text>
      <Text style={styles.footer}>
        VENDEDOR/INTERMEDIARIO: LOGISTICA INMOBILIARIA SVG DE CD JUAREZ
      </Text>
      <Text style={styles.footer}>
        CD JUAREZ CHIHUAHUA A {moment().format('LL')}
      </Text>
    </Page>
  </Document>
);

export const ReciboPagosReactPdf = ({ product, reciboInfo, setCurrentStep }) => {
    const [defaultFile] = useState("/logoLogitica.webp");
    const isDisabled = true;
  
    const {
      register,
      handleSubmit,
      setValue,
      watch,
    } = useForm();
  
    const handlePrecioChange = (event) => {
      const inputPrecio = event.target.value.replace(/[^0-9]/g, "");
      const formattedPrecio = `$${inputPrecio.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
      setValue("montoTotal", formattedPrecio);
    };
  
    const onSubmit = (data) => {
      console.log("formData", data);
      // Los datos del formulario se pasan al componente PDF a través de PDFDownloadLink
    };
  
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-container mt-10 flex flex-col items-center bg-[#f3f4f6] rounded-md">
          <div className="form-header bg-black text-white w-[1000px] h-10 p-2 rounded-tl-md rounded-tr-md flex items-center justify-between">
            <h1>GENERAR COMPROBANTE:</h1>
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentStep(0)}
                className="bg-red-500 rounded-lg px-4"
                type="button"
              >
                CANCELAR
              </button>
            </div>
          </div>
          {defaultFile && (
            <img
              className="w-[80px] m-5 shadow-lg object-cover rounded-md"
              src={defaultFile}
              alt="Logo"
            />
          )}
          <div className="flex items-center justify-between w-[900px]">
            <div className="flex flex-col mt-10 w-full p-5">
              <label>NOMBRE COMPRADOR</label>
              <input
                defaultValue={product.compradorRef.nombreCompleto}
                type="text"
                className={`border p-2 rounded-md shadow-sm ${isDisabled ? "bg-gray-200" : ""}`}
                disabled={isDisabled}
              />
            </div>
            <div className="flex flex-col mt-10 w-full p-5">
              <label>MONTO TOTAL</label>
              <input
                defaultValue={`$${product.precio.toLocaleString("es-MX")}`}
                onChange={handlePrecioChange}
                type="text"
                className={`border p-2 rounded-md shadow-sm ${isDisabled ? "bg-gray-200" : ""}`}
                disabled={isDisabled}
              />
            </div>
            <div className="flex flex-col mt-10 w-full p-5">
              <label>PORCENTAJE PENALIZACION</label>
              <input
                type="text"
                className="border p-2 rounded-md shadow-sm"
                {...register("penalizacion", { required: true })}
              />
            </div>
          </div>
          <div className="flex w-[900px]">
            <div className="flex flex-col mt-5 w-full p-5">
              <label>CANTIDAD</label>
              <input
                defaultValue={`$${reciboInfo.cantidadPago.toLocaleString("es-MX")}`}
                type="text"
                className={`border p-2 rounded-md shadow-sm ${isDisabled ? "bg-gray-200" : ""}`}
                disabled={isDisabled}
              />
            </div>
            <div className="flex flex-col mt-5 w-full p-5">
              <label>CONCEPTO</label>
              <input
                defaultValue={reciboInfo.tipoPago}
                type="text"
                className={`border p-2 rounded-md shadow-sm ${isDisabled ? "bg-gray-200" : ""}`}
                disabled={isDisabled}
              />
            </div>
            <div className="flex flex-col mt-5 w-full p-5">
              <label>TIPO DE VENTA</label>
              <input
                type="text"
                className="border p-2 rounded-md shadow-sm"
                {...register("tipoVenta", { required: true })}
              />
            </div>
            <div className="flex flex-col mt-5 w-full p-5">
              <label>TRANSACCION</label>
              <input
                defaultValue={reciboInfo.transaccion}
                type="text"
                className={`border p-2 rounded-md shadow-sm ${isDisabled ? "bg-gray-200" : ""}`}
                disabled={isDisabled}
              />
            </div>
          </div>
          <div className="flex items-center justify-between w-[900px]">
            <div className="flex flex-col mt-5 w-full p-5">
              <label>C/V PROCESO JURIDICO</label>
              <select
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
                type="text"
                className={`border p-2 rounded-md shadow-sm ${isDisabled ? "bg-gray-200" : ""}`}
                disabled={isDisabled}
              />
            </div>
          </div>
          <div className="flex items-center justify-between w-[900px]">
            <div className="flex flex-col mt-10 w-full p-5">
              <label>DIRECCION</label>
              <input
                defaultValue={product.direccion}
                type="text"
                className={`border p-2 rounded-md shadow-sm ${isDisabled ? "bg-gray-200" : ""}`}
                disabled={isDisabled}
              />
            </div>
            <PDFDownloadLink
              document={<ReciboPDF product={product} reciboInfo={reciboInfo} formData={watch()} />}
              fileName={`recibo_pago_provisional_${product.compradorRef.nombreCompleto}.pdf`}
              className="mt-10 p-2 bg-black text-white rounded-lg shadow-xl"
            >
              {({ blob, url, loading, error }) =>
                loading ? 'Generando PDF...' : 'IMPRIMIR'
              }
            </PDFDownloadLink>
          </div>
        </div>
      </form>
    );
  };
