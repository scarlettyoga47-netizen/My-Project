<template>
  <div class="admin-dashboard">
    <h2 class="page-title">数据概览</h2>
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon primary"><el-icon><User /></el-icon></div>
          <div class="stat-info">
            <div class="stat-value">12,586</div>
            <div class="stat-label">用户总数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon success"><el-icon><Shop /></el-icon></div>
          <div class="stat-info">
            <div class="stat-value">686</div>
            <div class="stat-label">商户总数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon warning"><el-icon><ChatDotRound /></el-icon></div>
          <div class="stat-info">
            <div class="stat-value">28,394</div>
            <div class="stat-label">评价总数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon danger"><el-icon><Calendar /></el-icon></div>
          <div class="stat-info">
            <div class="stat-value">5,672</div>
            <div class="stat-label">预约总数</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="charts-row">
      <el-col :md="16">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span>平台数据趋势</span>
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
              <span>商户分类统计</span>
            </div>
          </template>
          <div class="chart-placeholder">
            <el-empty description="图表开发中..." />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { User, Shop, ChatDotRound, Calendar } from '@element-plus/icons-vue'
</script>

<style lang="scss" scoped>
.admin-dashboard {
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
</style>
