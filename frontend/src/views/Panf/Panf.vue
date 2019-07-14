<template>
  <b-container>
    <PanfFormInfo />
    <PanfMetaData />

    <hr />

    <PanfNewOrder />

    <hr />

    <PanfOrderTable />
  </b-container>
</template>

<script>
// @ is an alias to /src
import PanfFormInfo from './PanfFormInfo.vue'
import PanfMetaData from './PanfMetaData.vue'
import PanfNewOrder from './PanfNewOrder.vue'
import PanfOrderTable from './PanfOrderTable.vue'

export default {
  name: 'panf',
  components: {
    PanfFormInfo,
    PanfMetaData,
    PanfNewOrder,
    PanfOrderTable
  },
  props: {},
  data: function () {
    return {}
  },
  computed: {},
  methods: {
    destroySession() {
      this.$socket.emit('destroySession')
    }
  },
  watch: {},
  created: function () { },
  mounted: function () {
    this.sockets.subscribe('destroySession', () => {
      this.destroySession()
    })
  }
}
</script>
