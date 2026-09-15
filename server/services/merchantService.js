const { Merchant, Category, Review, ReviewImage, ReviewLike, User, Sequelize, Reservation, Favorite } = require('../models');

const { Op, fn, col, literal } = Sequelize;

class MerchantService {
  async getMerchantList({ categoryId, keyword, minRating, page = 1, pageSize = 10, sortBy = 'newest' }) {
    const offset = (page - 1) * pageSize;
    const where = { status: 'approved' };

    if (categoryId) {
      where.category_id = categoryId;
    }

    if (keyword) {
      where[Op.or] = [
        { name: { [Op.like]: `%${keyword}%` } },
        { address: { [Op.like]: `%${keyword}%` } }
      ];
    }

    if (minRating) {
      where.rating = { [Op.gte]: parseFloat(minRating) };
    }

    let order = [];
    if (sortBy === 'rating_desc') {
      order = [['rating', 'DESC'], ['created_at', 'DESC']];
    } else if (sortBy === 'newest') {
      order = [['created_at', 'DESC']];
    } else {
      order = [['created_at', 'DESC']];
    }

    const { count, rows } = await Merchant.findAndCountAll({
      where,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'icon']
        }
      ],
      order,
      limit: parseInt(pageSize),
      offset
    });

    const formattedRows = rows.map(merchant => {
      const m = merchant.toJSON();
      m.rating = parseFloat(m.rating).toFixed(1);
      return m;
    });

    return {
      list: formattedRows,
      total: count,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    };
  }

  async getMerchantDetail(id) {
    const merchant = await Merchant.findByPk(id, {
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'icon']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nickname', 'avatar', 'phone']
        }
      ]
    });

    if (!merchant) {
      const err = new Error('商户不存在');
      err.statusCode = 404;
      throw err;
    }

    const result = merchant.toJSON();
    result.rating = parseFloat(result.rating).toFixed(1);
    return result;
  }

  async getMerchantReviews(id, page = 1, currentUserId = null, pageSize = 10) {
    const offset = (page - 1) * pageSize;

    const { count, rows } = await Review.findAndCountAll({
      where: {
        merchant_id: id,
        status: 'normal'
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nickname', 'avatar']
        },
        {
          model: ReviewImage,
          as: 'images',
          attributes: ['id', 'url', 'sort'],
          order: [['sort', 'ASC']]
        }
      ],
      attributes: {
        include: [
          [
            literal(`(SELECT COUNT(*) FROM review_likes WHERE review_likes.review_id = Review.id)`),
            'likeCount'
          ],
          currentUserId
            ? [
                literal(`(SELECT COUNT(*) FROM review_likes WHERE review_likes.review_id = Review.id AND review_likes.user_id = ${currentUserId})`),
                'isLiked'
              ]
            : [literal('0'), 'isLiked']
        ]
      },
      order: [['created_at', 'DESC']],
      limit: parseInt(pageSize),
      offset
    });

    const formattedRows = rows.map(row => {
      const r = row.toJSON();
      r.likeCount = parseInt(r.likeCount) || 0;
      r.isLiked = parseInt(r.isLiked) > 0 ? true : false;
      return r;
    });

    return {
      list: formattedRows,
      total: count,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    };
  }

  async updateMerchantRating(merchantId) {
    const result = await Review.findOne({
      where: {
        merchant_id: merchantId,
        status: 'normal'
      },
      attributes: [
        [fn('AVG', col('rating')), 'avgRating'],
        [fn('COUNT', col('id')), 'reviewCount']
      ],
      raw: true
    });

    const avgRating = result.avgRating ? parseFloat(result.avgRating) : 0;
    const reviewCount = result.reviewCount ? parseInt(result.reviewCount) : 0;

    await Merchant.update(
      {
        rating: avgRating.toFixed(1),
        review_count: reviewCount
      },
      { where: { id: merchantId } }
    );
  }

  async getMerchantByUserId(userId) {
    return await Merchant.findOne({
      where: { user_id: userId },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }
      ]
    });
  }

  async updateMerchantByUserId(userId, data) {
    const merchant = await Merchant.findOne({ where: { user_id: userId } });
    if (!merchant) {
      const err = new Error('商户不存在');
      err.statusCode = 404;
      throw err;
    }

    if (merchant.status !== 'approved') {
      const err = new Error('商户状态不允许编辑');
      err.statusCode = 400;
      throw err;
    }

    const allowedFields = ['name', 'description', 'address', 'phone', 'images', 'business_hours', 'category_id'];
    const updateData = {};
    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    });

    await merchant.update(updateData);
    return await this.getMerchantByUserId(userId);
  }

  async getAdminMerchantList({ status, page = 1, pageSize = 10 }) {
    const offset = (page - 1) * pageSize;
    const where = {};
    if (status) {
      where.status = status;
    }

    const { count, rows } = await Merchant.findAndCountAll({
      where,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'phone', 'nickname']
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

  async updateMerchantStatus(id, status) {
    const merchant = await Merchant.findByPk(id);
    if (!merchant) {
      const err = new Error('商户不存在');
      err.statusCode = 404;
      throw err;
    }

    if (!['pending', 'approved', 'rejected', 'closed'].includes(status)) {
      const err = new Error('无效的状态值');
      err.statusCode = 400;
      throw err;
    }

    await merchant.update({ status });
    return merchant;
  }
}

module.exports = new MerchantService();
