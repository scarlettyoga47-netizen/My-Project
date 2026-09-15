const { MerchantApplication, User, Category, Merchant, Sequelize } = require('../models');

const { Op } = Sequelize;

class MerchantApplicationService {
  async createApplication(userId, data) {
    const existing = await MerchantApplication.findOne({
      where: {
        user_id: userId,
        status: 'pending'
      }
    });

    if (existing) {
      const err = new Error('您已有一个待审核的商户申请');
      err.statusCode = 400;
      throw err;
    }

    const requiredFields = ['category_id', 'name', 'address'];
    for (const field of requiredFields) {
      if (!data[field]) {
        const err = new Error(`${field} 为必填项`);
        err.statusCode = 400;
        throw err;
      }
    }

    const category = await Category.findByPk(data.category_id);
    if (!category) {
      const err = new Error('分类不存在');
      err.statusCode = 404;
      throw err;
    }

    return await MerchantApplication.create({
      user_id: userId,
      category_id: data.category_id,
      name: data.name,
      description: data.description || '',
      address: data.address,
      phone: data.phone || '',
      images: data.images || [],
      business_hours: data.business_hours || ''
    });
  }

  async getMyApplication(userId) {
    return await MerchantApplication.findOne({
      where: { user_id: userId },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }
      ],
      order: [['created_at', 'DESC']]
    });
  }

  async getApplicationList({ status, page = 1, pageSize = 10 }) {
    const offset = (page - 1) * pageSize;
    const where = {};
    if (status) {
      where.status = status;
    }

    const { count, rows } = await MerchantApplication.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'phone', 'nickname']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: User,
          as: 'reviewer',
          attributes: ['id', 'nickname']
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

  async approveApplication(id, reviewerId) {
    const application = await MerchantApplication.findByPk(id);
    if (!application) {
      const err = new Error('申请不存在');
      err.statusCode = 404;
      throw err;
    }

    if (application.status !== 'pending') {
      const err = new Error('只能审核待处理的申请');
      err.statusCode = 400;
      throw err;
    }

    const transaction = await require('../models').sequelize.transaction();

    try {
      await Merchant.create({
        user_id: application.user_id,
        category_id: application.category_id,
        name: application.name,
        description: application.description,
        address: application.address,
        phone: application.phone,
        images: application.images,
        business_hours: application.business_hours,
        status: 'approved'
      }, { transaction });

      await User.update(
        { role: 'merchant' },
        { where: { id: application.user_id }, transaction }
      );

      await application.update({
        status: 'approved',
        reviewer_id: reviewerId,
        reviewed_at: new Date()
      }, { transaction });

      await transaction.commit();
      return application;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async rejectApplication(id, reviewerId, rejectReason) {
    if (!rejectReason || !rejectReason.trim()) {
      const err = new Error('驳回原因为必填项');
      err.statusCode = 400;
      throw err;
    }

    const application = await MerchantApplication.findByPk(id);
    if (!application) {
      const err = new Error('申请不存在');
      err.statusCode = 404;
      throw err;
    }

    if (application.status !== 'pending') {
      const err = new Error('只能审核待处理的申请');
      err.statusCode = 400;
      throw err;
    }

    await application.update({
      status: 'rejected',
      reviewer_id: reviewerId,
      reviewed_at: new Date(),
      reject_reason: rejectReason
    });

    return application;
  }
}

module.exports = new MerchantApplicationService();
