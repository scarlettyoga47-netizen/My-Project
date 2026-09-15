<template>
  <div class="merchant-detail">
    <el-page-header :icon="ArrowLeft" content="返回" @back="goBack" class="page-header" />

    <div class="detail-header">
      <div class="cover-slider">
        <el-carousel height="360px" arrow="always">
          <el-carousel-item v-for="(img, idx) in merchant.images" :key="idx">
            <img :src="img" alt="" style="width: 100%; height: 100%; object-fit: cover;" />
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="merchant-basic">
        <h1 class="merchant-name">{{ merchant.name }}</h1>
        <div class="rating-row">
          <StarRating :model-value="merchant.rating" readonly show-text />
          <span class="review-count">({{ merchant.reviewCount }}条评价)</span>
        </div>
        <div class="info-row">
          <el-icon><Location /></el-icon>
          <span>{{ merchant.address }}</span>
        </div>
        <div class="info-row">
          <el-icon><Phone /></el-icon>
          <span>{{ merchant.phone }}</span>
        </div>
        <div class="info-row">
          <el-icon><Clock /></el-icon>
          <span>营业时间: {{ merchant.businessHours }}</span>
        </div>
        <div class="action-row">
          <el-button type="primary" size="large">
            <el-icon><Collection /></el-icon>
            收藏
          </el-button>
          <el-button size="large">
            <el-icon><Share /></el-icon>
            分享
          </el-button>
          <el-button type="success" size="large">
            <el-icon><Calendar /></el-icon>
            预约
          </el-button>
        </div>
      </div>
    </div>

    <el-tabs v-model="activeTab" class="detail-tabs">
      <el-tab-pane label="商户介绍" name="intro">
        <div class="tab-content">
          <h3>商户简介</h3>
          <p>{{ merchant.description }}</p>
        </div>
      </el-tab-pane>
      <el-tab-pane label="用户评价" name="reviews">
        <div class="tab-content">
          <EmptyState description="暂无评价" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="预约服务" name="reservation">
        <div class="tab-content">
          <EmptyState description="请稍后再来查看预约服务" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft,
  Location,
  Phone,
  Clock,
  Collection,
  Share,
  Calendar
} from '@element-plus/icons-vue'
import StarRating from '@/components/StarRating.vue'
import EmptyState from '@/components/EmptyState.vue'

const route = useRoute()
const router = useRouter()
const activeTab = ref('intro')

const merchant = ref({
  id: route.params.id,
  name: '悦心餐厅·创意融合菜',
  images: [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&h=600&fit=crop'
  ],
  rating: 4.8,
  reviewCount: 1256,
  address: '市中心商业步行街88号',
  phone: '400-888-8888',
  businessHours: '10:00 - 22:00',
  avgPrice: 128,
  description:
    '悦心餐厅创立于2015年，专注于创意融合菜品的研发与呈现。我们精选当季新鲜食材，结合中西方烹饪技法，为每一位食客带来独特的味觉体验。餐厅环境优雅舒适，适合朋友聚会、家庭聚餐以及商务宴请。'
})

const goBack = () => router.back()
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.merchant-detail {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  margin: 0 -16px;
  padding: 0 16px 12px;
  background: $bg-white;
  border-bottom: 1px solid $border-extra-light;
}

.detail-header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  background: $bg-white;
  border-radius: 12px;
  padding: 20px;

  @media (max-width: $md) {
    grid-template-columns: 1fr;
  }
}

.cover-slider {
  border-radius: 8px;
  overflow: hidden;
}

.merchant-basic {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.merchant-name {
  font-size: 26px;
  font-weight: 700;
  color: $text-primary;
  margin: 0;
}

.rating-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.review-count {
  font-size: 14px;
  color: $text-secondary;
}

.info-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 14px;
  color: $text-regular;

  .el-icon {
    flex-shrink: 0;
    margin-top: 2px;
    color: $text-secondary;
  }
}

.action-row {
  display: flex;
  gap: 12px;
  margin-top: auto;
  flex-wrap: wrap;
}

.detail-tabs {
  background: $bg-white;
  border-radius: 12px;
  padding: 8px 20px;
}

.tab-content {
  padding: 16px 0;

  h3 {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 16px;
  }

  p {
    font-size: 14px;
    line-height: 1.8;
    color: $text-regular;
    margin: 0;
  }
}
</style>
