const jwt = require("jsonwebtoken");
require('dotenv').config();
const { JWT_SECRETKEY } = process.env; // Load JWT secret key from environment variable

const fetchUser = (req, res, next) => {
  const token = req.header('auth-token');

  try {
    if (!token) {
      return res.status(401).json({ error: "Please authenticate using a valid token" });
    }

    const decodedToken = jwt.verify(token, JWT_SECRETKEY);
    req.user = decodedToken.user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token expired, please log in again" });
    }
    return res.status(401).json({ error: "Invalid token, please authenticate again" });
  }
};

module.exports = fetchUser;
