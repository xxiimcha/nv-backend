const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Assuming you have a User model
const Admin = require('../models/Admin'); // NEW: Import Admin model

const { upload, firebaseUploadMiddleware } = require('../middleware/firebaseUpload');

// Get admin details by ID
router.get('/admin/:id', async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select('firstName lastName role');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.status(200).json(admin);
  } catch (error) {
    console.error(`Error fetching admin with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error fetching admin', error });
  }
});


// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

// Get a specific user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      console.log(`User with ID ${req.params.id} not found`);
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(`Error fetching user with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error fetching user', error });
  }
});

// Update a specific user by ID
router.put('/:id', upload.single('photo'), firebaseUploadMiddleware, async (req, res) => {
  try {
    console.log(`Received PUT request to update user with ID ${req.params.id}`);
    console.log('Request body:', req.body);

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body, // This now includes the Firebase URL from the middleware
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      console.log(`User with ID ${req.params.id} not found for updating`);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(`User with ID ${req.params.id} updated successfully`);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(`Error updating user with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error updating user', error });
  }
});

// Change password for a specific user without bcrypt
router.put('/:id/change-password', async (req, res) => {
  try {
      const userId = req.params.id;
      console.log(`Received request to change password for user with ID ${userId}`);

      const { currentPassword, newPassword } = req.body;

      // Fetch the user from the database
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Verify current password (plain text comparison)
      if (user.password !== currentPassword) {
          return res.status(400).json({ message: 'Incorrect current password' });
      }

      // Update the password
      user.password = newPassword;
      await user.save();

      // Respond with success
      res.status(200).json({ message: 'Password changed successfully' });

  } catch (error) {
      console.error(`Error changing password for user with ID ${userId}:`, error);
      res.status(500).json({ message: 'Error changing password', error });
  }
});

// Logout user and set their status to offline
router.post('/:id/logout', async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(`Received request to log out user with ID ${userId}`);

    // Find the user and update their status to offline
    const user = await User.findByIdAndUpdate(
      userId,
      { status: 'offline' },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(`User with ID ${userId} logged out successfully and status set to offline`);
    res.status(200).json({ message: 'User logged out successfully', user });
  } catch (error) {
    console.error(`Error logging out user with ID ${userId}:`, error);
    res.status(500).json({ message: 'Error logging out', error });
  }
});

module.exports = router;
