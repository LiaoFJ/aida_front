import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { defineAsyncComponent } from 'vue'
const _import = (path : string) => defineAsyncComponent(() => import(`../views/${path}.vue`));

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    // redirect重定向
    redirect: "/login"
  },
  {
    path: '/login',
    name: 'login',
    component: _import('LoginPage')
  },
  {
    path: '/home',
    name: 'home',
    component: _import('HomeView')
  },
  {
    path: '/demo',
    name: 'demo',
    component: _import('Demo')
  },
  {
    path: '/history',
    name: 'history',
    component: _import('HistoryPage')
  },
  {
    path: '/library',
    name: 'library',
    component: _import('LibraryPage')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
