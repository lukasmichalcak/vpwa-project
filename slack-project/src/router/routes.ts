import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },

  {
    path: '/login',
    name: 'login',
    component: () => import('pages/LoginPage.vue'), //might include child component
  },

  {
    path: '/main',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'channel-list',
        component: () => import('components/ChannelListComponent.vue'),
      },
      {
        path: 'command-line',
        component: () => import('components/CommandLineComponent.vue'),
      },
    ],
  },

  {
    path: '/register',
    name: 'register',
    component: () => import('pages/RegisterPage.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
