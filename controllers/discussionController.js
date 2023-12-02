const Discussion = require('../models/discussion');

module.exports = {
  createDiscussion: async (req, res) => {
    const { title, content, category } = req.body;
    const userId = req.user._id; // Assuming user ID is stored in req.user

    try {
      const newDiscussion = new Discussion({
        title,
        content,
        category,
        user: userId,
      });

      const savedDiscussion = await newDiscussion.save();
      res.status(201).json(savedDiscussion);
    } catch (error) {
      console.error('Error creating discussion:', error.message);
      res.status(500).json({ message: 'Server Error' });
    }
  },

  getDiscussions: async (req, res) => {
    try {
      const discussions = await Discussion.find().populate('user', 'username'); // Populate user details
      res.status(200).json(discussions);
    } catch (error) {
      console.error('Error getting discussions:', error.message);
      res.status(500).json({ message: 'Server Error' });
    }
  },

  updateDiscussion: async (req, res) => {
    const discussionId = req.params.id;
    const { title, content } = req.body;

    try {
      const updatedDiscussion = await Discussion.findByIdAndUpdate(
        discussionId,
        { title, content },
        { new: true }
      );

      if (!updatedDiscussion) {
        return res.status(404).json({ message: 'Discussion not found' });
      }

      res.status(200).json(updatedDiscussion);
    } catch (error) {
      console.error('Error updating discussion:', error.message);
      res.status(500).json({ message: 'Server Error' });
    }
  },

  deleteDiscussion: async (req, res) => {
    const discussionId = req.params.id;

    try {
      const deletedDiscussion = await Discussion.findByIdAndDelete(discussionId);

      if (!deletedDiscussion) {
        return res.status(404).json({ message: 'Discussion not found' });
      }

      res.status(200).json({ message: 'Discussion deleted successfully' });
    } catch (error) {
      console.error('Error deleting discussion:', error.message);
      res.status(500).json({ message: 'Server Error' });
    }
  },
};
