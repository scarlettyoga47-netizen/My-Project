const { fail } = require('../utils/response');
const { ValidationError } = require('sequelize');
const Joi = require('joi');

function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  if (Joi.isError(err)) {
    const messages = err.details.map(d => d.message).join(', ');
    return fail(res, messages, 400);
  }

  if (err instanceof ValidationError) {
    const messages = err.errors.map(e => e.message).join(', ');
    return fail(res, messages, 400);
  }

  if (err.name === 'JsonWebTokenError') {
    return fail(res, '无效的Token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return fail(res, 'Token已过期', 401);
  }

  if (err.statusCode || err.code) {
    return fail(res, err.message || '请求错误', err.statusCode || err.code);
  }

  return fail(res, err.message || '服务器内部错误', 500);
}

module.exports = errorHandler;
