const asyncHandler = require('express-async-handler');
const { success } = require('../utils/response');
const merchantService = require('../services/merchantService');
const favoriteService = require('../services/favoriteService');
const reservationService = require('../services/reservationService');

const list = asyncHandler(async (req, res) => {
  const { categoryId, keyword, minRating, page = 1, pageSize = 10, sortBy } = req.query;
  const result = await merchantService.getMerchantList({
    categoryId,
    keyword,
    minRating,
    page,
    pageSize,
    sortBy
  });
  success(res, result, '获取成功');
});

const detail = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const merchant = await merchantService.getMerchantDetail(id);
  success(res, merchant, '获取成功');
});

const reviews = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { page = 1, pageSize = 10 } = req.query;
  const currentUserId = req.user ? req.user.id : null;
  const result = await merchantService.getMerchantReviews(id, page, currentUserId, pageSize);
  success(res, result, '获取成功');
});

const availableSlots = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { date } = req.query;
  if (!date) {
    return fail(res, '日期不能为空', 400);
  }
  const slots = await reservationService.getAvailableSlots(id, date);
  success(res, slots, '获取成功');
});

const isFavorited = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user ? req.user.id : null;
  const favorited = await favoriteService.isFavorited(userId, parseInt(id));
  success(res, { favorited }, '获取成功');
});

const { fail } = require('../utils/response');

module.exports = {
  list,
  detail,
  reviews,
  availableSlots,
  isFavorited
};
