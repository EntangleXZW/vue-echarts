import Vue from 'vue'
import VueRouter from 'vue-router'
//import HomeView from '../views/HomeView.vue'

// 解决导航栏或者底部导航tabBar中的vue-router在3.0版本以上频繁点击菜单报错的问题。
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Manager',
    component: () => import('../views/Manager.vue'),
    redirect: '/home',  // 重定向到主页
    children: [
      { path: 'about', name: 'about', meta: { name: '关于' }, component: () => import('../views/AboutView.vue') },
      { path: 'home', name: 'Home', meta: { name: '系统首页' }, component: () => import('../views/HomeView.vue') },
      { path: 'linkage', name: 'linkage', meta: { name: '图表联动' }, component: () => import('../views/manager/Linkage.vue') },
      { path: 'brush', name: 'brush', meta: { name: 'echarts brush' }, component: () => import('../views/manager/Brush.vue') },
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// router.beforeEach((to, from, next) => {
//   // to 是到达的路由信息
//   // from 是开源的路由信息
//   // next 是帮助我们跳转路由的函数

//   if (true) {
//     next()
//   } else {
//     next('/')
//   }
// })

export default router
