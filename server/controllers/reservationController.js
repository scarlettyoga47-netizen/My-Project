const asyncHandler = require('express-async-handler');
const { success, fail } = require('../utils/response');
const reservationService = require('../services/reservationService');

const create = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { merchantId, date, timeSlot, contactPhone, remark } = req.body;

  if (!merchantId || !date || !timeSlot || !contactPhone) {
    return fail(res, '商户ID、日期、时段、联系电话为必填项', 400);
  }

  const reservation = await reservationService.createReservation(userId, {
    merchantId: parseInt(merchantId),
    date,
    timeSlot,
    contactPhone,
    remark
  });
  success(res, reservation, '预约成功');
});

const list = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { page = 1, pageSize = 10 } = req.query;
  const result = await reservationService.getUserReservations(userId, page, pageSize);
  success(res, result, '获取成功');
});

module.exports = {
  create,
  list
};
