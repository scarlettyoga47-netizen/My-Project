const asyncHandler = require('express-async-handler');
const { success, fail } = require('../utils/response');
const reviewService = require('../services/reviewService');
const uploadService = require('../services/uploadService');

const create = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { merchantId, rating, content, images } = req.body;
  if (!merchantId) {
    return fail(res, '商户ID不能为空', 400);
  }
  if (rating === undefined || rating === null) {
    return fail(res, '评分不能为空', 400);
  }
  const review = await reviewService.createReview(userId, {
    merchantId: parseInt(merchantId),
    rating,
    content,
    images: images || []
  });
  success(res, review, '评论发布成功');
});

const toggleLike = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const result = await reviewService.toggleLike(parseInt(id), userId);
  success(res, result, result.liked ? '点赞成功' : '取消点赞成功');
});

const uploadImage = asyncHandler(async (req, res, next) => {
  const upload = uploadService.getMulterConfig().single('file');
  upload(req, res, (err) => {
    if (err) {
      return fail(res, err.message, 400);
    }
    if (!req.file) {
      return fail(res, '请上传图片', 400);
    }
    const url = uploadService.getFileUrl(req.file.filename);
    success(res, { url }, '上传成功');
  });
});

module.exports = {
  create,
  toggleLike,
  uploadImage
};
