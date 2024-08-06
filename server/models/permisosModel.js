const mongoose = require("mongoose");

const PermisosSchema = new mongoose.Schema(
  {
    permiso: {
      type: String,
      required: false,
    },
    modulo: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Permisos = mongoose.model("Permiso", PermisosSchema);
module.exports = Permisos;
