const express = require('express')
const {atrasojuridico} = require("../controllers/atrasosJuridicos")


const router = express.Router()


router.get('/', atrasojuridico)

module.exports = router