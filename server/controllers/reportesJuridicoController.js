const Juridico = require("../models/Juridico");
const Inmueble = require("../models/Property");
const asyncHandler = require("express-async-handler");

// Función para generar un informe de jurídico que incluya datos de inmuebles
const generarInformeJuridico = asyncHandler(async (req, res) => {
  try {
    const { proceso } = req.params;
    const juridicoData = await Juridico.find({ proceso: proceso });

    const informe = await Promise.all(
      juridicoData.map(async (entry) => {
        const inmuebleData = await Inmueble.findById(entry.propertyId);
        return {
            encargadoProceso: entry.encargadoProceso,
            direccion: inmuebleData.direccion,
        };
      })
    );

    res.status(200).json(informe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  generarInformeJuridico,
};
