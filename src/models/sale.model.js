const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema(
  {
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    buyerInfo: {
      type: String,
      default: 'Walk-in Customer',
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: String, // Product ka naam safe rakhne ke liye
        quantity: {
          type: Number,
          required: true,
        },
        salePrice: {
          type: Number,
          required: true,
        },
        purchasePrice: {
          type: Number,
          default: 0,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    totalProfit: {
      type: Number,
      required: true,
    },
    isReturned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Sale = mongoose.model('Sale', saleSchema);
module.exports = Sale;