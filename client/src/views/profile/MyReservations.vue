<template>
  <div class="my-reservations-page">
    <div class="page-header">
      <h2 class="page-title">我的预约</h2>
      <el-tabs v-model="activeTab" class="status-tabs">
        <el-tab-pane label="全部" name="all" />
        <el-tab-pane label="待确认" name="pending" />
        <el-tab-pane label="已确认" name="confirmed" />
        <el-tab-pane label="已完成" name="completed" />
        <el-tab-pane label="已取消" name="cancelled" />
      </el-tabs>
    </div>
    <EmptyState v-if="list.length === 0" description="暂无预约记录" />
    <div v-else class="reservation-list">
      <div v-for="item in list" :key="item.id" class="reservation-item">
        <div class="item-header">
          <h3 class="merchant-name">{{ item.merchantName }}</h3>
          <el-tag :type="getStatusType(item.status)">{{ getStatusText(item.status) }}</el-tag>
        </div>
        <div class="item-info-row">
          <span>预约时间:</span>
          <span class="info-value">{{ item.date }} {{ item.time }}</span>
        </div>
        <div class="item-info-row">
          <span>人数:</span>
          <span class="info-value">{{ item.peopleCount }}人</span>
        </div>
        <div class="item-info-row" v-if="item.remark">
          <span>备注:</span>
          <span class="info-value">{{ item.remark }}</span>
        </div>
        <div class="item-actions" v-if="item.status === 'pending'">
          <el-button type="primary" size="small">联系商户</el-button>
          <el-button type="danger" size="small">取消预约</el-button>
        </div>
        <div class="item-actions" v-else-if="item.status === 'confirmed'">
          <el-button type="primary" size="small">联系商户</el-button>
          <el-button size="small">去评价</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import EmptyState from '@/components/EmptyState.vue'

const activeTab = ref('all')
const list = ref([])

const statusMap = {
  pending: { text: '待确认', type: 'warning' },
  confirmed: { text: '已确认', type: 'primary' },
  completed: { text: '已完成', type: 'success' },
  cancelled: { text: '已取消', type: 'info' }
}

const getStatusText = (status) => statusMap[status]?.text || status
const getStatusType = (status) => statusMap[status]?.type || 'info'
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.my-reservations-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.status-tabs {
  margin: 0;
}

.reservation-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.reservation-item {
  padding: 20px;
  border: 1px solid $border-lighter;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.merchant-name {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: $text-primary;
}

.item-info-row {
  display: flex;
  gap: 8px;
  font-size: 14px;
  color: $text-secondary;

  .info-value {
    color: $text-regular;
  }
}

.item-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  border-top: 1px solid $border-extra-light;
  padding-top: 12px;
  margin-top: 4px;
}
</style>
