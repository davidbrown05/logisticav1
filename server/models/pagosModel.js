const mongoose = require("mongoose");

const PagosSchema = new mongoose.Schema(
  {
    propertyId: {
      type: String,
      required: false,
    },
    comprador: {
      type: String,
      required: false,
    },

    montoTotal: {
      type: Number,
      required: false,
    },
    montoTotalEmpresa: {
      type: Number,
      required: false,
    },

    pagosLista: {
      type: Array,
      required: false,
    },
    calendarioLista: {
      type: Array,
      required: false,
    },

    reembolsosLista: {
      type: Array,
      required: false,
    },
    empresaLista: {
      type: Array,
      required: false,
    },
  },
  { timestamps: true }
);

const Pagos = mongoose.model("Pagos", PagosSchema);
module.exports = Pagos;
