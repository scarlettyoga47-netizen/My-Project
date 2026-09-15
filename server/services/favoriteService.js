const { Favorite, Merchant, Category } = require('../models');

class FavoriteService {
  async toggleFavorite(userId, merchantId) {
    const merchant = await Merchant.findByPk(merchantId);
    if (!merchant) {
      const err = new Error('商户不存在');
      err.statusCode = 404;
      throw err;
    }

    const existing = await Favorite.findOne({
      where: { user_id: userId, merchant_id: merchantId }
    });

    if (existing) {
      await existing.destroy();
      return { favorited: false };
    } else {
      await Favorite.create({ user_id: userId, merchant_id: merchantId });
      return { favorited: true };
    }
  }

  async isFavorited(userId, merchantId) {
    if (!userId) {
      return false;
    }
    const existing = await Favorite.findOne({
      where: { user_id: userId, merchant_id: merchantId }
    });
    return !!existing;
  }

  async getFavoriteList(userId, page = 1, pageSize = 10) {
    const offset = (page - 1) * pageSize;
    const { count, rows } = await Favorite.findAndCountAll({
      where: { user_id: userId },
      include: [
        {
          model: Merchant,
          as: 'merchant',
          where: { status: 'approved' },
          include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'icon'] }]
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

module.exports = new FavoriteService();
