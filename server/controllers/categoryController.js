const asyncHandler = require('express-async-handler');
const { success } = require('../utils/response');
const categoryService = require('../services/categoryService');

const list = asyncHandler(async (req, res) => {
  const categories = await categoryService.getAllCategories();
  success(res, categories, '获取成功');
});

module.exports = {
  list
};
