const dotenv = require('dotenv');
dotenv.config(); // Environment variables load karne ke liye

const app = require('./src/app');
const connectDB = require('./src/db/db');
const morgan = require('morgan');

// Database Connect karna
connectDB();

const PORT = process.env.PORT || 3000;



app.use(morgan('dev'));


// Server Run karna
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

