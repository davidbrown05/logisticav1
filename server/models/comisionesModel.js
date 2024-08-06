const mongoose = require("mongoose");

const ComisionesSchema = new mongoose.Schema(
  {
    propertyId: {
      type: String,
      required: false,
    },
    localizacion: {
      type: String,
      required: false,
    },
    empresa: {
      type: String,
      required: false,
    },
    contacto: {
      type: String,
      required: false,
    },
    telefono: {
      type: String,
      required: false,
    },
    valorEmpresa: {
      type: String,
      required: false,
    },

    porcentajeComision: {
      type: Number,
      required: false,
    },
    montoTotal: {
      type: Number,
      required: false,
    },
    saldo: {
      type: Number,
      required: false,
    },

    empresaLista: {
      type: Array,
      required: false,
    },
    juridicoLista: {
      type: Array,
      required: false,
    },
    otrosLista: {
      type: Array,
      required: false,
    },
    observacionesLista: {
      type: Array,
      required: false,
    },
  },
  { timestamps: true }
);

const Comisiones = mongoose.model("Comisiones", ComisionesSchema);
module.exports = Comisiones;
