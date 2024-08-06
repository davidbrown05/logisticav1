const mongoose = require("mongoose");

const VentasSchema = new mongoose.Schema(
  {
    propertyId: {
      type: String,
      required: false,
    },
    compradorRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comprador',
    },
    tipoVenta: {
      type: String,
      required: false,
    },
    asesor: {
      type: String,
      required: false,
    },
    comprador: {
      type: String,
      required: false,
    },
    moneda: {
      type: String,
      required: false,
    },
    precioInicial: {
      type: Number,
      required: false,
    },

    precioFinal: {
      type: Number,
      required: false,
    },
    formaPago: {
      type: String,
      required: false,
    },
    estatusVenta: {
      type: String,
      required: false,
    },
    fechaVenta: {
      type: Date,
      default: null,
      required: false,
    },
    documentosVenta: {
      type: Array,
      required: false,
    },
  },
  { timestamps: true }
);

const Ventas = mongoose.model("Ventas", VentasSchema);
module.exports = Ventas;
