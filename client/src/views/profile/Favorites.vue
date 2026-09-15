<template>
  <div class="favorites-page">
    <div class="page-header">
      <h2 class="page-title">我的收藏</h2>
    </div>
    <EmptyState v-if="list.length === 0" description="暂无收藏的商户">
      <el-button type="primary" @click="goHome">去发现</el-button>
    </EmptyState>
    <div v-else class="favorites-list">
      <div v-for="item in list" :key="item.id" class="favorite-item">
        <img :src="item.cover" :alt="item.name" class="item-cover" />
        <div class="item-info">
          <h3 class="item-name">{{ item.name }}</h3>
          <div class="item-rating">
            <StarRating :model-value="item.rating" readonly />
            <span>{{ item.rating.toFixed(1) }}</span>
          </div>
          <div class="item-address">{{ item.address }}</div>
        </div>
        <div class="item-actions">
          <el-button type="primary" link @click="goDetail(item.id)">查看详情</el-button>
          <el-button type="danger" link @click="remove(item.id)">取消收藏</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import StarRating from '@/components/StarRating.vue'
import EmptyState from '@/components/EmptyState.vue'

const router = useRouter()
const list = ref([])

const goDetail = (id) => router.push(`/merchant/${id}`)
const goHome = () => router.push('/')
const remove = (id) => {
  list.value = list.value.filter((item) => item.id !== id)
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.favorites-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.favorite-item {
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: 16px;
  padding: 16px;
  border: 1px solid $border-lighter;
  border-radius: 8px;
  align-items: center;
  transition: all 0.2s;

  &:hover {
    border-color: $border-color;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  }

  @media (max-width: $md) {
    grid-template-columns: 100px 1fr;
  }
}

.item-cover {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 6px;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.item-name {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: $text-primary;
}

.item-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #f5a623;
}

.item-address {
  font-size: 13px;
  color: $text-secondary;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: $md) {
    grid-column: 1 / -1;
    flex-direction: row;
    justify-content: flex-end;
  }
}
</style>
