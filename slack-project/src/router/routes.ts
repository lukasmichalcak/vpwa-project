import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'server-list', component: () => import('components/ServerListComponent.vue') },
      { path: 'comand-line', component: () => import('components/CommandLineComponent.vue') },
    ],
  },

  {
    path: '/login',
    component: () => import('pages/LoginPage.vue') //might include child component
  },

  {
    path: '/register',
    component: () => import('pages/RegisterPage.vue')
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;

