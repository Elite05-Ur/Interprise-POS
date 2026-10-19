const Purchase = require('../models/purchase.model');
const Product = require('../models/product.model');

// 1. New Purchase Entry (Stock aur Price update karne ke liye)
const createPurchase = async (req, res) => {
  try {
    const { productId, supplierName, quantity, purchasePrice } = req.body;

    // Validation: Check karein ke koi zaroori field missing toh nahi hai
    if (!productId || !supplierName || !quantity || !purchasePrice) {
      return res.status(400).json({ message: 'ProductId, supplierName, quantity aur purchasePrice dena lazmi hai!' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product nahi mila!' });
    }

    // Validation: Purchase price sale price se zyada nahi honi chahiye
    if (Number(purchasePrice) > Number(product.salePrice)) {
      return res.status(400).json({
        message: `Error: Purchase price (${purchasePrice}) sale price (${product.salePrice}) se zyada nahi ho sakti!`,
      });
    }

    const qty = Number(quantity);
    const pPrice = Number(purchasePrice);
    const totalAmount = qty * pPrice;

    // Purchase record create karna
    const purchase = await Purchase.create({
      product: productId,
      supplierName,
      quantity: qty,
      purchasePrice: pPrice,
      totalAmount,
      staff: req.user._id,
    });

    // Product ka stock plus karna aur latest purchase price update karna
    product.stockQuantity += qty;
    product.purchasePrice = pPrice; 
    await product.save();

    res.status(201).json({
      message: 'Purchase entry successful, stock aur price update ho gayi!',
      purchase,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// 2. Saari Purchases History Dekhne ke liye
const getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find({})
      .populate('product', 'name category salePrice')
      .populate('staff', 'name email role');
      
    res.status(200).json(purchases);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

module.exports = {
  createPurchase,
  getAllPurchases,
};