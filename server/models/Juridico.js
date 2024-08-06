const mongoose = require("mongoose");

const JuridicoSchema = new mongoose.Schema(
  {
    propertyId: {
      type: String,
      required: false,
    },
    encargadoProceso: {
      type: String,
      required: false,
    },
    expediente: {
      type: String,
      required: false,
    },
    juzgado: {
      type: String,
      required: false,
    },
    acreditado: {
      type: String,
      required: false,
    },
    numExpediente: {
      type: String,
      required: false,
    },

    cesion: {
      type: String,
      required: false,
    },
    cesionario: {
      type: String,
      required: false,
    },
    proceso: {
      type: String,
      required: false,
    },
    juicio: {
      type: String,
      required: false,
    },
    jurisdiccion: {
      type: String,
      required: false,
    },
    estatusProcesal: {
      type: String,
      required: false,
    },
    gastos: {
      type: Number,
      required: false,
    },
    fondo: {
      type: Number,
      required: false,
    },
    gravamen: {
      type: String,
      required: false,
    },
    extrajudicial: {
      type: String,
      required: false,
    },
    observacionesJuridicas: {
      type: Array,
      required: false,
    },
    user_dir: {
      type: String,
      required: false,
    },
    user_admin: {
      type: String,
      required: false,
    },
    user_Juridico: {
      type: String,
      required: false,
    },
    gastosLista: {
      type: Array,
      required: false,
    },
    documentosLista: {
      type: Array, 
      required: false,
    },
    assetid: {
      type: String,
      required: false,
    },

    tareasLista: {
      type: Array,
      required: false,
    },
    direccion: {
      type: Boolean,
      required: false,
    },
    administracion: {
      type: Boolean,
      required: false,
    },
    juridico: {
      type: Boolean,
      required: false,
    },
    obvDir: {
      type: String,
      required: false,
    },
    obvAdmin: {
      type: String,
      required: false,
    },
    obvJuridicas: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Juridico = mongoose.model("Juridico", JuridicoSchema);
module.exports = Juridico;
