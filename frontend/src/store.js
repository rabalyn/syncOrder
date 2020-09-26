import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  strict: debug,
  state: {
    metaInfo: {
      collector: '',
      dateString: '',
      collectTime: '',
      caller: ''
    },
    user: {
      isAuthed: '',
      username: '',
      displayname: '',
      email: ''
    }
  },
  mutations: {
    updateCollector (state, collector) {
      state.metaInfo.collector = collector
    },
    updateDate (state, dateString) {
      state.metaInfo.dateString = dateString
    },
    updateCollectTime (state, collectTime) {
      state.metaInfo.collectTime = collectTime
    },
    updateCaller (state, caller) {
      state.metaInfo.caller = caller
    },
    updateMe (state, userObj) {
      state.user = {
        isAuthed: userObj.isAuthed,
        username: userObj.username,
        displayname: userObj.displayname,
        email: userObj.email
      }
    },
    updateMyDisplayname (state, displayname) {
      state.user.displayname = displayname
    },
    updateMyEmail (state, email) {
      state.user.email = email
    }
  },
  actions: {}
})
