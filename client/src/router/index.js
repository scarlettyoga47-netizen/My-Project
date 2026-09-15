import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getToken } from '@/utils/auth'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/UserLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/Home.vue')
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/Login.vue')
      },
      {
        path: 'merchant/:id',
        name: 'MerchantDetail',
        component: () => import('@/views/MerchantDetail.vue')
      },
      {
        path: 'profile',
        name: 'ProfileLayout',
        component: () => import('@/views/profile/ProfileLayout.vue'),
        redirect: '/profile/favorites',
        meta: { requireAuth: true },
        children: [
          {
            path: 'favorites',
            name: 'Favorites',
            component: () => import('@/views/profile/Favorites.vue')
          },
          {
            path: 'reviews',
            name: 'MyReviews',
            component: () => import('@/views/profile/MyReviews.vue')
          },
          {
            path: 'reservations',
            name: 'MyReservations',
            component: () => import('@/views/profile/MyReservations.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/merchant',
    name: 'MerchantLayout',
    component: () => import('@/layouts/MerchantLayout.vue'),
    meta: { requireAuth: true, role: 'merchant' },
    redirect: '/merchant/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'MerchantDashboard',
        component: () => import('@/views/merchant/Dashboard.vue')
      },
      {
        path: 'manage',
        name: 'MerchantManage',
        component: () => import('@/views/merchant/MerchantManage.vue')
      },
      {
        path: 'reviews',
        name: 'MerchantReviews',
        component: () => import('@/views/merchant/ReviewManage.vue')
      },
      {
        path: 'reservations',
        name: 'MerchantReservations',
        component: () => import('@/views/merchant/ReservationManage.vue')
      }
    ]
  },
  {
    path: '/admin',
    name: 'AdminLayout',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requireAuth: true, role: 'admin' },
    redirect: '/admin/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/Dashboard.vue')
      },
      {
        path: 'users',
        name: 'UserManage',
        component: () => import('@/views/admin/UserManage.vue')
      },
      {
        path: 'merchants',
        name: 'AdminMerchantManage',
        component: () => import('@/views/admin/MerchantManage.vue')
      },
      {
        path: 'categories',
        name: 'CategoryManage',
        component: () => import('@/views/admin/CategoryManage.vue')
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = getToken()

  if (to.meta.requireAuth && !token) {
    ElMessage.warning('请先登录')
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  if (to.name === 'Login' && token) {
    next({ name: 'Home' })
    return
  }

  next()
})

export default router
