import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

import axios from 'axios'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './icons'

import VueSocketIO from 'vue-socket.io'

import de from './locales/de/locales.json'
import en from './locales/en/locales.json'
import VueI18n from 'vue-i18n'

import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

import config from './config.js'
const connectionString = config.server.baseUrl
const {socketIOPath} = config.server

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(new VueSocketIO({
  debug: false,
  connection: connectionString,
  options: {path: socketIOPath}
}))

Vue.use(VueI18n)
Vue.use(BootstrapVue)
Vue.prototype.$http = axios

Vue.config.productionTip = false

const i18n = new VueI18n({
  locale: 'de',
  messages: {
    en: en,
    de: de
  }
})

new Vue({
  i18n,
  router,
  store,
  render: (h) => h(App),
  sockets: {
    connect: function() {
      console.info('socket connected')
    }
  }
}).$mount('#app')
