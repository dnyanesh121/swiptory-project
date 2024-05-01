const jwt = require("jsonwebtoken");
require("dotenv").config();

const isAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  // Verify token
  
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      req.user = null;
      return res.status(403).json("Token is not valid!");
    } else {
      req.user = user;
    }

    next();
  });
};

module.exports = { isAuth };
