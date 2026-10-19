const Product = require('../models/product.model');

// 1. Naya Product Add Karna (Fixed)
const createProduct = async (req, res) => {
  try {
    const { name, category, purchasePrice, salePrice, stockQuantity, image } = req.body;

    const product = await Product.create({
      name,
      category,
      purchasePrice: purchasePrice || 0,
      salePrice: salePrice || 0,
      stockQuantity: stockQuantity || 0,
      image,
      isActive: true,
    });

    res.status(201).json({
      message: 'Product successfully add ho gaya!',
      product,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// 2. Sirf Active Products Fetch Karna
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// 3. Product Update Karna
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedData = req.body;

    const product = await Product.findByIdAndUpdate(productId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: 'Product nahi mila!' });
    }

    res.status(200).json({
      message: 'Product successfully update ho gaya!',
      product,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// 4. Soft Delete Product
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findByIdAndUpdate(
      productId,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product nahi mila!' });
    }

    res.status(200).json({ message: 'Product successfully deactivate (soft delete) ho gaya, purani history safe hai!' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
};