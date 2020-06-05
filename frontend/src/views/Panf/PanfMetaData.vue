<template>
  <b-container fluid>
    <b-button
      @click="setupNewOrder"
      variant="outline-success"
    >
      Setup New Order
    </b-button>

    <h4>{{$t('panf.metaData.title')}}</h4>
    <b-row>
      <b-col sm="12" lg="6">
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
      <b-col sm="12" lg="6">
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
      <b-col sm="12" lg="6">
        <b-input-group class="mt-3">
          <b-input-group-text slot="prepend">
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
  name: `PanfMetaData`,
  props: {},
  data: function () {
    return {
    }
  },
  computed: {
    collector: {
      get () {
        return this.$store.state.metaInfo.collector
      },
      set (val) {
        this.$store.commit(`updateCollector`, val)
      }
    },
    dateString: {
      get () {
        return this.$store.state.metaInfo.dateString
      },
      set (val) {
        this.$store.commit(`updateDate`, val)
      }
    },
    collectTime: {
      get () {
        return this.$store.state.metaInfo.collectTime
      },
      set (val) {
        this.$store.commit(`updateCollectTime`, val)
      }
    },
    caller: {
      get () {
        return this.$store.state.metaInfo.caller
      },
      set (val) {
        this.$store.commit(`updateCaller`, val)
      }
    }
  },
  methods: {
    setupNewOrder () {
      this.collector = null
      this.dateString = null
      this.collectTime = null
      this.caller = null
      this.$http.get(`${config.server.apiUrl}/order/newOrder`)
        .then((res) => {
          console.log(res)
        })
        .catch((error) => {
          console.error(error)
        })
    },
    updateMeta (meta) {
      if (!meta.datestring) {
        this.dateString = new Date()
          .toISOString()
          // eslint-disable-next-line
          .slice(0, 10)
      } else {
        this.dateString = meta.datestring
      }
      this.collectTime = meta.collecttime || ``
      this.caller = meta.caller || ``
      this.collector = meta.collector || ``
    },
    syncDateString (val) {
      this.$socket.client.emit(`syncDate`, val)
    },
    syncCollectTime (val) {
      this.$socket.client.emit(`syncCollectTime`, val)
    },
    syncCaller (val) {
      this.$socket.client.emit(`syncCaller`, val)
    },
    syncCollector (val) {
      this.$socket.client.emit(`syncCollector`, val)
    }
  },
  watch: {},
  created () { },
  mounted () {
    this.$socket.client.emit(`loadOrdermeta`)

    this.$socket.$subscribe(`sendOrdermeta`, (activeOrder) => {
      console.log(`sendordermeta: `, activeOrder)
      if (!activeOrder) {
        activeOrder = {}
      }

      this.caller = activeOrder.caller
        ? activeOrder.caller
        : null
      this.collector = activeOrder.collector
        ? activeOrder.collector
        : null
      this.collectTime = activeOrder.collecttime
        ? activeOrder.collecttime
        : null
      this.dateString = activeOrder.datestring
        ? activeOrder.datestring
        : null
    })

    this.$socket.$subscribe(`initMeta`, (meta) => {
      this.updateMeta(meta)
    })

    this.$socket.$subscribe(`pushDate`, (dateString) => {
      this.dateString = dateString
    })

    this.$socket.$subscribe(`pushCollectTime`, (collectTime) => {
      this.collectTime = collectTime
    })

    this.$socket.$subscribe(`pushCaller`, (caller) => {
      this.caller = caller
    })

    this.$socket.$subscribe(`pushCollector`, (collector) => {
      this.collector = collector
    })

    this.$socket.$subscribe(`reloadMeta`, () => {
      console.log(`loadmeta`)
      this.$socket.client.emit(`loadMeta`)
    })

    this.$socket.$subscribe(`sendMeta`, (meta) => {
      this.updateMeta(meta)
    })

    this.$socket.$subscribe(`trollProtection`, () => {
      this.$bvToast.toast(
        this.$t(`panf.metaData.trollProtectionText`),
        {
          title: this.$t(`panf.metaData.orderActive`),
          variant: `danger`,
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
