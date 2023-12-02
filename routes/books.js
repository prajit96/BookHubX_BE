const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/auth')

// Get All Books
router.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    console.error('Error getting books:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Add New Book - Only for Admins
router.post('/books', authMiddleware,adminMiddleware, async (req, res) => {
  try {
    // const user = req.user;
    // console.log("user==", user);
    // if (user.role !== 'admin') {
    //   return res.status(403).json({ message: 'Permission denied' });
    // }

    const newBook = new Book(req.body);
    const savedBook = await newBook.save();
    res.status(201).json({ message: 'Book added successfully', book: savedBook });
  } catch (error) {
    console.error('Error adding new book:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update Book - Only for Admins
router.patch('/books/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const bookId = req.params.id;
    const updatedBook = await Book.findByIdAndUpdate(bookId, req.body, { new: true });

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({ message: 'Book updated successfully', book: updatedBook });
  } catch (error) {
    console.error('Error updating book:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete Book - Only for Admins
router.delete('/books/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const bookId = req.params.id;
    const deletedBook = await Book.findByIdAndDelete(bookId);

    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
