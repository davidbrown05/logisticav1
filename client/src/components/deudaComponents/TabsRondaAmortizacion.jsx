import React, { useState, useEffect, useContext, useRef } from "react";
import { FaPlus } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import moment from "moment";
import { PartnersContext } from "../../context/PartnersContext";
import { PiWarningFill } from "react-icons/pi";
import Swal from "sweetalert2";
import axios from "axios";
import { Rings } from "react-loader-spinner";
import { toast } from "react-toastify";
import { format, addMonths, differenceInDays } from "date-fns";
import { TablaPagoMensual } from "./TablaPagoMensual";
import { TablaPagoUnico } from "./TablaPagoUnico";

export const TabsRondaAmortizacion = ({
  partnerInfo,
  partners,
  setPartners,
  corridaIndex,
  setSelectedTab,
  setpartnerInfo,
  setloaderContext,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  console.log("nuevaRonda", partnerInfo);
  console.log("corridaIndex", corridaIndex);
  const [partnerEdit, setpartnerEdit] = useState(partnerInfo);
  console.log("corridas", partnerInfo.corridas);
  const [guardarButton, setguardarButton] = useState(false);
  const [proxPagos, setProxPagos] = useState([]);
  const [suertePrincipal, setsuertePrincipal] = useState(
    partnerEdit.suertePrincipal
  );
  const firstBtnRef = useRef();

  const [selectedTablaTab, setselectedTablaTab] = useState(0);

  const [porcentajeUtilidad, setporcentajeUtilidad] = useState(0);

  const [prestamo, setPrestamo] = useState({
    monto: suertePrincipal,
    tasaInteres: 20,
    plazo: 5,
    parcialidades: 5,
    fechaInicial: moment().format("YYYY-MM-DD"),
  });
  const [tabla, setTabla] = useState([]);
  const [checPartners, setchecPartners] = useState(false);
  const [pagosAdicionales, setPagosAdicionales] = useState({});

  // Función para formatear números con comas y símbolo de peso
  const formatCurrency = (num) => {
    return `$${num.toLocaleString()}`;
  };

  // Función para formatear la tasa de interés con el símbolo de porcentaje
  const formatPercentage = (num) => {
    return `%${num}`;
  };

  // Función para limpiar el formato de moneda y convertir el valor a número
  const parseCurrency = (formattedValue) => {
    return Number(formattedValue.replace(/[^\d.-]/g, ""));
  };

  // Función para limpiar el formato de porcentaje
  const parsePercentage = (formattedValue) => {
    return Number(formattedValue.replace(/[^\d.-]/g, ""));
  };

  // Actualizar el estado del préstamo con el valor numérico
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "monto") {
      const numericValue = parseCurrency(value);
      setPrestamo((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else if (name === "tasaInteres") {
      const numericValue = parsePercentage(value);
      setPrestamo((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setPrestamo((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const dataTabs = [
    {
      label: "TABLA AMORTIZACION CON PAGO A CAPITAL MENSUAL",
      value: "TABLA AMORTIZACION CON PAGO A CAPITAL MENSUAL",
    },
    {
      label: "TABLA AMORTIZACION CON 1 SOLO PAGO DE CAPITAL AL FINALIZAR",
      value: "TABLA AMORTIZACION CON 1 SOLO PAGO DE CAPITAL AL FINALIZAR",
    },
  ];

  const handleTabClick = (index) => {
    setselectedTablaTab(index);
  };

  const onSubmit = handleSubmit((data) => {
    if (checPartners) {
      setTimeout(() => {
        setpartnerInfo((prevPartnerInfo) => ({
          ...prevPartnerInfo, // Mantenemos todos los valores actuales del partnerInfo
          pagosFinales: tabla, // Actualizamos solo el campo pagosFinales
        }));
      }, 500);
    }
  });

  useEffect(() => {
    if (checPartners) {
      console.log("partnerInfoActualizado", partnerInfo);
      handlePartner(partnerInfo);
    }
  }, [partnerInfo]);

  useEffect(() => {
    calcularTabla();
  }, [prestamo, pagosAdicionales]);

  const handlePartner = async (data) => {
    const result = await Swal.fire({
      title: `FINALIZAR RONDAS DE ${data.partner}?`,
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, ACTUALIZAR",
    });

    if (result.isConfirmed) {
      setloaderContext(true);
      try {
        const response = await axios.put(
          `http://localhost:3000/api/partners/${partnerInfo._id}`,
          data
        );

        const updatedPartner = response.data;
        const updatedPartners = partners.map((partner) =>
          partner._id === updatedPartner._id ? updatedPartner : partner
        );

        setPartners(updatedPartners);
        // setPartners([...partners, responseUpdate]);
        setloaderContext(false);
        toast.success("RONDAS FINALIZADAS");
        setSelectedTab(1);
      } catch (error) {
        setloaderContext(false);
        setchecPartners(false);
        console.log(error);
        toast.error(error.message);
      }
    } else {
      setchecPartners(false);
    }
  };

  const calcularTabla = () => {
    const { monto, tasaInteres, plazo, parcialidades, fechaInicial } = prestamo;
    const pagos = [];
    let saldoInicial = monto;
    let fechaAnterior = new Date(fechaInicial);
    const pagoCapitalPorParcialidad = monto / parcialidades;
    // La tasa de interés se divide por 100 para convertirla de porcentaje a decimal,
    // luego se divide por 10 para obtener la tasa mensual (asumiendo que es anual)

    for (let mes = 1; mes <= plazo; mes++) {
      const fechaPago = addMonths(new Date(fechaInicial), mes);
      const dias = differenceInDays(fechaPago, fechaAnterior);
      const interes = (saldoInicial * (tasaInteres / 100)) / 10;
      let capital = pagoCapitalPorParcialidad;

      // Aplicar pago adicional si existe
      const pagoAdicional = pagosAdicionales[mes] || 0;
      capital += pagoAdicional;

      // Asegurarse de que el capital no exceda el saldo inicial
      capital = Math.min(capital, saldoInicial);

      const pagoTotal = capital + interes;
      const saldoFinal = saldoInicial - capital;

      pagos.push({
        numero: mes,
        fecha: format(fechaPago, "dd/MM/yyyy"),
        dias,
        saldoInicial: saldoInicial.toFixed(2),
        capital: capital.toFixed(2),
        interes: interes.toFixed(2),
        pagoTotal: pagoTotal.toFixed(2),
        saldoFinal: saldoFinal.toFixed(2),
        pagoAdicional: pagoAdicional.toFixed(2),
      });

      saldoInicial = saldoFinal;
      fechaAnterior = fechaPago;

      // Si el saldo llega a cero, terminar la tabla
      if (saldoFinal <= 0) break;
    }

    setTabla(pagos);
  };

  // Función para renderizar el contenido de acuerdo al paso actual
  const renderStepContent = () => {
    switch (selectedTablaTab) {
      case 0:
        return (
          <TablaPagoMensual
            partnerInfo={partnerInfo}
            partners={partners}
            setPartners={setPartners}
            corridaIndex={corridaIndex}
            setSelectedTab={setSelectedTab}
            setpartnerInfo={setpartnerInfo}
            setloaderContext={setloaderContext}
          />
        );
      case 1:
        return (
          <TablaPagoUnico
            partnerInfo={partnerInfo}
            partners={partners}
            setPartners={setPartners}
            corridaIndex={corridaIndex}
            setSelectedTab={setSelectedTab}
            setpartnerInfo={setpartnerInfo}
            setloaderContext={setloaderContext}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* EMPIEZA EL CODIGO DE DISEÑO PARA TABS */}
      <div className="flex p-3 justify-between items-center gap-x-2 bg-gray-200 overflow-x-auto ">
        {dataTabs.map((item, index) => (
          <button
            ref={index === selectedTablaTab ? firstBtnRef : null}
            key={index}
            onClick={() => handleTabClick(index)}
            className={`outline-none w-full p-2 hover:bg-gray-300 hover:text-black rounded-xl text-center  ${
              selectedTablaTab === index ? "  bg-black text-white" : ""
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      {/* TERMINA DISEÑO DE TABS */}
      {/* EMPIEZA DISEÑO DE STEPPER */}
      <div className="flex flex-col items-center gap-10  mt-1">
        {/* Mostrar contenido dinámico según el paso actual */}
        <div className="step-content  p-4 mt-1">{renderStepContent()}</div>
      </div>
    </>
  );
};
