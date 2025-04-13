const multer = require('multer');
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

// Initialize Firebase
initializeApp({
  credential: applicationDefault(), // Make sure your Firebase SDK is properly set up
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // Set your Firebase bucket in .env
});

// Configure multer to store files in memory
const upload = multer({
  storage: multer.memoryStorage(),
});

// Firebase upload middleware
const firebaseUploadMiddleware = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const bucket = getStorage().bucket();
  const file = req.file;
  const uniqueFileName = `users/${Date.now()}_${file.originalname}`;

  const firebaseFile = bucket.file(uniqueFileName);
  const stream = firebaseFile.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });

  stream.on('error', (err) => {
    console.error('Error uploading to Firebase:', err);
    return res.status(500).json({ message: 'Failed to upload image' });
  });

  stream.on('finish', async () => {
    await firebaseFile.makePublic(); // Make the file publicly accessible
    const firebaseUrl = `https://storage.googleapis.com/${bucket.name}/${firebaseFile.name}`;
    req.body.photo = firebaseUrl; // Attach Firebase URL to request body
    next();
  });

  stream.end(file.buffer);
};

module.exports = { upload, firebaseUploadMiddleware };
