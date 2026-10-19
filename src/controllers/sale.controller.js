const Sale = require('../models/sale.model');
const Product = require('../models/product.model');

// 1. Naya Bill / Sale Create Karna (Array of items ke sath)
const createSale = async (req, res) => {
  try {
    const { items, buyerInfo } = req.body;
    const staffId = req.user._id;

    // Basic Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Cart mein kam az kam aik product hona lazmi hai!' });
    }

    let totalAmount = 0;
    let totalProfit = 0;
    const formattedItems = [];

    // Har item ko process karna
    for (const item of items) {
      const { productId, quantity, salePrice } = item;

      if (!productId || !quantity || !salePrice) {
        return res.status(400).json({ message: 'Har item ke liye productId, quantity aur salePrice dena lazmi hai!' });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: `Product nahi mila!` });
      }

      // Validation: Sale price purchase price se kam na ho
      if (Number(salePrice) < Number(product.purchasePrice)) {
        return res.status(400).json({
          message: `Warning: Product (${product.name}) ki sale price (${salePrice}) purchase price (${product.purchasePrice}) se kam nahi ho sakti!`,
        });
      }

      const qty = Number(quantity);

      // Race Condition Fix (Atomic update taake stock minus karte waqt negative na ho)
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: productId, stockQuantity: { $gte: qty } },
        { $inc: { stockQuantity: -qty } },
        { new: true }
      );

      if (!updatedProduct) {
        return res.status(400).json({ message: `Stock mein ${product.name} ki itni quantity mojood nahi hai!` });
      }

      const purchasePrice = product.purchasePrice || 0;
      const itemProfit = (Number(salePrice) - Number(purchasePrice)) * qty;
      const itemTotalAmount = Number(salePrice) * qty;

      totalAmount += itemTotalAmount;
      totalProfit += itemProfit;

      formattedItems.push({
        product: product._id,
        name: product.name,
        quantity: qty,
        purchasePrice,
        salePrice: Number(salePrice),
        profit: itemProfit,
      });
    }

    // Poora bill ek hi document mein save hoga
    const sale = await Sale.create({
      staff: staffId,
      buyerInfo: buyerInfo || 'Walk-in Customer',
      items: formattedItems,
      totalAmount,
      totalProfit,
    });

    res.status(201).json({
      message: 'Bill successfully generate ho gaya aur stock minus ho gaya!',
      sale,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// 2. Saari Sales Fetch Karna
const getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find({})
      .populate('items.product', 'name category')
      .populate('staff', 'name email role')
      .sort({ createdAt: -1 });
      
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// 3. Sale Return / Refund Function (Poora bill return karna)
const returnSale = async (req, res) => {
  try {
    const saleId = req.params.id;

    const sale = await Sale.findById(saleId);
    if (!sale) {
      return res.status(404).json({ message: 'Sale record nahi mila!' });
    }

    if (sale.isReturned) {
      return res.status(400).json({ message: 'Yeh bill pehle hi return kiya ja chuka hai!' });
    }

    // Bill ke andar mojood saare items ka stock wapas plus karna
    for (const item of sale.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stockQuantity += item.quantity;
        await product.save();
      }
    }

    // Sale ko returned mark karna aur profit zero karna
    sale.isReturned = true;
    sale.totalProfit = 0;
    await sale.save();

    res.status(200).json({
      message: 'Bill successfully return ho gaya aur stock inventory mein wapas add ho gaya!',
      sale,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// 4. Staff-wise Closing Report
const getStaffClosingReport = async (req, res) => {
  try {
    const report = await Sale.aggregate([
      {
        $match: { isReturned: false }
      },
      {
        $group: {
          _id: '$staff',
          totalSalesCount: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          totalProfit: { $sum: '$totalProfit' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'staffInfo'
        }
      },
      {
        $unwind: '$staffInfo'
      },
      {
        $project: {
          _id: 0,
          staffName: '$staffInfo.name',
          email: '$staffInfo.email',
          role: '$staffInfo.role',
          totalSalesCount: 1,
          totalRevenue: 1,
          totalProfit: 1
        }
      }
    ]);

    res.status(200).json({
      message: 'Staff-wise closing report successfully fetch ho gayi!',
      report
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

module.exports = {
  createSale,
  getAllSales,
  returnSale,
  getStaffClosingReport,
};