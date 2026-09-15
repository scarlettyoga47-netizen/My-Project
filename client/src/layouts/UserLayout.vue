<template>
  <div class="user-layout">
    <header class="header">
      <div class="container header-inner">
        <div class="logo" @click="goHome">
          <el-icon class="logo-icon"><Shop /></el-icon>
          <span class="logo-text">生活评价</span>
        </div>
        <nav class="nav-menu">
          <el-menu
            :default-active="activeMenu"
            mode="horizontal"
            router
            class="menu"
          >
            <el-menu-item index="/">首页</el-menu-item>
            <el-menu-item index="/category">分类</el-menu-item>
            <el-menu-item index="/rank">排行榜</el-menu-item>
          </el-menu>
        </nav>
        <div class="header-right">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索商户..."
            class="search-input"
            clearable
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <template v-if="userStore.isLoggedIn">
            <el-dropdown trigger="click">
              <div class="user-info">
                <el-avatar :size="36" class="avatar">
                  {{ userStore.userInfo?.nickname?.charAt(0) || 'U' }}
                </el-avatar>
                <span class="username">{{ userStore.userInfo?.nickname || '用户' }}</span>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="goProfile">
                    <el-icon><User /></el-icon>
                    个人中心
                  </el-dropdown-item>
                  <el-dropdown-item @click="goFavorites">
                    <el-icon><Star /></el-icon>
                    我的收藏
                  </el-dropdown-item>
                  <el-dropdown-item divided @click="handleLogout">
                    <el-icon><SwitchButton /></el-icon>
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <el-button type="primary" @click="goLogin">登录</el-button>
          </template>
        </div>
      </div>
    </header>

    <main class="main">
      <div class="container">
        <RouterView />
      </div>
    </main>

    <footer class="footer">
      <div class="container footer-inner">
        <div class="footer-section">
          <h4>关于我们</h4>
          <p>生活评价平台 - 发现身边的美好生活</p>
        </div>
        <div class="footer-section">
          <h4>快速链接</h4>
          <ul>
            <li><a href="#">商户入驻</a></li>
            <li><a href="#">帮助中心</a></li>
            <li><a href="#">联系我们</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>联系方式</h4>
          <p>邮箱: contact@example.com</p>
          <p>电话: 400-888-8888</p>
        </div>
      </div>
      <div class="copyright">
        © 2024 生活评价平台 版权所有
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Shop, Search, User, Star, SwitchButton } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const searchKeyword = ref('')

const activeMenu = computed(() => route.path)

const goHome = () => router.push('/')
const goLogin = () => router.push('/login')
const goProfile = () => router.push('/profile')
const goFavorites = () => router.push('/profile/favorites')

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({ path: '/', query: { keyword: searchKeyword.value } })
  }
}

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    userStore.logout()
    ElMessage.success('已退出登录')
    router.push('/')
  } catch {
    // 用户取消
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.user-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: $bg-white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.header-inner {
  height: 64px;
  display: flex;
  align-items: center;
  gap: 24px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  flex-shrink: 0;
}

.logo-icon {
  font-size: 28px;
  color: $primary-color;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: $text-primary;
}

.nav-menu {
  flex: 1;
  display: flex;
  justify-content: center;
}

.menu {
  border-bottom: none;
  background: transparent;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-input {
  width: 220px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 20px;
  transition: background 0.2s;

  &:hover {
    background: $bg-color;
  }
}

.username {
  font-size: 14px;
  color: $text-regular;
}

.main {
  flex: 1;
  padding: 24px 0;
}

.footer {
  background: #1f2937;
  color: #9ca3af;
  padding-top: 40px;
}

.footer-inner {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  padding-bottom: 32px;

  @media (max-width: $md) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

.footer-section h4 {
  color: #fff;
  font-size: 16px;
  margin-bottom: 16px;
}

.footer-section p {
  font-size: 14px;
  line-height: 1.8;
  margin: 0;
}

.footer-section ul {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-section a {
  font-size: 14px;
  color: #9ca3af;
  transition: color 0.2s;

  &:hover {
    color: $primary-color;
  }
}

.copyright {
  text-align: center;
  padding: 16px 0;
  border-top: 1px solid #374151;
  font-size: 12px;
}
</style>
