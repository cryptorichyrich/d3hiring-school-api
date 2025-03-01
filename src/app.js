const express = require('express');
const schoolRoutes = require('./routes/schoolRoutes');
const schoolModel = require('./models/schoolModel');

const app = express();

app.use(express.json());
app.use('/api', schoolRoutes);

// Initialize database
schoolModel.initialize().catch(console.error);

module.exports = app;