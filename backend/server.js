const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');  // Corrected import

// ✅ Load environment variables from root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// ✅ Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors({  // Configure CORS with more options
  origin: 'http://localhost:3000',  // Allow your frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true  // Allow cookies if needed
}));

app.use(express.json());      // Parse JSON requests

// Debug middleware to log all requests (after JSON parsing)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// ✅ Import Routes
const authRoutes = require('./routes/authRoutes');
const doubtRoutes = require('./routes/doubtRoutes');
const resourceRoutes = require('./routes/resourceRoutes');

// ✅ Use Routes
app.use('/api/auth', authRoutes);         // Register & Login
app.use('/api/doubts', doubtRoutes);      // Doubts
app.use('/api/resources', resourceRoutes); // Resources

// ✅ Default route
app.get('/', (req, res) => {
  res.send('✅ Study Doubt Manager API is running...');
});

// ✅ Connect to MongoDB and Start Server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);  // Exit process if DB connection fails
  });

// Centralized error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});
