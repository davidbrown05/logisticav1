const Product = require("../models/Property");
const asyncHandler = require("express-async-handler");
const cloudinary = require("../utils/cloudinary");

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

//get all products with optional filters
// const getProducts = asyncHandler(async (req, res) => {
//   try {
//     const { direccion } = req.query;
//     let filter = {};

//     if (direccion) {
//       filter.direccion = new RegExp(direccion, 'i'); // Case-insensitive regex search
//     }

//     const products = await Product.find(filter);
//     res.status(200).json(products);
//   } catch (error) {
//     res.status(500);
//     throw new Error(error.message);
//   }
// });

//get all products with optional filters
// const getProducts = asyncHandler(async (req, res) => {
//   try {
//     const { searchTerm } = req.query;
//     let filter = {};

//     if (searchTerm) {
//       const regex = new RegExp(searchTerm, 'i'); // Case-insensitive regex search
//       filter = {
//         $or: [
//           { direccion: regex },
//           { comprador: regex },
//           { estatusVenta: regex },
//           // Añadir más campos según sea necesario
//         ]
//       };
//     }

//     const products = await Product.find(filter);
//     res.status(200).json(products);
//   } catch (error) {
//     res.status(500);
//     throw new Error(error.message);
//   }
// });

//get all products with optional filters and pagination
const getProducts = asyncHandler(async (req, res) => {
  try {
    const { searchTerm, page = 1, limit = 10 } = req.query;
    let filter = {};

    if (searchTerm) {
      const regex = new RegExp(searchTerm, 'i'); // Case-insensitive regex search
      filter = {
        $or: [
          { direccion: regex },
          { comprador: regex },
          { estatusVenta: regex },
          // Añadir más campos según sea necesario
        ]
      };
    }

    const total = await Product.countDocuments(filter); // Total number of matching documents
    const products = await Product.find(filter).populate("compradorRef")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      products,
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
   // const product = await Product.findByIdAndUpdate(id, req.body, { new: true }).populate('compradorRef');
    // we cannot find any product in database
    if (!product) {
      res.status(404);
      throw new Error(`cannot find any product with ID ${id}`);
    }
    const updatedProduct = await Product.findById(id);
  //  const updatedProduct = await Product.findById(id).populate('compradorRef');
    res.status(200).json(product);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

//delete product

const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    //tomar la id de la imagen de cloudinary
    const imgId = product.assetid;
    if (!product) {
      res.status(404);
      throw new Error(`cannot find any product with ID ${id}`);
    }

    await cloudinary.uploader.destroy(imgId);
    const rmProduct = await Product.findByIdAndDelete(id);
    res.status(200).json(rmProduct);
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
