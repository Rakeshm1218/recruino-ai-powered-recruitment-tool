const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");

const signAccessToken = (userId) =>
  jwt.sign({ id: userId }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });

const signRefreshToken = (userId) =>
  jwt.sign({ id: userId, type: "refresh" }, jwtConfig.secret, {
    expiresIn: jwtConfig.refreshExpiresIn,
  });

exports.register = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const token = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);

    res.status(201).json({ success: true, token, refreshToken });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    const token = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);

    res.status(200).json({ success: true, token, refreshToken });
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

exports.refresh = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"] || "";
    const bearerToken = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;
    const tokenFromBody = req.body?.refreshToken;
    const refreshToken = tokenFromBody || bearerToken;

    if (!refreshToken) {
      return next(new ErrorResponse("Refresh token required", 400));
    }

    const payload = jwt.verify(refreshToken, jwtConfig.secret);
    if (payload.type !== "refresh") {
      return next(new ErrorResponse("Invalid refresh token", 401));
    }

    const newAccessToken = signAccessToken(payload.id);
    const newRefreshToken = signRefreshToken(payload.id);

    res
      .status(200)
      .json({
        success: true,
        token: newAccessToken,
        refreshToken: newRefreshToken,
      });
  } catch (err) {
    next(err);
  }
};
