<template>
  <b-container>
    <h4>{{$t('panf.metaData.title')}}</h4>
    <b-row>
      <b-col
        sm="12"
        lg="6"
      >
        <b-input-group class="mt-3">
          <b-input-group-text slot="prepend">
            <font-awesome-icon icon="calendar-alt" />&nbsp;
          </b-input-group-text>
          <b-form-input
            @update="syncDateString"
            v-model="dateString"
            type="date"
          ></b-form-input>
        </b-input-group>
      </b-col>
      <b-col
        sm="12"
        lg="6"
      >
        <b-input-group class="mt-3">
          <b-input-group-text slot="prepend">
            <font-awesome-icon icon="clock" />&nbsp;
          </b-input-group-text>
          <b-form-input
            @update="syncCollectTime"
            v-model="collectTime"
            type="time"
          ></b-form-input>
        </b-input-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col
        sm="12"
        lg="6"
      >
        <b-input-group class="mt-3">
          <b-input-group-text slot="prepend">
            <font-awesome-icon icon="user" />&nbsp;
            <font-awesome-icon icon="phone" />&nbsp;
          </b-input-group-text>
          <b-form-input
            @update="syncCaller"
            v-model="caller"
          ></b-form-input>
        </b-input-group>
      </b-col>
      <b-col
        sm="12"
        lg="6"
      >
        <b-input-group class="mt-3">
          <b-input-group-text slot="prepend">
            <font-awesome-icon icon="people-carry" />&nbsp;
          </b-input-group-text>
          <b-form-input
            @update="syncCollector"
            v-model="collector"
          ></b-form-input>
        </b-input-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import config from '../../config'

export default {
  name: 'PanfMetaData',
  props: {},
  data: function () {
    return {
    }
  },
  computed: {
    collector: {
      get() {
        return this.$store.state.metaInfo.collector
      },
      set(val) {
        this.$store.commit('updateCollector', val)
      }
    },
    dateString: {
      get() {
        return this.$store.state.metaInfo.dateString
      },
      set(val) {
        this.$store.commit('updateDate', val)
      }
    },
    collectTime: {
      get() {
        return this.$store.state.metaInfo.collectTime
      },
      set(val) {
        this.$store.commit('updateCollectTime', val)
      }
    },
    caller: {
      get() {
        return this.$store.state.metaInfo.caller
      },
      set(val) {
        this.$store.commit('updateCaller', val)
      }
    }
  },
  methods: {
    loadMeta() {
      this.$http.get(`${config.server.apiUrl}/order/loadMetadata`)
        .then((res) => {
          this.updateMeta(res.data)
        })
        .catch((error) => {
          console.error('could not fetch meta data: ', error)
        })
    },
    updateMeta(meta) {
      this.dateString = meta.dateString || ''

      if (this.dateString === '') {
        this.dateString = new Date().toISOString()
          // eslint-disable-next-line
          .slice(0, 10)
        this.syncDateString()
      }
      this.collectTime = meta.collectTime || ''
      this.caller = meta.caller || ''
      this.collector = meta.collector || ''
    },
    syncDateString(val) {
      this.$socket.emit('syncDate', val)
    },
    syncCollectTime(val) {
      this.$socket.emit('syncCollectTime', val)
    },
    syncCaller(val) {
      this.$socket.emit('syncCaller', val)
    },
    syncCollector(val) {
      this.$socket.emit('syncCollector', val)
    }
  },
  watch: {},
  created: function () { },
  mounted: function () {
    this.sockets.subscribe('initMeta', (meta) => {
      this.updateMeta(meta)
    })

    this.loadMeta()

    this.sockets.subscribe('pushDate', (dateString) => {
      this.dateString = dateString
    })

    this.sockets.subscribe('pushCollectTime', (collectTime) => {
      this.collectTime = collectTime
    })

    this.sockets.subscribe('pushCaller', (caller) => {
      this.caller = caller
    })

    this.sockets.subscribe('pushCollector', (collector) => {
      this.collector = collector
    })

    this.sockets.subscribe('reloadMeta', () => {
      this.$socket.emit('loadMeta')
    })

    this.sockets.subscribe('sendMeta', (meta) => {
      this.updateMeta(meta)
    })

    this.sockets.subscribe('trollProtection', () => {
      this.$bvToast.toast(
        this.$t('panf.metaData.trollProtectionText'),
        {
          title: this.$t('panf.metaData.orderActive'),
          variant: 'danger',
          solid: true,
          autoHideDelay: 7500
        }
      )
    })
  }
}
</script>

<style scoped>
.input-group-prepend {
  width: 15%; /*adjust as needed*/
}

.input-group-text {
  width: 100%;
  overflow: hidden;
}
</style>
