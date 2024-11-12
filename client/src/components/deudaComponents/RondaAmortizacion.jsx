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

export const RondaAmortizacion = ({
  partnerInfo,
  partners,
  setPartners,
  corridaIndex,
  setSelectedTab,
  setpartnerInfo,
  setloaderContext
}) => {
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
    plazo: 12,
    parcialidades: 2,
    fechaInicial: moment().format("YYYY-MM-DD"),
  });
  const [tabla, setTabla] = useState([]);
  const [checPartners, setchecPartners] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setPrestamo((prev) => ({
  //     ...prev,
  //     [name]: name === "fechaInicial" ? value : Number(value),
  //   }));
  // };

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

  const calcularTabla = () => {
    const { monto, tasaInteres, plazo, parcialidades, fechaInicial } = prestamo;
    const tasaMensual = tasaInteres / 100 / 12;
    const pagos = [];
    let saldoInicial = monto;
    let fechaAnterior = moment(fechaInicial);
    let fechaProximoPagoCapital = moment(fechaInicial).add(
      plazo / parcialidades,
      "months"
    );

    for (let mes = 1; mes <= plazo; mes++) {
      const fechaPago = moment(fechaInicial).add(mes, "months");
      const dias = fechaPago.diff(fechaAnterior, "days");
      const interes = saldoInicial * tasaMensual;
      let capital = 0;
      let pagoCapital = false;

      if (fechaPago.isSame(fechaProximoPagoCapital, "month")) {
        capital = monto / parcialidades;
        pagoCapital = true;
        fechaProximoPagoCapital = fechaProximoPagoCapital.add(
          plazo / parcialidades,
          "months"
        );
      }

      const pagoTotal = capital + interes;
      const saldoFinal = saldoInicial - capital;

      pagos.push({
        _id: String(Math.random()).replace(".", ""),
        numero: mes,
        fecha: fechaPago.format("DD/MM/YYYY"),
        fechaParaPago: fechaPago.toISOString(),
        dias,
        saldoInicial: saldoInicial.toFixed(2),
        capital: capital.toFixed(2),
        interes: interes.toFixed(2),
        pagoTotal: pagoTotal.toFixed(2),
        saldoFinal: saldoFinal.toFixed(2),
        pagoCapital,
        fechaPagoRealizado: "",
        abonos: [],
        status: "false",
        check: "false",
      });

      saldoInicial = saldoFinal;
      fechaAnterior = fechaPago;
    }

    console.log("Pagos:", pagos);

    setTabla(pagos);
  };

  useEffect(() => {
    calcularTabla();
  }, [prestamo]);

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
   
    if(checPartners){
      console.log("partnerInfoActualizado", partnerInfo);
        handlePartner(partnerInfo)
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
      setloaderContext(true)
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Tabla Retorno de Inversión
      </h1>
      <form   onSubmit={onSubmit}>
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
          onClick={() => setchecPartners(true)}
          className="bg-black mb-5 text-white px-2 py-2 rounded-full shadow-lg flex items-center gap-2"
        >
          FINALIZAR RONDAS
        </button>
      </form>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">N°</th>
              <th className="px-4 py-2">Fecha de Pago</th>
              <th className="px-4 py-2">Días</th>
              <th className="px-4 py-2">Saldo Inicial</th>
              <th className="px-4 py-2">Pago Capital</th>
              <th className="px-4 py-2">Pago Interés</th>
              <th className="px-4 py-2">Pago Total</th>
              <th className="px-4 py-2">Saldo Final</th>
            </tr>
          </thead>
          <tbody>
            {tabla.map((pago) => (
              <tr
                key={pago.numero}
                className={pago.pagoCapital ? "bg-blue-100" : ""}
              >
                <td className="border px-4 py-2">{pago.numero}</td>
                <td className="border px-4 py-2">{moment(pago.fechaParaPago).format("DD-MMM-YYYY")}</td>
                <td className="border px-4 py-2">{pago.dias}</td>
                <td className="border px-4 py-2">{`$${pago.saldoInicial.toLocaleString()}`}</td>
                <td className="border px-4 py-2">{pago.capital}</td>
                <td className="border px-4 py-2">{pago.interes}</td>
                <td className="border px-4 py-2">{pago.pagoTotal}</td>
                <td className="border px-4 py-2">{pago.saldoFinal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

'use client'

//ronda amotizacion especial

export default function Component() {
  const [prestamo, setPrestamo] = useState({
    monto: 500000,
    tasaInteres: 20,
    plazo: 5,
    parcialidades: 5,
    fechaInicial: format(new Date(), 'yyyy-MM-dd'),
  })
  const [tabla, setTabla] = useState([])
  const [pagosAdicionales, setPagosAdicionales] = useState({})

  const calcularTabla = () => {
    const { monto, tasaInteres, plazo, parcialidades, fechaInicial } = prestamo
    const pagos = []
    let saldoInicial = monto
    let fechaAnterior = new Date(fechaInicial)
    const pagoCapitalPorParcialidad = monto / parcialidades
    // La tasa de interés se divide por 100 para convertirla de porcentaje a decimal,
    // luego se divide por 10 para obtener la tasa mensual (asumiendo que es anual)

    for (let mes = 1; mes <= plazo; mes++) {
      const fechaPago = addMonths(new Date(fechaInicial), mes)
      const dias = differenceInDays(fechaPago, fechaAnterior)
      const interes = (saldoInicial * (tasaInteres / 100)) / 10;
      let capital = pagoCapitalPorParcialidad
      
      // Aplicar pago adicional si existe
      const pagoAdicional = pagosAdicionales[mes] || 0
      capital += pagoAdicional

      // Asegurarse de que el capital no exceda el saldo inicial
      capital = Math.min(capital, saldoInicial)

      const pagoTotal = capital + interes
      const saldoFinal = saldoInicial - capital

      pagos.push({
        numero: mes,
        fecha: format(fechaPago, 'dd/MM/yyyy'),
        dias,
        saldoInicial: saldoInicial.toFixed(2),
        capital: capital.toFixed(2),
        interes: interes.toFixed(2),
        pagoTotal: pagoTotal.toFixed(2),
        saldoFinal: saldoFinal.toFixed(2),
        pagoAdicional: pagoAdicional.toFixed(2),
      })

      saldoInicial = saldoFinal
      fechaAnterior = fechaPago

      // Si el saldo llega a cero, terminar la tabla
      if (saldoFinal <= 0) break
    }

    setTabla(pagos)
  }

  useEffect(() => {
    calcularTabla()
  }, [prestamo, pagosAdicionales])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setPrestamo(prev => ({
      ...prev,
      [name]: name === 'fechaInicial' ? value : parseFloat(value) || 0,
    }))
  }

  const handlePagoAdicional = (mes, valor) => {
    setPagosAdicionales(prev => ({
      ...prev,
      [mes]: parseFloat(valor) || 0,
    }))
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Tabla de Amortización Personalizada</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="monto">Monto del préstamo</Label>
          <Input
            type="number"
            id="monto"
            name="monto"
            value={prestamo.monto}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tasaInteres">Tasa de interés anual (%)</Label>
          <Input
            type="number"
            id="tasaInteres"
            name="tasaInteres"
            value={prestamo.tasaInteres}
            onChange={handleInputChange}
            step="0.01"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="plazo">Plazo (meses)</Label>
          <Input
            type="number"
            id="plazo"
            name="plazo"
            value={prestamo.plazo}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="parcialidades">Número de parcialidades de capital</Label>
          <Input
            type="number"
            id="parcialidades"
            name="parcialidades"
            value={prestamo.parcialidades}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fechaInicial">Fecha inicial</Label>
          <Input
            type="date"
            id="fechaInicial"
            name="fechaInicial"
            value={prestamo.fechaInicial}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N°</TableHead>
              <TableHead>Fecha de Pago</TableHead>
              <TableHead>Días</TableHead>
              <TableHead>Saldo Inicial</TableHead>
              <TableHead>Pago Capital</TableHead>
              <TableHead>Pago Interés</TableHead>
              <TableHead>Pago Total</TableHead>
              <TableHead>Saldo Final</TableHead>
              <TableHead>Pago Adicional</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tabla.map((pago) => (
              <TableRow key={pago.numero}>
                <TableCell>{pago.numero}</TableCell>
                <TableCell>{pago.fecha}</TableCell>
                <TableCell>{pago.dias}</TableCell>
                <TableCell>{parseFloat(pago.saldoInicial).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</TableCell>
                <TableCell>{parseFloat(pago.capital).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</TableCell>
                <TableCell>{parseFloat(pago.interes).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</TableCell>
                <TableCell>{parseFloat(pago.pagoTotal).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</TableCell>
                <TableCell>{parseFloat(pago.saldoFinal).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={pagosAdicionales[pago.numero] || ''}
                    onChange={(e) => handlePagoAdicional(pago.numero, e.target.value)}
                    className="w-full"
                    placeholder="Pago adicional"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}


