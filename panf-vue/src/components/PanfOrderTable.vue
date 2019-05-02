<template>
  <div>
    <b-table
      show-empty
      responsive
      striped
      hover
      :items="showOrders"
      :empty-text="noOrdersText"
    >
      <template slot="HEAD_id">
        #
      </template>
      <template slot="id" slot-scope="row">
        {{ row.value }}
      </template>

      <template slot="HEAD_name">
        <font-awesome-icon icon="box"/> Name
      </template>
      <template slot="name" slot-scope="row">
        {{ row.value }}
      </template>

      <template slot="HEAD_meal">
        <font-awesome-icon icon="box"/> Bestellung
      </template>
      <template slot="meal" slot-scope="row">
        {{ row.value }}
      </template>

      <template slot="HEAD_extras">
        <font-awesome-icon icon="comment"/> Kommentar
      </template>
      <template slot="extras" slot-scope="row">
        {{ row.value.map(extra => extra.name).join(', ') }}
      </template>

      <template slot="HEAD_price">
        <font-awesome-icon icon="money-bill-alt"/> Kosten
      </template>
      <template slot="price" slot-scope="row">
        {{ `${formatPrice(row.value)} €` }}
      </template>

      <template slot="HEAD_prepaid">
        <font-awesome-icon icon="money-bill-alt"/> Anzahlung
      </template>
      <template slot="prepaid" slot-scope="row">
        {{ `${formatPrice(row.value)} €` }}
      </template>
    </b-table>
  </div>
</template>

<script>
import config from '../config.js'

export default {
  name: 'PanfOrderTable',
  props: {
  },
  data: function () {
    return {
      fields: [
        'id',
        'name',
        'meal',
        'extras',
        'mealPrice',
        'prepaid'
      ],
      orders: [],
      noOrdersText: 'Noch keine Bestellung vorhanden.'
    }
  },
  computed: {
    showOrders () {
      const showOrderList = this.orders.map(order => {
        return {
          id: order.tableId,
          name: order.name,
          meal: order.meal,
          extras: order.extras,
          price: order.mealPrice + order.extrasPrice,
          prepaid: 0
        }
      })
      return showOrderList
    }
  },
  methods: {
    formatPrice (value) {
      const val = (value / 1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
    loadOrders () {
      this.$http
        .get(`${config.server.apiUrl}/order/getAllOrderlist`)
        .then((res) => {
          this.orders = res.data
        })
    },
    makeToast (opts) {
      const title = opts.title || ''
      const content = opts.content || ''
      const variant = opts.variant || null
      this.$bvToast.toast(content, {
        title: title,
        variant: variant,
        solid: true,
        autoHideDelay: 7500
      })
    }
  },
  watch: {
  },
  created: function () {
  },
  mounted: function () {
    this.loadOrders()

    this.sockets.subscribe('GETorder', (order) => {
      this.orders.push(order)
      this.makeToast({
        title: 'Bestellung erhalten',
        content: `Hey ${order.name}! \n ${order.meal} wurde zur Liste der Bestellungen hinzugefügt :-) \n Guten Hunger!`,
        variant: 'info'
      })
    })

    this.sockets.subscribe('FAILorder', (order) => {
      this.makeToast({
        title: 'Bestellung abgelehnt',
        content: `Hey ${order.name}! \n Dein Name steht leider schon auf der Liste. Du musst einen anderen wählen.`,
        variant: 'danger'
      })
    })

    this.sockets.subscribe('reload', () => {
      this.loadOrders()
    })
  }
}
</script>

<style scoped>
</style>
