const asyncHandler = require('express-async-handler');
const { success } = require('../utils/response');
const userService = require('../services/userService');

const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const user = await userService.getProfile(userId);
  success(res, user, '获取成功');
});

const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const user = await userService.updateProfile(userId, req.body);
  success(res, user, '更新成功');
});

const getMyReviews = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { page = 1, pageSize = 10 } = req.query;
  const result = await userService.getMyReviews(userId, page, pageSize);
  success(res, result, '获取成功');
});

const getMyFavorites = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { page = 1, pageSize = 10 } = req.query;
  const result = await userService.getMyFavorites(userId, page, pageSize);
  success(res, result, '获取成功');
});

const getMyReservations = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { page = 1, pageSize = 10 } = req.query;
  const result = await userService.getMyReservations(userId, page, pageSize);
  success(res, result, '获取成功');
});

module.exports = {
  getProfile,
  updateProfile,
  getMyReviews,
  getMyFavorites,
  getMyReservations
};
