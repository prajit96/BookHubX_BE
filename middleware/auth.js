const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  console.log("token==", token);
  if (!token) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded) {
      req.body.userID = decoded.userID;
      req.body.username = decoded.username;
      next();
    } else {
      res.status(401).json({ message: "Invalid token" });
    }
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

const adminMiddleware = (req, res, next) => {
  const user = req.user;
  console.log("adminuser==", user);
  if (!user || !user.roles.includes('admin')) {
    return res.status(403).json({ message: 'Permission denied. Admin access required.' });
  }

  // User is an admin, allow access
  next();
};

module.exports = authMiddleware, adminMiddleware;
