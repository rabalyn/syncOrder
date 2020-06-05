<template>
  <b-container fluid>
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
  name: `panf`,
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
    destroySession () {
      this.$socket.client.emit(`destroySession`)
    }
  },
  watch: {},
  created: function () { },
  mounted () {
    this.$socket.$subscribe(`destroySession`, () => {
      this.destroySession()
    })

    this.$socket.$subscribe(`foo`, (foo) => {
      console.log(`foo: `, foo)
    })
  }
}
</script>
