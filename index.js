const express = require('express');
const cors = require("cors");
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const { communityDiscRoute } = require("./routes/communitydiscussion");
const { discussionPostRoute } = require("./routes/discussion");
const { bookReviewRoute } = require("./routes/review");
const { readingListRoute } = require("./routes/readingList");
require('dotenv').config();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/auth', authRoutes);
app.use('/api', bookRoutes);
app.use("/community", communityDiscRoute);
app.use("/posts", discussionPostRoute);
app.use("/review", bookReviewRoute);
app.use("/reading-lists", readingListRoute);

app.get("/", (req, res)=>{
    res.status(200).send("Welcome to BOOKHUBX_Backend")
})
// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

