import Vue from 'vue'
import Router from 'vue-router'
import Panf from './views/Panf.vue'
// import DaVinci from './views/DaVinci.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  linkExactActiveClass: 'active',
  routes: [
    {
      path: '/panf',
      name: 'panf',
      component: Panf
    },
    {
      path: '/davinci-menu',
      name: 'daVinciMenu',
      // component: DaVinci
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('./views/DaVinci.vue')
    },
    {
      path: '*',
      redirect: '/panf'
    }
  ]
})
