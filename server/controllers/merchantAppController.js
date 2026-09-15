const asyncHandler = require('express-async-handler');
const { success, fail } = require('../utils/response');
const merchantApplicationService = require('../services/merchantApplicationService');

const create = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const application = await merchantApplicationService.createApplication(userId, req.body);
  success(res, application, '申请提交成功');
});

const getMine = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const application = await merchantApplicationService.getMyApplication(userId);
  success(res, application, '获取成功');
});

module.exports = {
  create,
  getMine
};
