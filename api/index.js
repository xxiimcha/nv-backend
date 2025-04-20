// api/index.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const serverless = require('serverless-http');
const fs = require('fs');

const app = express();
const uploadDir = './uploads';

// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection (move this URI to environment variable on Vercel for security)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use('/api/auth', require('../routes/auth'));
app.use('/api/events', require('../routes/events'));
app.use('/api/patients', require('../routes/patients'));
app.use('/api/users', require('../routes/users'));
app.use('/api/notifications', require('../routes/notifications'));
app.use('/api/mealplans', require('../routes/mealplans'));
app.use('/api/messages', require('../routes/messages'));
app.use('/api/calls', require('../routes/calls'));

// Export serverless handler
module.exports = serverless(app);
