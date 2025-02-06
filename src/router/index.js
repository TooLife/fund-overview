import { createRouter, createWebHistory } from 'vue-router'
import FundCollection from '../views/FundCollection.vue'
import FundDetail from '../views/FundDetail.vue'

const routes = [
  {
    path: '/',
    name: 'FundCollection',
    component: FundCollection
  },
  {
    path: '/fund/:name',
    name: 'FundDetail',
    component: FundDetail,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 添加导航守卫进行调试
router.beforeEach((to, from, next) => {
  console.log('Navigating to:', to.path)
  next()
})

export default router 