const express = require('express')
const {generarInformeJuridico} = require("../controllers/reportesJuridicoController")


const router = express.Router()


router.get('/:proceso', generarInformeJuridico)

module.exports = router