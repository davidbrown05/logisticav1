const Product = require("../models/compradorModel");
const asyncHandler = require("express-async-handler");

//get all products
// const getProducts = asyncHandler(async (req, res) => {
//   try {
//     const products = await Product.find({});
//     res.status(200).json(products);
//   } catch (error) {
//     res.status(500);
//     throw new Error(error.message);
//   }
// });

const getProducts = asyncHandler(async (req, res) => {
  try {
    const { searchTerm, page = 1, limit = 10 } = req.query;
    let filter = {};

    if (searchTerm) {
      const regex = new RegExp(searchTerm, "i"); // Case-insensitive regex search
      filter = {
        $or: [
          { nombreCompleto: regex },
         
          // Añadir más campos según sea necesario
        ],
      };
    }

    const total = await Product.countDocuments(filter); // Total number of matching documents
    const compradores = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      compradores,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// get a single product
const getProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    // const product = await Product.find({ propertyId: id });
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// create a product
const createProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(200).json(product);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// update a product
const updateProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body);
    // we cannot find any product in database
    if (!product) {
      res.status(404);
      throw new Error(`cannot find any product with ID ${id}`);
    }
    const updatedProduct = await Product.findById(id);
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

//delete product

const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      res.status(404);
      throw new Error(`cannot find any product with ID ${id}`);
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
