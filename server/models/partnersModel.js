const mongoose = require("mongoose");

const PartnersSchema = new mongoose.Schema(
  {
    partner: {
      type: String,
      required: false,
    },
    fechaInicioInversion: {
      type: Date,
      required: false,
    },
    fechaContratoVigente: {
      type: Date,
      required: false,
    },

    assetid: {
      type: String,
      required: false,
    },
    documento: {
      type: String,
      required: false,
    },
    tipoPago: {
      type: String,
      required: false,
    },
    inversionInicial: {
      type: Number,
      required: false,
    },
    suertePrincipal: {
      type: Number,
      required: false,
    },
    porcentajeUtilidad: {
      type: Number,
      required: false,
    },
    plazo: {
      type: Number,
      required: false,
    },
    parcialidades: {
      type: Number,
      required: false,
    },
    utilidad: {
      type: Number,
      required: false,
    },
    totalReembolzo: {
      type: Number,
      required: false,
    },

    corridas: {
      type: Array,
      required: false,
    },
    pagosFinales: {
      type: Array,
      required: false,
    },
    status: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Partners = mongoose.model("Partner", PartnersSchema);
module.exports = Partners;
