<template>
  <div>
    <PanfFormInfo />
    <b-row>
      <b-col cols="12">
        <PanfMetaData />
      </b-col>
    </b-row>

    <hr />

    <b-row>
      <b-col cols="6"></b-col>
      <b-col cols="6">
        <PanfNewOrder />
      </b-col>
    </b-row>
    <hr />
    <br />
    <PanfOrderTable />
  </div>
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
