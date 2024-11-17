import React, { useState, useEffect, useContext } from "react";
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

export const TablaPagoMensual = ({
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
  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;

  //   if (name === "monto") {
  //     const numericValue = parseCurrency(value);
  //     setPrestamo((prev) => ({
  //       ...prev,
  //       [name]: numericValue,
  //     }));
  //   } else if (name === "tasaInteres") {
  //     const numericValue = parsePercentage(value);
  //     setPrestamo((prev) => ({
  //       ...prev,
  //       [name]: numericValue,
  //     }));
  //   } else {
  //     setPrestamo((prev) => ({
  //       ...prev,
  //       [name]: value,
  //     }));
  //   }
  // };
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
    } else if (name === "plazo") {
      // Sincroniza "parcialidades" con "plazo"
      setPrestamo((prev) => ({
        ...prev,
        [name]: parseInt(value, 10) || 0,
        parcialidades: parseInt(value, 10) || 0,
      }));
    } else {
      setPrestamo((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const onSubmit = handleSubmit((data) => {
    setchecPartners(true);

    setTimeout(() => {
      setpartnerInfo((prevPartnerInfo) => ({
        ...prevPartnerInfo, // Mantenemos todos los valores actuales del partnerInfo
        tipoTabla:"pagomensual",
        pagosFinales: tabla, // Actualizamos solo el campo pagosFinales
      }));
    }, 500);
  });

  useEffect(() => {
    if (checPartners) {
      console.log("partnerInfoActualizado", partnerInfo);
      handlePartner(partnerInfo);
    }
  }, [partnerInfo]);

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
        setSelectedTab(0);
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

  useEffect(() => {
    calcularTabla();
  }, [prestamo, pagosAdicionales]);

  const handlePagoAdicional = (mes, valor) => {
    setPagosAdicionales((prev) => ({
      ...prev,
      [mes]: parseFloat(valor) || 0,
    }));
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
        _id: String(Math.random()).replace(".", ""),
        numero: mes,
        fecha: format(fechaPago, "dd/MM/yyyy"),
        fechaParaPago: fechaPago.toISOString(),
        dias,
        saldoInicial: Number(saldoInicial.toFixed(2)),
        capital: Number(capital.toFixed(2)),
        interes: Number(interes.toFixed(2)),
        pagoTotal: Number(pagoTotal.toFixed(2)),
        saldoFinal: Number(saldoFinal.toFixed(2)),
        pagoAdicional: Number(pagoAdicional.toFixed(2)),
        tipoTabla: "pagomensual",
        fechaPagoRealizado: "",
        pagoAdicionalArray: [],
        abonos: [],
        status: "false",
        check: "false",
      });

      saldoInicial = saldoFinal;
      fechaAnterior = fechaPago;

      // Si el saldo llega a cero, terminar la tabla
      if (saldoFinal <= 0) break;
    }

    setTabla(pagos);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tabla Retorno de Inversión</h1>
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col">
            <label className="font-semibold">NOMBRE DEL PARTNER</label>
            <input
              defaultValue={`${partnerEdit.partner}`}
              type="text"
              className={`border p-2 rounded-md shadow-sm `}
              {...register("partner", { required: true })}
            />
          </div>
          <div>
            <label
              htmlFor="monto"
              className="block text-sm font-medium text-gray-700"
            >
              Monto del préstamo
            </label>
            <input
              type="text"
              id="monto"
              name="monto"
              value={formatCurrency(prestamo.monto)}
              onChange={handleInputChange}
              className="border p-2 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label
              htmlFor="tasaInteres"
              className="block text-sm font-medium text-gray-700"
            >
              Tasa de interés(%)
            </label>
            <input
              type="text"
              id="tasaInteres"
              name="tasaInteres"
              value={formatPercentage(prestamo.tasaInteres)}
              onChange={handleInputChange}
              className="border p-2 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label
              htmlFor="plazo"
              className="block text-sm font-medium text-gray-700"
            >
              Plazo (meses)
            </label>
            <input
              type="number"
              id="plazo"
              name="plazo"
              value={prestamo.plazo}
              onChange={handleInputChange}
              className={`border p-2 rounded-md shadow-sm `}
            />
          </div>
          <div>
            <label
              htmlFor="parcialidades"
              className="block text-sm font-medium text-gray-700"
            >
              Número de parcialidades de capital
            </label>
            <input
              type="number"
              id="parcialidades"
              name="parcialidades"
              value={prestamo.parcialidades}
              onChange={handleInputChange}
              className={`border p-2 rounded-md shadow-sm `}
              disabled={true}
            />
          </div>
          <div>
            <label
              htmlFor="fechaInicial"
              className="block text-sm font-medium text-gray-700"
            >
              Fecha inicial
            </label>
            <input
              type="date"
              id="fechaInicial"
              name="fechaInicial"
              value={prestamo.fechaInicial}
              onChange={handleInputChange}
              className={`border p-2 rounded-md shadow-sm `}
            />
          </div>
        </div>

        <button
          type="submit"
          // onClick={() => setchecPartners(true)}
          className="bg-black mb-5 text-[13px] text-white px-2 py-2 rounded-md shadow-lg flex items-center gap-2"
        >
          FINALIZAR RONDAS
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">N°</th>
              <th className="px-4 py-2">Fecha de Pago</th>
              <th className="px-4 py-2">Días</th>
              <th className="px-4 py-2">Saldo Inicial</th>
              <th className="px-4 py-2">Pago Capital</th>
              <th className="px-4 py-2">Pago Interés</th>
              <th className="px-4 py-2">Pago Total</th>
              <th className="px-4 py-2">Saldo Final</th>
              {/* <th className="px-4 py-2">Pago Adicional</th> */}
            </tr>
          </thead>
          <tbody>
            {tabla.map((pago) => (
              <tr key={pago.numero} className="border-b">
                <td className="px-4 py-2">{pago.numero}</td>
                <td className="px-4 py-2">{pago.fecha}</td>
                <td className="px-4 py-2">{pago.dias}</td>
                <td className="px-4 py-2">
                  {parseFloat(pago.saldoInicial).toLocaleString("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  })}
                </td>
                <td className="px-4 py-2">
                  {parseFloat(pago.capital).toLocaleString("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  })}
                </td>
                <td className="px-4 py-2">
                  {parseFloat(pago.interes).toLocaleString("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  })}
                </td>
                <td className="px-4 py-2">
                  {parseFloat(pago.pagoTotal).toLocaleString("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  })}
                </td>
                <td className="px-4 py-2">
                  {parseFloat(pago.saldoFinal).toLocaleString("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  })}
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={pagosAdicionales[pago.numero] || ""}
                    onChange={(e) =>
                      handlePagoAdicional(pago.numero, e.target.value)
                    }
                    className="w-full"
                    placeholder="Pago adicional"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
