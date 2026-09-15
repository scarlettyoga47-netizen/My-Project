const { verify } = require('../utils/jwt');
const { fail } = require('../utils/response');
const { Merchant } = require('../models');

function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return fail(res, '未提供认证Token', 401);
  }

  const token = authHeader.slice(7);
  const payload = verify(token);

  if (!payload) {
    return fail(res, '无效或已过期的Token', 401);
  }

  req.user = payload;
  next();
}

function authOptional(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    const payload = verify(token);
    if (payload) {
      req.user = payload;
    }
  }

  next();
}

function requireRole(...roles) {
  return async function (req, res, next) {
    if (!req.user) {
      return fail(res, '请先登录', 401);
    }

    if (roles.includes(req.user.role)) {
      return next();
    }

    if (roles.includes('merchant') && req.user.id) {
      try {
        const merchant = await Merchant.findOne({
          where: { user_id: req.user.id }
        });
        if (merchant) {
          return next();
        }
      } catch (err) {
        console.error('Error checking merchant:', err);
      }
    }

    return fail(res, '权限不足', 403);
  };
}

module.exports = {
  auth,
  authOptional,
  requireRole
};
