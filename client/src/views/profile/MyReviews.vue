<template>
  <div class="my-reviews-page">
    <div class="page-header">
      <h2 class="page-title">我的评价</h2>
    </div>
    <EmptyState v-if="list.length === 0" description="暂无评价记录" />
    <div v-else class="reviews-list">
      <div v-for="review in list" :key="review.id" class="review-item">
        <div class="review-header">
          <h3 class="merchant-name">{{ review.merchantName }}</h3>
          <span class="review-date">{{ review.date }}</span>
        </div>
        <div class="review-rating">
          <StarRating :model-value="review.rating" readonly />
        </div>
        <p class="review-content">{{ review.content }}</p>
        <div class="review-images" v-if="review.images?.length">
          <img
            v-for="(img, idx) in review.images"
            :key="idx"
            :src="img"
            alt=""
            class="review-image"
          />
        </div>
        <div class="review-actions">
          <el-button type="primary" link>编辑</el-button>
          <el-button type="danger" link>删除</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StarRating from '@/components/StarRating.vue'
import EmptyState from '@/components/EmptyState.vue'

const list = ref([])
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.my-reviews-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.review-item {
  padding: 20px;
  border: 1px solid $border-lighter;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.merchant-name {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: $text-primary;
}

.review-date {
  font-size: 13px;
  color: $text-secondary;
}

.review-content {
  font-size: 14px;
  line-height: 1.6;
  color: $text-regular;
  margin: 0;
}

.review-images {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.review-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 6px;
  cursor: pointer;
}

.review-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  border-top: 1px solid $border-extra-light;
  padding-top: 12px;
}
</style>
