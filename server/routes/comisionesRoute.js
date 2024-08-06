const express = require('express');
const Product = require('../models/comisionesModel')
const {getProducts, getProduct, createProduct, updateProduct, deleteProduct} = require('../controllers/comisionesController')

const router = express.Router();

router.get('/', getProducts)
router.get('/:id', getProduct)
router.post('/', createProduct);
// update a product
router.put('/:id', updateProduct);

// delete a product

router.delete('/:id', deleteProduct);

module.exports = router; 