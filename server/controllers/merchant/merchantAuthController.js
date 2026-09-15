const asyncHandler = require('express-async-handler');
const { success, fail } = require('../../utils/response');
const merchantService = require('../../services/merchantService');
const reservationService = require('../../services/reservationService');

const getMyMerchant = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const merchant = await merchantService.getMerchantByUserId(userId);
  success(res, merchant, '获取成功');
});

const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const merchant = await merchantService.updateMerchantByUserId(userId, req.body);
  success(res, merchant, '更新成功');
});

const getReservations = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { status, page = 1, pageSize = 10 } = req.query;

  const merchant = await merchantService.getMerchantByUserId(userId);
  if (!merchant) {
    return fail(res, '商户不存在', 404);
  }

  const result = await reservationService.getMerchantReservations(merchant.id, status, page, pageSize);
  success(res, result, '获取成功');
});

const updateReservationStatus = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return fail(res, '状态不能为空', 400);
  }

  const result = await reservationService.updateReservationStatus(parseInt(id), userId, status);
  success(res, result, '状态更新成功');
});

module.exports = {
  getMyMerchant,
  updateProfile,
  getReservations,
  updateReservationStatus
};
