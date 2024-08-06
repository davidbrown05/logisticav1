const Juridico = require("../models/Juridico");
const asyncHandler = require("express-async-handler");
const moment = require("moment");

// Función para generar un informe de jurídico que incluya datos de tareas con fechaLimite excedida
const atrasojuridico = asyncHandler(async (req, res) => {
  try {
    const juridicoData = await Juridico.find({
      "tareasLista.fechaLimite": { $lt: moment().toDate() }
    });

    // Ahora tenemos juridicoData que contiene documentos de Juridico donde al menos una tarea tiene fechaLimite excedida
    // Puedes realizar cualquier procesamiento adicional que necesites aquí

    res.status(200).json(juridicoData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
    atrasojuridico,
};