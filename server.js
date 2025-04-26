const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config(); // Load environment variables from .env

const app = express();

// Create uploads directory if not exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection using environment variable
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const patientRoutes = require('./routes/patients');
const userRoutes = require('./routes/users');
const notifRoutes = require('./routes/notifications');
const mealPlanRoutes = require('./routes/mealplans');
const messagesRouter = require('./routes/messages');
const callsRouter = require('./routes/calls');

// Apply routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notifRoutes);
app.use('/api/mealplans', mealPlanRoutes);
app.use('/api/messages', messagesRouter);
app.use('/api/calls', callsRouter);

// Basic healthcheck route (optional but recommended)
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// Use dynamic port for Render
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
