<template>
  <div class="merchant-dashboard">
    <h2 class="page-title">数据概览</h2>
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon primary"><el-icon><View /></el-icon></div>
          <div class="stat-info">
            <div class="stat-value">1,256</div>
            <div class="stat-label">总浏览量</div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon success"><el-icon><ChatDotRound /></el-icon></div>
          <div class="stat-info">
            <div class="stat-value">328</div>
            <div class="stat-label">评价数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon warning"><el-icon><Calendar /></el-icon></div>
          <div class="stat-info">
            <div class="stat-value">86</div>
            <div class="stat-label">预约数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon danger"><el-icon><Star /></el-icon></div>
          <div class="stat-info">
            <div class="stat-value">4.8</div>
            <div class="stat-label">平均评分</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="charts-row">
      <el-col :md="16">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span>近30天趋势</span>
            </div>
          </template>
          <div class="chart-placeholder">
            <el-empty description="图表开发中..." />
          </div>
        </el-card>
      </el-col>
      <el-col :md="8">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span>最新评价</span>
              <el-button type="primary" link>查看全部</el-button>
            </div>
          </template>
          <div class="review-list">
            <EmptyState description="暂无最新评价" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { View, ChatDotRound, Calendar, Star } from '@element-plus/icons-vue'
import EmptyState from '@/components/EmptyState.vue'
</script>

<style lang="scss" scoped>
.merchant-dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-title {
  font-size: 22px;
  font-weight: 600;
  margin: 0;
}

.stats-row {
  display: flex;
}

.stat-card :deep(.el-card__body) {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #fff;

  &.primary {
    background: linear-gradient(135deg, #409eff, #66b1ff);
  }
  &.success {
    background: linear-gradient(135deg, #67c23a, #85ce61);
  }
  &.warning {
    background: linear-gradient(135deg, #e6a23c, #ebb563);
  }
  &.danger {
    background: linear-gradient(135deg, #f56c6c, #f78989);
  }
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-value {
  font-size: 26px;
  font-weight: 700;
  color: #303133;
}

.stat-label {
  font-size: 13px;
  color: #909399;
}

.charts-row {
  display: flex;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.chart-placeholder {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.review-list {
  min-height: 300px;
}
</style>
