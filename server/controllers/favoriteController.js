const asyncHandler = require('express-async-handler');
const { success } = require('../utils/response');
const favoriteService = require('../services/favoriteService');

const toggle = asyncHandler(async (req, res) => {
  const { merchantId } = req.params;
  const userId = req.user.id;
  const result = await favoriteService.toggleFavorite(userId, parseInt(merchantId));
  success(res, result, result.favorited ? '收藏成功' : '取消收藏成功');
});

const list = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { page = 1, pageSize = 10 } = req.query;
  const result = await favoriteService.getFavoriteList(userId, page, pageSize);
  success(res, result, '获取成功');
});

module.exports = {
  toggle,
  list
};
