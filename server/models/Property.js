const mongoose = require("mongoose");

const InmuebleSchema = new mongoose.Schema(
  {
    direccion: {
      type: String,
      required: false,
    },
    compradorRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comprador',
    },
    numExterior: {
      type: Number,
      required: false,
    },
    numInterior: {
      type: Number,
      required: false,
    },
    colonia: {
      type: String,
      required: false,
    },
    codigoPostal: {
      type: Number,
      required: false,
    },
    precio: {
      type: Number,
      required: false,
    },
    precioFinal: {
      type: Number,
      required: false,
    },
    estado: {
      type: String,
      required: false,
    },
    tipoVenta: {
      type: String,
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
    tipoInmueble: {
      type: String,
      required: false,
    },
    ciudad: {
      type: String,
      required: false,
    },
    metrosTerreno: {
      type: Number,
      required: false,
    },
    construccion: {
      type: Number,
      required: false,
    },
    numRecamaras: {
      type: Number,
      required: false,
    },
    numBanos: {
      type: Number,
      required: false,
    },
    nivel: {
      type: String,
      required: false,
    },
    estatusInmueble: {
      type: String,
      required: false,
    },
    estatusJuridico: {
      type: String,
      required: false,
    },
    contacto: {
      type: String,
      required: false,
    },
    llaves: {
      type: String,
      required: false,
    },
    visitada: {
      type: String,
      required: false,
    },
    empresa: {
      type: String,
      required: false,
    },
    comprador: {
      type: String,
      required: false,
    },
    comprador_id: {
      type: String,
      required: false,
    },
    proceso: {
      type: String,
      required: false,
    },
    folioEmpresa: {
      type: String,
      required: false,
    },
    nombreAcreditado: {
      type: String,
      required: false,
    },
    assetid: {
      type: String,
      required: false,
    },
    foto: {
      type: String,
      required: false,
    },
    juridicoDir: {
      type: Boolean,
      required: false,
    },
    juridicoadmin: {
      type: Boolean,
      required: false,
    },
    juridicoJur: {
      type: Boolean,
      required: false,
    },
  },
  { timestamps: true }
);

const Inmueble = mongoose.model("Inmueble", InmuebleSchema);
module.exports = Inmueble;
