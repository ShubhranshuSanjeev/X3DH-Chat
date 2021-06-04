const jwt = require('jsonwebtoken');
const User = require('../models/users');
const mongoose = require('mongoose');

const { JWT_SECRET } = require('../config');

module.exports = async (req, res, next) => {
  try{
    const authHeader = req.get('Authorization');
    if (!authHeader) {
      const error = new Error('Not authenticated.');
      error.statusCode = 401;
      throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      err.statusCode = 500;
      throw err;
    }
    if (!decodedToken) {
      const error = new Error('Not authenticated.');
      error.statusCode = 401;
      throw error;
    }
    const user = await User.findOne({ _id: mongoose.Types.ObjectId(decodedToken.userId) });
    req.user = user;
    next();

  } catch (err) {
    next(err);
  }
};
