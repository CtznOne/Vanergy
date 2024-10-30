import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import panelRoutes from './routes/panels.js';
import mpptRoutes from './routes/mppts.js';
import inverterRoutes from './routes/inverters.js';
import batteryRoutes from './routes/batteries.js';
import chargerRoutes from './routes/chargers.js';

dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/panels', panelRoutes);
app.use('/api/mppts', mpptRoutes);
app.use('/api/inverters', inverterRoutes);
app.use('/api/batteries', batteryRoutes);
app.use('/api/chargers', chargerRoutes);

// Basic route for testing
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});