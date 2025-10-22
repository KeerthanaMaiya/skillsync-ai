const express = require('express');
const cors = require('cors');
require('dotenv').config();

const analysisRoutes = require('./routes/analysis');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/analysis', analysisRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'SkillSync Backend is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`SkillSync Backend: http://localhost:${PORT}`);
});