const mongoose = require("mongoose");

const PropertyDeudaSchema = new mongoose.Schema(
  {
    propertyId: {
      type: String,
      required: false,
    },
    contacto: {
      type: String,
      required: false,
    },
    empresa: {
      type: String,
      required: false,
    },
    direccion: {
      type: String,
      required: false,
    },

    montoTotal: {
      type: Number,
      required: false,
    },

    deudaLista: {
      type: Array,
      required: false,
    },
  },
  { timestamps: true }
);

const PropertyDeuda = mongoose.model("PropertyDeudas", PropertyDeudaSchema);
module.exports = PropertyDeuda;
