<template>
  <div class="profile-layout">
    <div class="profile-aside">
      <div class="user-card">
        <el-avatar :size="80" class="avatar">
          {{ userStore.userInfo?.nickname?.charAt(0) || 'U' }}
        </el-avatar>
        <div class="user-name">{{ userStore.userInfo?.nickname || '用户' }}</div>
        <div class="user-phone">{{ userStore.userInfo?.phone || '' }}</div>
      </div>
      <el-menu
        :default-active="activeMenu"
        router
        class="side-menu"
      >
        <el-menu-item index="/profile/favorites">
          <el-icon><Star /></el-icon>
          <span>我的收藏</span>
        </el-menu-item>
        <el-menu-item index="/profile/reviews">
          <el-icon><EditPen /></el-icon>
          <span>我的评价</span>
        </el-menu-item>
        <el-menu-item index="/profile/reservations">
          <el-icon><Calendar /></el-icon>
          <span>我的预约</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="profile-main">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Star, EditPen, Calendar } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const userStore = useUserStore()

const activeMenu = computed(() => route.path)
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.profile-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 24px;
  min-height: 600px;

  @media (max-width: $md) {
    grid-template-columns: 1fr;
  }
}

.profile-aside {
  background: $bg-white;
  border-radius: 12px;
  overflow: hidden;
  height: fit-content;
}

.user-card {
  padding: 32px 24px;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.avatar {
  margin-bottom: 16px;
  background: rgba(255, 255, 255, 0.2);
  font-size: 32px;
  font-weight: 600;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.user-phone {
  font-size: 13px;
  opacity: 0.9;
}

.side-menu {
  border-right: none;
  padding: 12px 0;
}

.profile-main {
  background: $bg-white;
  border-radius: 12px;
  padding: 24px;
  min-height: 400px;
}
</style>
