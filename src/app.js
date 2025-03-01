const express = require('express');
const schoolRoutes = require('./routes/schoolRoutes');
const schoolModel = require('./models/schoolModel');

const app = express();

app.use(express.json());
app.use('/api', schoolRoutes);

// Use Railway-provided PORT or default to 3000
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});

// Initialize database
schoolModel.initialize().catch(console.error);

module.exports = app;