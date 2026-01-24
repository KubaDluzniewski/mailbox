import { createRouter, createWebHistory } from 'vue-router';

import Inbox from '../views/Inbox.vue';
import NotFound from '../views/NotFound.vue';
import Login from '../views/Login.vue';
import Drafts from '../views/Drafts.vue';
import Sent from '../views/Sent.vue';
import Compose from '../views/Compose.vue';
import Confirm from '../views/Confirm.vue';
import { useUserStore } from '../store/user';
import { UserRole } from '../models/UserModel';
import AuthLayout from '../layouts/AuthLayout.vue';
import MainLayout from '../layouts/MainLayout.vue';

const routes = [
  {
    path: '/:catchAll(.*)',
    component: AuthLayout,
    children: [{ path: '/:catchAll(.*)', name: 'NotFound', component: NotFound }],
  },
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '/drafts', name: 'Drafts', component: Drafts },
      { path: '', name: 'Inbox', component: Inbox },
      { path: '/sent', name: 'Sent', component: Sent },
      { path: '/compose', name: 'Compose', component: Compose },
      { path: '/settings', name: 'Settings', component: () => import('../views/Settings.vue') },
      {
        path: '/users',
        name: 'Users',
        component: () => import('../views/Users.vue'),
        meta: { requiresAdmin: true },
      },
      {
        path: '/history',
        name: 'MessageHistory',
        component: () => import('../views/BroadcastMessages.vue'), // View filename kept same for now or could be renamed, but inside it handles all messages
        meta: { requiresAdmin: true },
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: AuthLayout,
    children: [{ path: '', name: 'LoginForm', component: Login }],
  },
  {
    path: '/register',
    name: 'Register',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'RegisterForm',
        component: () => import('../views/Register.vue'),
      },
    ],
  },
  {
    path: '/confirm',
    name: 'Confirm',
    component: AuthLayout,
    children: [{ path: '', name: 'ConfirmForm', component: Confirm }],
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'ResetPasswordForm',
        component: () => import('../views/ResetPassword.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach((to, _from, next) => {
  const userStore = useUserStore();

  if (to.path === '/login' && userStore.isLoggedIn) {
    return next('/');
  }

  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    return next('/login');
  }

  // Check if route requires admin role
  if (to.meta.requiresAdmin && !userStore.user?.roles?.includes(UserRole.ADMIN)) {
    return next('/');
  }

  next();
});
export default router;
