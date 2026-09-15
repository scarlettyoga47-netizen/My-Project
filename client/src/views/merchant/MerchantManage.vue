<template>
  <div class="merchant-manage">
    <div class="page-header">
      <h2 class="page-title">店铺管理</h2>
      <el-button type="primary">
        <el-icon><Edit /></el-icon>
        编辑信息
      </el-button>
    </div>

    <el-card shadow="hover">
      <el-descriptions title="店铺信息" :column="2" border>
        <el-descriptions-item label="店铺名称">悦心餐厅·创意融合菜</el-descriptions-item>
        <el-descriptions-item label="所属分类">美食 / 创意菜</el-descriptions-item>
        <el-descriptions-item label="联系电话">400-888-8888</el-descriptions-item>
        <el-descriptions-item label="营业时间">10:00 - 22:00</el-descriptions-item>
        <el-descriptions-item label="详细地址" :span="2">市中心商业步行街88号</el-descriptions-item>
        <el-descriptions-item label="店铺简介" :span="2">
          悦心餐厅创立于2015年，专注于创意融合菜品的研发与呈现。我们精选当季新鲜食材，结合中西方烹饪技法，为每一位食客带来独特的味觉体验。
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup>
import { Edit } from '@element-plus/icons-vue'
</script>

<style lang="scss" scoped>
.merchant-manage {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 22px;
  font-weight: 600;
  margin: 0;
}
</style>
