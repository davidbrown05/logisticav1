const asyncHandler = require("express-async-handler");
const Product = require('../models/Juridico')


const generarNotificacionesJuridicas = asyncHandler(async (req, res) => {
    try {
        // Filtrar los documentos donde 'tareasLista' no esté vacío
        const products = await Product.find({ "tareasLista": { $ne: [] } });

        // Obtener la fecha actual
    const now = new Date();

    // Filtrar productos donde al menos una tarea en 'tareasLista' tenga 'fechaLimite' pasada
    const filteredProducts = products.filter(product => 
      product.tareasLista.some(task =>  new Date(task.fechaLimite) < now && task.status === "ACTIVA")
    );
        
        res.status(200).json(filteredProducts);
      } catch (error) {
        res.status(500);
        throw new Error(error.message);
      }
});

module.exports = {
    generarNotificacionesJuridicas,
};
