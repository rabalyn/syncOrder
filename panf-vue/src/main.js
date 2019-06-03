import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

import axios from 'axios'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import VueSocketIO from 'vue-socket.io'

import VueSession from 'vue-session'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// eslint-disable-next-line
import { library } from './icons'

import config from './config.js'
const connectionString = config.server.baseUrl

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(VueSession)

Vue.use(new VueSocketIO({
  debug: false,
  connection: connectionString
}))

Vue.use(BootstrapVue)
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
  sockets: {
    connect: function () {
      console.info('socket connected')
    }
  }
}).$mount('#app')
