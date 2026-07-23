import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

declare module 'vue-router' {
  interface RouteMeta {
    /** Whether the public site chrome (header/footer/help widget) renders. Defaults to true. */
    chrome?: boolean
  }
}

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    { path: '/', name: 'beranda', component: () => import('@/views/HomeView.vue') },
    { path: '/daftar', name: 'daftar', component: () => import('@/views/DirectoryView.vue') },
    { path: '/umkm/:id', name: 'detail', component: () => import('@/views/DetailView.vue'), props: true },
    { path: '/tentang', name: 'tentang', component: () => import('@/views/AboutView.vue') },
    { path: '/panduan', name: 'panduan', component: () => import('@/views/GuideView.vue') },
    { path: '/favorit', name: 'favorit', component: () => import('@/views/FavoritesView.vue') },
    { path: '/privacy', name: 'privacy', component: () => import('@/views/PrivacyView.vue') },
    { path: '/terms', name: 'terms', component: () => import('@/views/TermsView.vue') },
    { path: '/akun', name: 'akun', component: () => import('@/views/AccountView.vue') },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { chrome: false },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { chrome: false },
    },
    {
      path: '/dashboard/:tab?',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { chrome: false },
      props: true,
    },
  ],
})

router.beforeEach((to) => {
  if (to.name === 'dashboard') {
    const auth = useAuthStore()
    if (!auth.user || auth.user.role === 'user') {
      return { name: 'login' }
    }
    if (!to.params.tab) {
      const defaultTab = auth.user.role === 'admin' ? 'verif' : 'ringkasan'
      return { name: 'dashboard', params: { tab: defaultTab } }
    }
  }
  return true
})

export default router
