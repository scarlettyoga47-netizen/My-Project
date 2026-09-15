<template>
  <div class="category-manage">
    <div class="page-header">
      <h2 class="page-title">分类管理</h2>
    </div>
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>全部分类</span>
          <el-button type="primary">
            <el-icon><Plus /></el-icon>
            新增分类
          </el-button>
        </div>
      </template>
      <EmptyState description="暂无分类数据" />
    </el-card>
  </div>
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue'
import EmptyState from '@/components/EmptyState.vue'
</script>

<style lang="scss" scoped>
.category-manage {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-title {
  font-size: 22px;
  font-weight: 600;
  margin: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}
</style>
