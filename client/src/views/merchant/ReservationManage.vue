<template>
  <div class="reservation-manage">
    <div class="page-header">
      <h2 class="page-title">预约管理</h2>
    </div>
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <el-tabs v-model="activeTab" class="status-tabs">
            <el-tab-pane label="全部" name="all" />
            <el-tab-pane label="待确认" name="pending" />
            <el-tab-pane label="已确认" name="confirmed" />
            <el-tab-pane label="已完成" name="completed" />
            <el-tab-pane label="已取消" name="cancelled" />
          </el-tabs>
        </div>
      </template>
      <EmptyState description="暂无预约数据" />
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import EmptyState from '@/components/EmptyState.vue'

const activeTab = ref('all')
</script>

<style lang="scss" scoped>
.reservation-manage {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-title {
  font-size: 22px;
  font-weight: 600;
  margin: 0;
}

.status-tabs {
  margin: 0;
}
</style>
