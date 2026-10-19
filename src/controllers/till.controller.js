const TillClosing = require('../models/tillClosing.model');
const Sale = require('../models/sale.model');

// Cashier apna till close karega aur cash match karega
const submitTillClosing = async (req, res) => {
  try {
    const { actualPhysicalCash, notes } = req.body;
    const staffId = req.user._id;

    if (actualPhysicalCash === undefined) {
      return res.status(400).json({ message: 'Actual physical cash enter karna lazmi hai!' });
    }

    // Aaj ki is staff ki total sales calculate karna
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const staffSales = await Sale.find({
      staff: staffId,
      createdAt: { $gte: todayStart },
      isReturned: false,
    });

    // Total expected cash = (salePrice * quantity) ka sum
    const systemExpectedCash = staffSales.reduce((acc, sale) => {
      return acc + (sale.salePrice * sale.quantity);
    }, 0);

    // Difference (Shortage ya Excess)
    const difference = Number(actualPhysicalCash) - systemExpectedCash;

    const closingRecord = await TillClosing.create({
      staff: staffId,
      systemExpectedCash,
      actualPhysicalCash: Number(actualPhysicalCash),
      difference, // Agar minus mein hai toh shortage hai, plus mein hai toh excess
      notes: notes || '',
    });

    res.status(201).json({
      message: 'Till closing successfully submit ho gayi!',
      summary: {
        systemExpectedCash,
        actualPhysicalCash: Number(actualPhysicalCash),
        difference: difference === 0 ? 'Cash Balanced (Bilkul theek)' : difference < 0 ? `Shortage: ${Math.abs(difference)} PKR kam hain` : `Excess: ${difference} PKR zyada hain`,
      },
      closingRecord,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// Admin ke liye saare cashiers ki closing report dekhna
const getAllTillClosings = async (req, res) => {
  try {
    const closings = await TillClosing.find({})
      .populate('staff', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json(closings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

module.exports = {
  submitTillClosing,
  getAllTillClosings,
};