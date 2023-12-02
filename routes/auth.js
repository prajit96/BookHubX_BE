// auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const generateToken = require('../config/auth');

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
    });

    await newUser.save();

    const token = generateToken(newUser);
    res.status(201).json({ token });
  } catch (error) {
    console.error('Error in signup:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user is admin
    if (username === 'admin@gmail.com' && password === 'admin') {
      const adminUser = {
        username: 'admin@gmail.com',
        role: 'admin',
      };

      const token = generateToken(adminUser);
      return res.status(200).json({ token });
    }

    // If not admin, proceed with regular authentication
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error in login:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get User Profile
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id, { password: 0 });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error getting user profile:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update User Profile
router.put('/profile/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, fields: { password: 0 } }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
