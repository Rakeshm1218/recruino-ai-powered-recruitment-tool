require("dotenv").config();

module.exports = {
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRE || "30d",
  refreshExpiresIn: process.env.REFRESH_EXPIRE || "7d",
};
