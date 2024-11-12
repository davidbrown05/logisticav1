const Product = require("../models/partnersModel");
const asyncHandler = require("express-async-handler");
const cloudinary = require("../utils/cloudinary");

//get all products
const getProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
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
    const { assetidToDelete } = req.body;
    const product = await Product.findByIdAndUpdate(id, req.body);
    // we cannot find any product in database
    if (!product) {
      res.status(404);
      throw new Error(`cannot find any product with ID ${id}`);
    }

    // Lógica para eliminar `assetid` de Cloudinary si existe
    if (assetidToDelete && assetidToDelete !== "") {
      await cloudinary.uploader.destroy(assetidToDelete);
    }

    const updatedProduct = await Product.findById(id);
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

//delete product
// const deleteProduct = asyncHandler(async (req, res) => {
//   try {
//     const { id } = req.params;
//     const product = await Product.findById(id);
//     //tomar la id de la imagen de cloudinary
//    // const imgId = product.assetid;
//     if (!product) {
//       res.status(404);
//       throw new Error(`cannot find any product with ID ${id}`);
//     }

//      // Verificar si el producto tiene un assetid antes de intentar eliminar la imagen en Cloudinary
//      const asset_id = product.assetid;
//      if (asset_id) {
//        await cloudinary.uploader.destroy(asset_id);
//      }

//     //await cloudinary.uploader.destroy(imgId);
//     const rmProduct = await Product.findByIdAndDelete(id);
//     res.status(200).json(rmProduct);
//   } catch (error) {
//     res.status(500);
//     throw new Error(error.message);
//   }
// });

const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      res.status(404);
      throw new Error(`No se encontró ningún producto con el ID ${id}`);
    }

    // Recoger todos los assetid en un array para Cloudinary
    const assetIds = [];

    // Agregar el assetid a nivel principal, si existe
    if (product.assetid) {
      assetIds.push(product.assetid);
    }

    // Recorrer `corridas` y extraer `assetid` en cada `pago` y `abono`
    product.corridas.forEach((corrida) => {
      // Revisar y recolectar `assetid` en el nivel de `corrida`
      if (corrida.assetid) {
        assetIds.push(corrida.assetid);
      }
      // Revisar y recolectar `assetid` en cada `pago` dentro de la corrida
      corrida.pagos.forEach((pago) => {
        pago.abonos.forEach((abono) => {
          if (abono.assetid) {
            assetIds.push(abono.assetid);
          }
        });
      });
    });

    // Recorrer `pagosFinales` y extraer assetid en abonos
    product.pagosFinales.forEach((pagoFinal) => {
      pagoFinal.abonos.forEach((abono) => {
        if (abono.assetid) {
          assetIds.push(abono.assetid);
        }
      });
    });

    // Eliminar todos los archivos de Cloudinary usando los assetIds recolectados
    await Promise.all(
      assetIds.map((asset_id) => cloudinary.uploader.destroy(asset_id))
    );

    // Eliminar el documento en la base de datos
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
