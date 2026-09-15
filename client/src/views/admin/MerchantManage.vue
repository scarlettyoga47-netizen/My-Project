<template>
  <div class="merchant-manage">
    <div class="page-header">
      <h2 class="page-title">商户管理</h2>
    </div>
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索商户名称"
            style="width: 240px"
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <div>
            <el-button type="primary">
              <el-icon><Plus /></el-icon>
              新增商户
            </el-button>
          </div>
        </div>
      </template>
      <EmptyState description="暂无商户数据" />
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import EmptyState from '@/components/EmptyState.vue'

const searchKeyword = ref('')
</script>

<style lang="scss" scoped>
.merchant-manage {
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
