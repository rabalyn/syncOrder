<template>
  <b-container fluid>
    <h4>{{ $t('panf.orderTable.order') }}</h4>
    <b-table
      v-if="showOrderList.length > 1"
      show-empty
      responsive
      striped
      hover
      :items="showOrderList"
    />
    <p v-else>
      {{ $t('panf.orderTable.noOrdersText') }}
    </p>
  </b-container>
</template>

<script>
import config from '../../config'

export default {
  name: 'PanfOrderTable',
  props: {},
  data: function () {
    return {
      fields: ['orderid', 'name', 'meal', 'extras', 'mealPrice', 'prepaid'],
      orders: [],
      prepaidCharges: [],
      prepaidSum: 0
    }
  },
  computed: {
    orderSumPrice: function () {
      return this.orders.reduce((prev, next) => {
        return prev + next.extrasPrice + next.mealPrice
        // eslint-disable-next-line
      }, 0.00)
    },
    formatPrepaidSum: function () {
      return `${this.formatPrice(this.prepaidSum)}€`
    },
    showOrderList: function () {
      for (let i = 0; i < this.orders.length; i++) {
        if (this.prepaidCharges[i]) {
          // eslint-disable-next-line
          this.orders[i].prepaid = parseFloat(this.prepaidCharges[i])
        }
      }
      const newShowOrderList = this.orders.map((order) => {
        return {
          orderid: order.orderid,
          name: order.name,
          meal: order.meal,
          extras: order.extras,
          price: `${this.formatPrice(order.mealprice + order.extrasprice)} €`,
          prepaid: order.prepaid
        }
      })

      newShowOrderList.push({})

      return newShowOrderList || []
    }
  },
  watch: {
    orders: {
      handler: function (newVal) {
        return newVal
      },
      deep: true
    },
    prepaidCharges: {
      handler: function (newVal) {
        if (newVal) {
          this.prepaidSum = newVal.reduce((prev, curr) => {
            if (curr) {
              return prev + parseFloat(curr)
            } else {
              return prev
            }
            // eslint-disable-next-line
          }, 0.0)
        } else {
          this.prepaidSum = 0.00
        }

        return newVal
      },
      deep: true
    }
  },
  created: function () { },
  mounted: function () {
    this.loadOrders()
    this.loadPrepaidCharges()

    this.$socket.$subscribe('initOrders', (orders) => {
      this.orders = orders
    })

    this.$socket.$subscribe('GETorder', (order) => {
      this.orders.push(order)
    })

    this.$socket.$subscribe('UPDATEorder', (order) => {
      // eslint-disable-next-line
      this.$set(this.orders, parseInt(order.orderId) - 1, order)
    })

    this.$socket.$subscribe('showOrderReceiption', (order) => {
      this.makeToast({
        title: 'Bestellung erhalten',
        content: `Hey ${order.name} ! \n ${order.meal} wurde zur Liste der Bestellungen hinzugefügt: -) \n
        Guten Hunger!`,
        variant: 'info'
      })
    })

    this.$socket.$subscribe('FAILorder', (order) => {
      this.makeToast({
        title: 'Bestellung abgelehnt',
        content: `Hey ${order.name} ! \n
        Dein Name steht leider schon auf der Liste.Du musst einen anderen wählen.`,
        variant: 'danger'
      })
    })

    this.$socket.$subscribe('initPaied', (paiedList) => {
      for (let i = 0; i < this.showOrderList.length; i++) {
        if (paiedList[i] !== null) {
          this.showOrderList[i].prepaid = parseFloat(paiedList[i])
        }
      }
    })

    this.$socket.$subscribe('updatePrepaid', (paiedList) => {
      for (let i = 0; i < this.showOrderList.length; i++) {
        if (paiedList[i] !== null) {
          this.showOrderList[i].prepaid = parseFloat(paiedList[i])
        }
      }

      this.prepaidSum = this.showOrderList.reduce((prev, curr) => {
        if (curr.prepaid) {
          return prev + parseFloat(curr.prepaid)
        } else {
          return prev
        }
        // eslint-disable-next-line
      }, 0.0)
    })
  },
  methods: {
    formatPrice (value) {
      // eslint-disable-next-line
      const val = (value / 1).toFixed(2).replace('.', ',')

      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
    updatePrepaidSum () {
      this.prepaidSum = this.prepaidCharges.reduce((prev, curr) => {
        if (curr) {
          return prev + parseFloat(curr)
        } else {
          return prev
        }
        // eslint-disable-next-line
      }, 0.0)

      this.$socket.client.emit('syncPrepaid', this.showOrderList)
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
    },
    loadOrders () {
      this.$http.get(`${config.server.apiUrl}/order/getAllOrderList`)
        .then((res) => {
          this.orders = res.data
        })
        .catch((error) => {
          console.error('could not fetch orders: ', error)
        })
    },
    loadPrepaidCharges () {
      this.$http.get(`${config.server.apiUrl}/order/getPrepaidCharges`)
        .then((res) => {
          this.prepaidCharges = res.data
        })
        .catch((error) => {
          console.error('could not fetch prepaid charges: ', error)
        })
    }
  }
}
</script>

<style scoped>
</style>
