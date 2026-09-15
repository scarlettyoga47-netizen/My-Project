const asyncHandler = require('express-async-handler');
const { success, fail } = require('../utils/response');
const authService = require('../services/authService');

const sendCode = asyncHandler(async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return fail(res, '手机号不能为空', 400);
  }
  const result = await authService.sendCode(phone);
  success(res, result, '验证码发送成功');
});

const login = asyncHandler(async (req, res) => {
  const { phone, code } = req.body;
  if (!phone || !code) {
    return fail(res, '手机号和验证码不能为空', 400);
  }
  const result = await authService.login(phone, code);
  success(res, result, '登录成功');
});

const adminLogin = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) {
    return fail(res, '手机号和密码不能为空', 400);
  }
  const result = await authService.adminLogin(phone, password);
  success(res, result, '管理员登录成功');
});

const logout = asyncHandler(async (req, res) => {
  success(res, null, '退出成功');
});

module.exports = {
  sendCode,
  login,
  adminLogin,
  logout
};
