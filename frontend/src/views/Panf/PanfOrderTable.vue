<template>
  <b-container>
    <h4>{{$t('panf.orderTable.order')}}</h4>
    <b-table
      show-empty
      responsive
      striped
      hover
      v-if="showOrderList.length > 1"
      :items="showOrderList"
      :empty-text="$t('panf.orderTable.noOrdersText')"
    >
      <template slot="HEAD_id">#</template>
      <template
        slot="id"
        slot-scope="row"
        v-if="row.item.name"
      >{{ row.index + 1 }}</template>

      <template slot="HEAD_name">
        <font-awesome-icon icon="box" />{{$t('panf.orderTable.name')}}
      </template>
      <template
        slot="name"
        slot-scope="row"
      >{{ row.value }}</template>

      <template slot="HEAD_meal">
        <font-awesome-icon icon="box" />{{$t('panf.orderTable.order')}}
      </template>
      <template
        slot="meal"
        slot-scope="row"
      >{{ row.value }}</template>

      <template slot="HEAD_extras">
        <font-awesome-icon icon="comment" />{{$t('panf.orderTable.comment')}}
      </template>
      <template
        slot="extras"
        slot-scope="row"
      >
        <div v-if="row.item.name">
          <span
            v-bind:key="idx"
            v-for="(extra, idx) in row.item.extras"
          >
            <b-badge
              v-if="extra.type === 'remove'"
              variant="danger"
            >{{ extra.name }}</b-badge>

            <b-badge
              v-else
              variant="success"
            >+{{ $t(`panf.newOrder.extras.${extra.name}`) }} ({{ formatPrice(extra.price) }}€)</b-badge>&nbsp;
          </span>
        </div>
        <span v-else>{{$t(`panf.orderTable.sum`)}}:</span>
      </template>

      <template slot="HEAD_price">
        <font-awesome-icon icon="money-bill-alt" />{{$t(`panf.orderTable.cost`)}}
      </template>
      <template
        slot="price"
        slot-scope="row"
      >
        <span v-if="row.value">{{ `${formatPrice(row.value)} €` }}</span>
        <span v-else>{{formatPrice(orderSumPrice)}} €</span>
      </template>

      <template slot="HEAD_prepaid">
        <font-awesome-icon icon="money-bill-alt" />{{$t('panf.orderTable.prepaid')}}
      </template>
      <template
        slot="prepaid"
        slot-scope="row"
      >
        <b-form-input
          v-if="row.item.name"
          type="number"
          step="0.1"
          v-model="row.item.prepaid"
          @change="updatePrepaidSum()"
        ></b-form-input>

        <span v-else>
          {{formatPrepaidSum}}
        </span>
      </template>
    </b-table>
    <p v-else>
      {{$t('panf.orderTable.noOrdersText')}}
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
      fields: ['id', 'name', 'meal', 'extras', 'mealPrice', 'prepaid'],
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
          this.orders[i].prepaid = parseFloat(this.prepaidCharges[i])
        }
      }
      const newShowOrderList = this.orders.map((order) => {
        return {
          id: order.tableId,
          name: order.name,
          meal: order.meal,
          extras: order.extras,
          price: order.mealPrice + order.extrasPrice,
          prepaid: order.prepaid
        }
      })

      newShowOrderList.push({})

      return newShowOrderList || []
    }
  },
  methods: {
    formatPrice(value) {
      // eslint-disable-next-line
      const val = (value / 1).toFixed(2).replace('.', ',')

      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
    updatePrepaidSum() {
      this.prepaidSum = this.prepaidCharges.reduce((prev, curr) => {
        if (curr) {
          return prev + parseFloat(curr)
        } else {
          return prev
        }
        // eslint-disable-next-line
      }, 0.0)

      this.$socket.emit('syncPrepaid', this.showOrderList)
    },
    makeToast(opts) {
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
    loadOrders() {
      this.$http.get(`${config.server.apiUrl}/order/getAllOrderList`)
        .then((res) => {
          this.orders = res.data
        })
        .catch((error) => {
          console.error('could not fetch orders: ', error)
        })
    },
    loadPrepaidCharges() {
      this.$http.get(`${config.server.apiUrl}/order/getPrepaidCharges`)
        .then((res) => {
          this.prepaidCharges = res.data
        })
        .catch((error) => {
          console.error('could not fetch prepaid charges: ', error)
        })
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
        this.prepaidSum = newVal.reduce((prev, curr) => {
          if (curr) {
            return prev + parseFloat(curr)
          } else {
            return prev
          }
          // eslint-disable-next-line
        }, 0.0)

        return newVal
      },
      deep: true
    }
  },
  created: function () { },
  mounted: function () {
    this.loadOrders()
    this.loadPrepaidCharges()

    this.sockets.subscribe('initOrders', (orders) => {
      this.orders = orders
    })

    this.sockets.subscribe('GETorder', (order) => {
      this.orders.push(order)
    })

    this.sockets.subscribe('UPDATEorder', (order) => {
      // eslint-disable-next-line
      this.$set(this.orders, parseInt(order.orderId) - 1, order)
    })

    this.sockets.subscribe('showOrderReceiption', (order) => {
      this.makeToast({
        title: 'Bestellung erhalten',
        content: `Hey ${order.name} ! \n ${
          order.meal
          } wurde zur Liste der Bestellungen hinzugefügt: -) \n Guten Hunger!`,
        variant: 'info'
      })
    })

    this.sockets.subscribe('FAILorder', (order) => {
      this.makeToast({
        title: 'Bestellung abgelehnt',
        content: `Hey ${
          order.name
          } ! \n Dein Name steht leider schon auf der Liste.Du musst einen anderen wählen.`,
        variant: 'danger'
      })
    })

    this.sockets.subscribe('initPaied', (paiedList) => {
      for (let i = 0; i < this.showOrderList.length; i++) {
        if (paiedList[i] !== null) {
          this.showOrderList[i].prepaid = parseFloat(paiedList[i])
        }
      }
    })

    this.sockets.subscribe('updatePrepaid', (paiedList) => {
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
  }
}
</script>

<style scoped>
</style>
