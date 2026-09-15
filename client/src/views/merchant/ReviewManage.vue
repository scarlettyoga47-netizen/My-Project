<template>
  <div class="review-manage">
    <div class="page-header">
      <h2 class="page-title">评价管理</h2>
    </div>
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索评价内容"
            style="width: 240px"
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </template>
      <EmptyState description="暂无评价数据" />
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import EmptyState from '@/components/EmptyState.vue'

const searchKeyword = ref('')
</script>

<style lang="scss" scoped>
.review-manage {
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
}
</style>
