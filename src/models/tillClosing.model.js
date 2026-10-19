const mongoose = require('mongoose');

const tillClosingSchema = new mongoose.Schema(
  {
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    systemExpectedCash: {
      type: Number,
      required: true, // Jo system ke mutabiq banta hai
    },
    actualPhysicalCash: {
      type: Number,
      required: true, // Jo cashier ne ginkar enter kiya
    },
    difference: {
      type: Number,
      required: true, // Positive = Excess (zyada), Negative = Shortage (kam)
    },
    notes: {
      type: String,
      default: '', // Misal ke tor par "Change nahi thi"
    },
  },
  {
    timestamps: true,
  }
);

const TillClosing = mongoose.model('TillClosing', tillClosingSchema);
module.exports = TillClosing;