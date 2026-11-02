import { createRouter, createWebHistory } from 'vue-router';
import { onUnauthorized, token } from '@/lib/api';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: (to, _from, saved) =>
    saved ?? (to.hash ? { el: to.hash, behavior: 'smooth' } : { top: 0 }),
  routes: [
    // Public Falaknama site
    {
      path: '/',
      component: () => import('@/views/site/SiteLayout.vue'),
      children: [
        { path: '', component: () => import('@/views/site/LandingView.vue') },
        {
          path: 'about',
          component: () => import('@/views/site/AboutView.vue'),
        },
        {
          path: 'articles',
          component: () => import('@/views/site/ArticlesView.vue'),
        },
        {
          path: 'articles/:slug',
          component: () => import('@/views/site/ArticleView.vue'),
        },
        { path: 'news', component: () => import('@/views/site/NewsView.vue') },
      ],
    },
    // Admin panel
    { path: '/login', component: () => import('@/views/LoginView.vue') },
    {
      path: '/admin',
      component: () => import('@/views/DashboardLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: '', component: () => import('@/views/DashboardView.vue') },
        {
          path: 'articles',
          component: () => import('@/views/admin/ArticlesAdminView.vue'),
        },
        {
          path: 'articles/:id',
          component: () => import('@/views/admin/ArticleEditView.vue'),
        },
        {
          path: 'news',
          component: () => import('@/views/admin/NewsAdminView.vue'),
        },
        {
          path: 'faqs',
          component: () => import('@/views/admin/FaqsAdminView.vue'),
        },
        { path: 'users', component: () => import('@/views/UsersView.vue') },
        {
          path: 'settings',
          component: () => import('@/views/SettingsView.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/site/NotFoundView.vue'),
    },
  ],
});

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !token.get()) return '/login';
  if (to.path === '/login' && token.get()) return '/admin';
});

onUnauthorized.handler = () => void router.push('/login');
