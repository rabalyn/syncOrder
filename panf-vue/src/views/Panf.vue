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
  }
}
</script>
