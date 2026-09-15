const { Review, ReviewImage, ReviewLike, Merchant, Sequelize } = require('../models');
const merchantService = require('./merchantService');

const { Op } = Sequelize;

class ReviewService {
  async createReview(userId, { merchantId, rating, content, images = [] }) {
    const ratingNum = parseInt(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      const err = new Error('评分必须在1-5之间');
      err.statusCode = 400;
      throw err;
    }

    if (content && content.length > 1000) {
      const err = new Error('评论内容不能超过1000字');
      err.statusCode = 400;
      throw err;
    }

    if (images && images.length > 3) {
      const err = new Error('评论图片最多3张');
      err.statusCode = 400;
      throw err;
    }

    const merchant = await Merchant.findByPk(merchantId);
    if (!merchant) {
      const err = new Error('商户不存在');
      err.statusCode = 404;
      throw err;
    }

    const transaction = await require('../models').sequelize.transaction();

    try {
      const review = await Review.create({
        merchant_id: merchantId,
        user_id: userId,
        rating: ratingNum,
        content: content || ''
      }, { transaction });

      if (images && images.length > 0) {
        const reviewImages = images.map((url, index) => ({
          review_id: review.id,
          url,
          sort: index
        }));
        await ReviewImage.bulkCreate(reviewImages, { transaction });
      }

      await transaction.commit();

      await merchantService.updateMerchantRating(merchantId);

      return await Review.findByPk(review.id, {
        include: [
          { model: ReviewImage, as: 'images', attributes: ['id', 'url', 'sort'] }
        ]
      });
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async toggleLike(reviewId, userId) {
    const review = await Review.findByPk(reviewId);
    if (!review) {
      const err = new Error('评论不存在');
      err.statusCode = 404;
      throw err;
    }

    const existing = await ReviewLike.findOne({
      where: { review_id: reviewId, user_id: userId }
    });

    if (existing) {
      await existing.destroy();
      return { liked: false };
    } else {
      await ReviewLike.create({ review_id: reviewId, user_id: userId });
      return { liked: true };
    }
  }

  async removeReview(id, handlerId) {
    const review = await Review.findByPk(id);
    if (!review) {
      const err = new Error('评论不存在');
      err.statusCode = 404;
      throw err;
    }

    await review.update({ status: 'removed' });
    await merchantService.updateMerchantRating(review.merchant_id);
    return review;
  }

  async getAdminReviewList({ keyword, merchantId, status, page = 1, pageSize = 10 }) {
    const offset = (page - 1) * pageSize;
    const where = {};

    if (keyword) {
      where.content = { [Op.like]: `%${keyword}%` };
    }

    if (merchantId) {
      where.merchant_id = merchantId;
    }

    if (status) {
      where.status = status;
    }

    const { count, rows } = await Review.findAndCountAll({
      where,
      include: [
        {
          model: Merchant,
          as: 'merchant',
          attributes: ['id', 'name']
        },
        {
          model: require('../models').User,
          as: 'user',
          attributes: ['id', 'phone', 'nickname']
        },
        {
          model: ReviewImage,
          as: 'images',
          attributes: ['id', 'url']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(pageSize),
      offset
    });

    return {
      list: rows,
      total: count,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    };
  }
}

module.exports = new ReviewService();
