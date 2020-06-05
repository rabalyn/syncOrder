import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login/Login.vue'
import Panf from './views/Panf/Panf.vue'

Vue.use(Router)

export default new Router({
  mode: `history`,
  linkExactActiveClass: `active`,
  routes: [
    {
      path: `/login`,
      name: `login`,
      component: Login
    },
    {
      path: `/panf`,
      name: `panf`,
      component: Panf
    },
    {
      path: `/davinci-menu`,
      name: `daVinciMenu`,
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(`./views/DaVinci/DaVinci.vue`)
    },
    {
      path: `*`,
      redirect: `/panf`
    }
  ]
})
