const { JWT_SECRET } = require('../config');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const {
  UserLoginSerializer,
  UserRegisterSerializer,
  UserSerializer
} = require('../serializers/users');

const signup = async (req, res, next) => {
  try {
    const serializer = UserRegisterSerializer.getSerializer(req.body);
    const validatedData = await serializer.is_valid();
    const userInstance = await serializer.create(validatedData);
    const token = jwt.sign(
      {
        email: userInstance.email,
        userId: userInstance._id.toString()
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.status(201).json({
      token: token,
      user: UserSerializer.getSerializer(userInstance).data,
    });
  }
  catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};


const login = async (req, res, next) => {
  try {
    console.log(req.body);
    const serializer = UserLoginSerializer.getSerializer(req.body);
    const user = await serializer.is_valid();

    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString()
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      token: token,
      user: UserSerializer.getSerializer(user).data
    });
  }
  catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

const getUser = (req, res, next) => {
  res.status(200).json({
    user: UserSerializer.getSerializer(req.user.toObject()).data,
  });
};

const getUserByUsername = async (req, res, next) => {
  try {
    const username = req.query.username;
    const docs = await User.find({ username: { $regex: username } });
    const matches = docs.map((doc) => {
      return {
        _id: doc._id,
        username: doc.username,
        name: `${doc.firstName} ${doc.lastName}`,
      };
    });
    res.status(200).json({
      matches: matches,
      count: docs.length,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.signup = signup;
exports.login = login;
exports.getUser = getUser;
exports.getUserByUsername = getUserByUsername;