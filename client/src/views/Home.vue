<template>
  <div class="home-page">
    <section class="banner-section">
      <div class="banner-content">
        <h1 class="banner-title">发现身边的美好生活</h1>
        <p class="banner-desc">真实评价，用心推荐，助你做出明智选择</p>
        <div class="search-box">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索商户、服务或地点..."
            size="large"
            clearable
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon class="search-icon"><Search /></el-icon>
            </template>
            <template #append>
              <el-button type="primary" @click="handleSearch">搜索</el-button>
            </template>
          </el-input>
        </div>
      </div>
    </section>

    <section class="category-section">
      <div class="section-header">
        <h2 class="section-title">热门分类</h2>
      </div>
      <div class="category-grid">
        <div
          v-for="category in categories"
          :key="category.id"
          class="category-item"
          @click="handleCategoryClick(category)"
        >
          <el-icon class="category-icon" :color="category.color">
            <component :is="category.icon" />
          </el-icon>
          <span class="category-name">{{ category.name }}</span>
        </div>
      </div>
    </section>

    <section class="merchant-section">
      <div class="section-header">
        <h2 class="section-title">推荐商户</h2>
        <el-button type="primary" link>查看更多</el-button>
      </div>
      <div class="merchant-grid">
        <div
          v-for="merchant in merchantList"
          :key="merchant.id"
          class="merchant-card"
          @click="goDetail(merchant.id)"
        >
          <div class="merchant-cover">
            <img :src="merchant.cover" :alt="merchant.name" />
            <div class="merchant-tag" v-if="merchant.tag">{{ merchant.tag }}</div>
          </div>
          <div class="merchant-info">
            <div class="merchant-name text-ellipsis">{{ merchant.name }}</div>
            <div class="merchant-rating">
              <StarRating :model-value="merchant.rating" readonly size="small" />
              <span class="rating-num">{{ merchant.rating.toFixed(1) }}</span>
              <span class="review-count">({{ merchant.reviewCount }}条评价)</span>
            </div>
            <div class="merchant-address text-ellipsis">
              <el-icon><Location /></el-icon>
              {{ merchant.address }}
            </div>
            <div class="merchant-footer">
              <span class="price">¥{{ merchant.avgPrice }}/人</span>
              <div class="distance">{{ merchant.distance }}km</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Search,
  Location,
  Food,
  CoffeeCup,
  Hotel,
  ShoppingBag,
  Movie,
  OfficeBuilding,
  Trophy,
  MagicStick
} from '@element-plus/icons-vue'
import StarRating from '@/components/StarRating.vue'

const router = useRouter()
const searchKeyword = ref('')

const categories = ref([
  { id: 1, name: '美食', icon: Food, color: '#f56c6c' },
  { id: 2, name: '咖啡', icon: CoffeeCup, color: '#b88230' },
  { id: 3, name: '酒店', icon: Hotel, color: '#409eff' },
  { id: 4, name: '购物', icon: ShoppingBag, color: '#e6a23c' },
  { id: 5, name: '娱乐', icon: Movie, color: '#67c23a' },
  { id: 6, name: '丽人', icon: MagicStick, color: '#ff7eb9' },
  { id: 7, name: '运动', icon: Trophy, color: '#722ed1' },
  { id: 8, name: '更多', icon: OfficeBuilding, color: '#8c8c8c' }
])

const merchantList = ref([
  {
    id: 1,
    name: '悦心餐厅·创意融合菜',
    cover: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop',
    rating: 4.8,
    reviewCount: 1256,
    address: '市中心商业步行街88号',
    avgPrice: 128,
    distance: 0.5,
    tag: '热门'
  },
  {
    id: 2,
    name: '时光咖啡馆',
    cover: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop',
    rating: 4.6,
    reviewCount: 892,
    address: '文化街12号',
    avgPrice: 58,
    distance: 0.8,
    tag: '推荐'
  },
  {
    id: 3,
    name: '云端精品酒店',
    cover: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop',
    rating: 4.9,
    reviewCount: 2341,
    address: '滨江大道666号',
    avgPrice: 688,
    distance: 1.2,
    tag: '精选'
  },
  {
    id: 4,
    name: '星光国际影城',
    cover: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=400&fit=crop',
    rating: 4.5,
    reviewCount: 5678,
    address: '万达广场3楼',
    avgPrice: 68,
    distance: 2.1,
    tag: ''
  },
  {
    id: 5,
    name: '美丽人生SPA会所',
    cover: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=600&h=400&fit=crop',
    rating: 4.7,
    reviewCount: 623,
    address: '富人区花园街15号',
    avgPrice: 388,
    distance: 1.8,
    tag: '高端'
  },
  {
    id: 6,
    name: '活力健身俱乐部',
    cover: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop',
    rating: 4.4,
    reviewCount: 1589,
    address: '体育中心内',
    avgPrice: 199,
    distance: 2.5,
    tag: ''
  }
])

const handleSearch = () => {
  console.log('搜索:', searchKeyword.value)
}

const handleCategoryClick = (category) => {
  console.log('分类:', category)
}

const goDetail = (id) => {
  router.push(`/merchant/${id}`)
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.home-page {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.banner-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 60px 40px;
  margin: 0 -16px;
  color: #fff;

  @media (max-width: $md) {
    padding: 40px 20px;
    margin: 0 -16px;
    border-radius: 0;
  }
}

.banner-content {
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
}

.banner-title {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 16px;

  @media (max-width: $md) {
    font-size: 24px;
  }
}

.banner-desc {
  font-size: 16px;
  opacity: 0.9;
  margin: 0 0 32px;
}

.search-box {
  max-width: 560px;
  margin: 0 auto;
}

.search-icon {
  font-size: 18px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.section-title {
  font-size: 22px;
  font-weight: 700;
  color: $text-primary;
  margin: 0;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 16px;

  @media (max-width: $lg) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: $sm) {
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 12px;
  background: $bg-white;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }
}

.category-icon {
  font-size: 32px;
}

.category-name {
  font-size: 13px;
  color: $text-regular;
  font-weight: 500;
}

.merchant-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: $lg) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: $md) {
    grid-template-columns: 1fr;
  }
}

.merchant-card {
  background: $bg-white;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
  }
}

.merchant-cover {
  position: relative;
  width: 100%;
  padding-top: 60%;
  overflow: hidden;

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
  }

  &:hover img {
    transform: scale(1.05);
  }
}

.merchant-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 10px;
  background: linear-gradient(90deg, #ff6b6b, #ee5a5a);
  color: #fff;
  font-size: 12px;
  border-radius: 4px;
  font-weight: 500;
}

.merchant-info {
  padding: 16px;
}

.merchant-name {
  font-size: 16px;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 8px;
}

.merchant-rating {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  font-size: 13px;
}

.rating-num {
  color: #f5a623;
  font-weight: 600;
}

.review-count {
  color: $text-secondary;
}

.merchant-address {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: $text-secondary;
  margin-bottom: 12px;

  .el-icon {
    flex-shrink: 0;
  }
}

.merchant-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid $border-extra-light;
}

.price {
  color: $danger-color;
  font-weight: 600;
  font-size: 15px;
}

.distance {
  font-size: 12px;
  color: $text-secondary;
  background: $bg-color;
  padding: 2px 8px;
  border-radius: 10px;
}
</style>
