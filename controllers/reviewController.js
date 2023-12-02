const Review = require('../models/review');

module.exports = {
  createReview: async (req, res) => {
    const { bookId, rating, text } = req.body;
    const userId = req.user._id; // Assuming user ID is stored in req.user

    try {
      const newReview = new Review({
        bookId,
        rating,
        text,
        user: userId,
      });

      const savedReview = await newReview.save();
      res.status(201).json(savedReview);
    } catch (error) {
      console.error('Error creating review:', error.message);
      res.status(500).json({ message: 'Server Error' });
    }
  },

  getReviews: async (req, res) => {
    const bookId = req.params.bookId;

    try {
      const reviews = await Review.find({ bookId }).populate('user', 'username'); // Populate user details
      res.status(200).json(reviews);
    } catch (error) {
      console.error('Error getting reviews:', error.message);
      res.status(500).json({ message: 'Server Error' });
    }
  },
};
