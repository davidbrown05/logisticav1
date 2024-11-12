const express = require("express");
const Product = require("../models/pagosModel");
const {
  generarNotificacionesPagos,
} = require("../controllers/pagosNotController");

const router = express.Router();

router.get(`/`, generarNotificacionesPagos);

module.exports = router;
