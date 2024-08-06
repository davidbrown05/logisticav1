const mongoose = require("mongoose");

const CompradorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    nombreCompleto: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    direccion: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Comprador = mongoose.model("Comprador", CompradorSchema);
module.exports = Comprador;
