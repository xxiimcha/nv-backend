const express = require('express');
const router = express.Router();
const UserToken = require('../models/UserToken');
const axios = require('axios');

// Save the device token
router.post('/save-token', async (req, res) => {
  const { userId, token } = req.body;

  if (!userId || !token) {
    return res.status(400).json({ message: 'Missing userId or token' });
  }

  try {
    await UserToken.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) }, // Cast here
      { token },
      { upsert: true, new: true }
    );
    res.status(200).json({ message: 'Token saved successfully' });
  } catch (error) {
    console.error('Error saving token:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send a push notification manually (for testing)
router.post('/send-push', async (req, res) => {
  const { userId, title, message } = req.body;

  if (!userId || !title || !message) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const userToken = await UserToken.findOne({ userId });

    if (!userToken) {
      return res.status(404).json({ message: 'No token found for user' });
    }

    const payload = {
      to: userToken.token,
      notification: {
        title,
        body: message,
      },
    };

    await axios.post('https://fcm.googleapis.com/fcm/send', payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `key=${process.env.FCM_SERVER_KEY}`, // ✅ secure in .env
      },
    });

    res.status(200).json({ message: 'Push sent successfully' });
  } catch (error) {
    console.error('Error sending push:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
