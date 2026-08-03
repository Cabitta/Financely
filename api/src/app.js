const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const householdRoutes = require('./routes/householdRoutes');
const syncRoutes = require('./routes/syncRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/households', householdRoutes);
app.use('/api/sync', syncRoutes);

// Error Handler Fallback
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;
