<template>
  <b-container>
    <PanfFormInfo />
    <PanfMetaData />

    <PanfNewOrder />

    <PanfOrderTable />
  </b-container>
</template>

<script>
// @ is an alias to /src
import PanfFormInfo from '@/components/PanfFormInfo.vue'
import PanfMetaData from '@/components/PanfMetaData.vue'
import PanfNewOrder from '@/components/PanfNewOrder.vue'
import PanfOrderTable from '@/components/PanfOrderTable.vue'

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
