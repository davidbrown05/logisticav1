const express = require("express");
const Product = require("../models/Juridico");
const {
  generarNotificacionesJuridicas,
} = require("../controllers/juridicoNotController");

const router = express.Router();

router.get(`/`, generarNotificacionesJuridicas);


module.exports = router