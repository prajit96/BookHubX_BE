const ReadingList = require('../models/readingList');

module.exports = {
  createReadingList: async (req, res) => {
    const { name, books } = req.body;
    const userId = req.user._id; // Assuming user ID is stored in req.user

    try {
      const newReadingList = new ReadingList({
        name,
        books,
        user: userId,
      });

      const savedReadingList = await newReadingList.save();
      res.status(201).json(savedReadingList);
    } catch (error) {
      console.error('Error creating reading list:', error.message);
      res.status(500).json({ message: 'Server Error' });
    }
  },

  getReadingLists: async (req, res) => {
    const userId = req.user._id; // Assuming user ID is stored in req.user

    try {
      const readingLists = await ReadingList.find({ user: userId }).populate('books'); // Populate book details
      res.status(200).json(readingLists);
    } catch (error) {
      console.error('Error getting reading lists:', error.message);
      res.status(500).json({ message: 'Server Error' });
    }
  },
};
