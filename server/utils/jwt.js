const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn } = require('../config');

function sign(payload) {
  return jwt.sign(payload, jwtSecret, {
    expiresIn: jwtExpiresIn
  });
}

function verify(token) {
  try {
    return jwt.verify(token, jwtSecret);
  } catch (err) {
    return null;
  }
}

module.exports = {
  sign,
  verify
};
