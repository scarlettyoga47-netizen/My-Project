const { Category } = require('../models');

class CategoryService {
  async getAllCategories() {
    return await Category.findAll({
      where: { status: 'active' },
      order: [['sort', 'ASC'], ['id', 'ASC']],
      attributes: ['id', 'name', 'icon', 'sort']
    });
  }
}

module.exports = new CategoryService();
