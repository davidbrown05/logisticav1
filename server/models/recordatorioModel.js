const mongoose = require("mongoose");

const RecordatoriosSchema = new mongoose.Schema(
  {
    propertyId: {
      type: String,
      required: false,
    },
    recordatorio: {
      type: String,
      required: false,
    },
    contacto: {
      type: String,
      required: false,
    },
    fechaRecordatorio: {
      type: Date,
      default: null,
      required: false,
    },
  },
  { timestamps: true }
);

const Recordatorios = mongoose.model("Recordatorios", RecordatoriosSchema);
module.exports = Recordatorios;
