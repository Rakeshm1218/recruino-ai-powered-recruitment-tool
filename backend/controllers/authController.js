const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');


exports.register = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const token = jwt.sign({ id: user._id }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn
    });

    res.status(201).json({ success: true , token});
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    const token = jwt.sign({ id: user._id }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn
    });

    res.status(200).json({ success: true, token });
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};