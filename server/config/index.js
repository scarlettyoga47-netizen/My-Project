const sequelize = require('./database');

module.exports = {
  sequelize,
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  uploadPath: process.env.UPLOAD_PATH || './uploads'
};
