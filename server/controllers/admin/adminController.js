const asyncHandler = require('express-async-handler');
const { success, fail } = require('../../utils/response');
const merchantApplicationService = require('../../services/merchantApplicationService');
const reviewService = require('../../services/reviewService');
const merchantService = require('../../services/merchantService');

const getApplications = asyncHandler(async (req, res) => {
  const { status, page = 1, pageSize = 10 } = req.query;
  const result = await merchantApplicationService.getApplicationList({ status, page, pageSize });
  success(res, result, '获取成功');
});

const approveApplication = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const reviewerId = req.user.id;
  const result = await merchantApplicationService.approveApplication(parseInt(id), reviewerId);
  success(res, result, '审核通过成功');
});

const rejectApplication = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const reviewerId = req.user.id;
  const { rejectReason } = req.body;

  if (!rejectReason) {
    return fail(res, '驳回原因为必填项', 400);
  }

  const result = await merchantApplicationService.rejectApplication(parseInt(id), reviewerId, rejectReason);
  success(res, result, '审核驳回成功');
});

const getReviews = asyncHandler(async (req, res) => {
  const { keyword, merchantId, status, page = 1, pageSize = 10 } = req.query;
  const result = await reviewService.getAdminReviewList({ keyword, merchantId, status, page, pageSize });
  success(res, result, '获取成功');
});

const removeReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const handlerId = req.user.id;
  const result = await reviewService.removeReview(parseInt(id), handlerId);
  success(res, result, '评论下架成功');
});

const getMerchants = asyncHandler(async (req, res) => {
  const { status, page = 1, pageSize = 10 } = req.query;
  const result = await merchantService.getAdminMerchantList({ status, page, pageSize });
  success(res, result, '获取成功');
});

const updateMerchantStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return fail(res, '状态不能为空', 400);
  }

  const result = await merchantService.updateMerchantStatus(parseInt(id), status);
  success(res, result, '状态更新成功');
});

module.exports = {
  getApplications,
  approveApplication,
  rejectApplication,
  getReviews,
  removeReview,
  getMerchants,
  updateMerchantStatus
};
