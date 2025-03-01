const express = require('express');
const schoolRoutes = require('./routes/schoolRoutes');
const schoolModel = require('./models/schoolModel');

const app = express();
const port = process.env.APP_PORT || 3306; // Use environment variable or default to 3000

app.use(express.json());
app.use('/api', schoolRoutes);

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});

// Initialize database
schoolModel.initialize().catch(console.error);

module.exports = app;