<template>
  <b-button
    v-if="noOrderTime"
    v-b-modal.confirmDeleteOrderList
    variant="danger"
    size="sm"
  >
    <font-awesome-icon icon="trash" />&nbsp;
    {{$t('nav.clearOrders')}}
  </b-button>
</template>

<script>
export default {
  name: `ClearOrderListButton`,
  props: {
  },
  data: function () {
    return {}
  },
  computed: {
    noOrderTime: function () {
      const today = new Date().getHours()
      const START_HOUR_ORDER_PROCESS = 10
      const END_HOUR_ORDER_PROCESS = 14
      const listClearable = !(today >= START_HOUR_ORDER_PROCESS && today <= END_HOUR_ORDER_PROCESS)

      return listClearable
    }
  },
  methods: {
  },
  watch: {
  },
  created: function () {
  },
  mounted: function () {
  }
}
</script>

<style scoped>
</style>
