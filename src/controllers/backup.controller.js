const Product = require('../models/product.model');
const Sale = require('../models/sale.model');
const Purchase = require('../models/purchase.model');
const fs = require('fs');
const path = require('path');

// Local PC par CSV Backup generate karne ki API
const downloadCSVBackup = async (req, res) => {
  try {
    const products = await Product.find({}).lean();
    const sales = await Sale.find({}).lean();
    const purchases = await Purchase.find({}).lean();

    // Simple helper function to convert JSON to CSV string
    const convertToCSV = (arr) => {
      if (arr.length === 0) return '';
      const headers = Object.keys(arr[0]);
      const rows = arr.map(obj => 
        headers.map(header => JSON.stringify(obj[header] || '')).join(',')
      );
      return [headers.join(','), ...rows].join('\n');
    };

    const productCSV = convertToCSV(products);
    const salesCSV = convertToCSV(sales);
    const purchaseCSV = convertToCSV(purchases);

    // Local folder check / create karna (Admin ke PC par)
    const backupDir = path.join(__dirname, '../backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = Date.now();
    fs.writeFileSync(path.join(backupDir, `products_${timestamp}.csv`), productCSV);
    fs.writeFileSync(path.join(backupDir, `sales_${timestamp}.csv`), salesCSV);
    fs.writeFileSync(path.join(backupDir, `purchases_${timestamp}.csv`), purchaseCSV);

    res.status(200).json({
      message: 'CSV Backup successfully generate ho kar server/local folder mein save ho gaya hai!',
      folderPath: backupDir
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

module.exports = {
  downloadCSVBackup,
};