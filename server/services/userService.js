const { User, Review, ReviewImage, Merchant, Favorite, Reservation, Sequelize } = require('../models');

const { Op } = Sequelize;

class UserService {
  async getProfile(userId) {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'phone', 'nickname', 'avatar', 'role', 'status', 'created_at']
    });
    if (!user) {
      const err = new Error('用户不存在');
      err.statusCode = 404;
      throw err;
    }
    return user;
  }

  async updateProfile(userId, data) {
    const user = await User.findByPk(userId);
    if (!user) {
      const err = new Error('用户不存在');
      err.statusCode = 404;
      throw err;
    }
    const allowedFields = ['nickname', 'avatar'];
    const updateData = {};
    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    });
    await user.update(updateData);
    return await this.getProfile(userId);
  }

  async getMyReviews(userId, page = 1, pageSize = 10) {
    const offset = (page - 1) * pageSize;
    const { count, rows } = await Review.findAndCountAll({
      where: { user_id: userId },
      include: [
        {
          model: Merchant,
          as: 'merchant',
          attributes: ['id', 'name', 'images']
        },
        {
          model: ReviewImage,
          as: 'images',
          attributes: ['id', 'url', 'sort']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: pageSize,
      offset
    });
    return {
      list: rows,
      total: count,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    };
  }

  async getMyFavorites(userId, page = 1, pageSize = 10) {
    const offset = (page - 1) * pageSize;
    const { count, rows } = await Favorite.findAndCountAll({
      where: { user_id: userId },
      include: [
        {
          model: Merchant,
          as: 'merchant',
          where: { status: 'approved' },
          include: [{ model: require('../models').Category, as: 'category', attributes: ['id', 'name'] }]
        }
      ],
      order: [['created_at', 'DESC']],
      limit: pageSize,
      offset
    });
    return {
      list: rows,
      total: count,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    };
  }

  async getMyReservations(userId, page = 1, pageSize = 10) {
    const offset = (page - 1) * pageSize;
    const { count, rows } = await Reservation.findAndCountAll({
      where: { user_id: userId },
      include: [
        {
          model: Merchant,
          as: 'merchant',
          attributes: ['id', 'name', 'images', 'address', 'phone']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: pageSize,
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

module.exports = new UserService();
