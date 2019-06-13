<template>
  <b-container
    id="orderContent"
    fluid
  >
    <h4>Bestellung</h4>
    <b-row>
      <b-col
        xs="12"
        sm="12"
        md="12"
        lg="6"
        xl="6"
      >
        <b-input-group class="mt-3">
          <b-input-group-text slot="prepend">
            <font-awesome-icon icon="user" />
          </b-input-group-text>
          <b-form-input
            v-model="name"
            placeholder="Name"
          ></b-form-input>
        </b-input-group>
      </b-col>
    </b-row>

    <b-row>
      <b-col cols="12">
        <b-input-group class="mt-3">
          <template slot="prepend">
            <div class="input-group-text">
              <font-awesome-icon icon="box"></font-awesome-icon>
            </div>
          </template>
          <b-dropdown
            id="mealDropdown"
            text="Mahlzeiten"
            variant="outline-secondary"
            boundary="window"
            dropright
            @shown="menulistDropdownClicked"
          >
            <template slot="button-content">Mahlzeiten</template>

            <b-input-group
              id="menulistFilterContainer"
              class="listFilterInput"
            >
              <b-input-group-text slot="prepend">
                <font-awesome-icon icon="search" />
              </b-input-group-text>
              <b-form-input
                ref="menulistFilterInput"
                v-model="menulistFilter"
                placeholder="Name oder Zutat filtern..."
              ></b-form-input>
            </b-input-group>

            <div
              v-bind:key="category"
              v-for="(categoryMealList, category) in filteredMenulist"
            >
              <b-dropdown-divider></b-dropdown-divider>
              <b-dropdown-header>{{ category }}</b-dropdown-header>
              <b-dropdown-item
                @click="choseMeal(meal)"
                v-bind:key="idx"
                v-for="(meal, idx) in categoryMealList"
              >
                {{ `${meal.name} ${formatPrice(meal.price)}€` }}
                <small>{{ `(${meal.ingredients.join(', ')})` }}</small>
              </b-dropdown-item>
            </div>
          </b-dropdown>
        </b-input-group>
      </b-col>
      <b-col cols="12">
        <b-badge
          v-if="meal"
          variant="light"
        >
          {{ meal }} {{ formatPrice(mealPrice) }}€
          <small>( {{ mealIngredients.join(', ') }})</small>
        </b-badge>

        <span v-else>&nbsp;</span>
      </b-col>
    </b-row>

    <b-row>
      <b-col cols="12">
        <b-input-group class="mt-3">
          <template slot="prepend">
            <div class="input-group-text">
              <font-awesome-icon icon="comment"></font-awesome-icon>
            </div>
          </template>

          <b-dropdown
            id="extraDropdown"
            text="Extras"
            variant="outline-secondary"
            dropright
            @shown="extrasDropdownClicked"
          >
            <template slot="button-content">Extras</template>

            <b-input-group
              id="extralistFilterContainer"
              class="listFilterInput"
            >
              <b-input-group-text slot="prepend">
                <font-awesome-icon icon="search" />
              </b-input-group-text>
              <b-form-input
                ref="extralistFilterInput"
                v-model="extralistFilter"
                @keyup="manualEnterIngredient"
                placeholder="Extrazutat filtern..."
              ></b-form-input>
            </b-input-group>

            <b-dropdown-item
              @click="choseExtra(extra)"
              v-bind:key="extraIndex"
              v-for="(extra, extraIndex) in filteredExtralist"
            >
              <small>{{ `${extra.name} ${formatPrice(extra.price)}€` }}</small>
            </b-dropdown-item>
          </b-dropdown>
        </b-input-group>
      </b-col>

      <b-col cols="12">
        <span
          v-bind:key="idx"
          v-for="(extra, idx) in extrasChosen"
        >
          <b-badge
            v-if="extra.name.match(/ohne|Ohne|kein|Kein^-|^ -/)"
            variant="danger"
          >
            {{ extra.name }}
            <font-awesome-icon
              icon="times"
              @click="removeExtra(idx, extra)"
            ></font-awesome-icon>
          </b-badge>

          <b-badge
            v-else
            variant="success"
          >
            +{{ extra.name }} ({{ formatPrice(extra.price) }}€)
            <font-awesome-icon
              icon="times"
              @click="removeExtra(idx, extra)"
            ></font-awesome-icon>
          </b-badge>&nbsp;
        </span>
        <span v-if="extrasChosen.length === 0">&nbsp;</span>
      </b-col>
    </b-row>

    <b-row>
      <b-col
        xs="12"
        sm="12"
        md="12"
        lg="6"
        xl="6"
      >
        <b-input-group class="mt-3">
          <b-input-group-text slot="prepend">
            <font-awesome-icon icon="money-bill-alt" />
          </b-input-group-text>
          <b-form-input
            disabled
            v-model="sumPrice"
          ></b-form-input>
        </b-input-group>
      </b-col>
    </b-row>

    <b-row>
      <b-col
        xs="12"
        sm="12"
        md="12"
        lg="6"
        xl="6"
      >
        <b-button
          class="mt-3"
          size="sm"
          variant="success"
          :disabled="isPlaceOrderDisabled"
          @click="placeOrder"
        >Bestellen</b-button>&nbsp;&nbsp;
        <b-button
          class="mt-3"
          size="sm"
          variant="danger"
          :disabled="isResetOrderDisabled"
          @click="resetOrder"
        >Auswahl zurücksetzen</b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import config from '../config.js'

import debug from 'debug'
const log = debug('panf:newOrder:info')
localStorage.debug += ' panf:newOrder:* '

export default {
  name: 'PanfNewOrder',
  props: {},
  data: function () {
    return {
      menulist: {},
      extralist: [],
      menulistFilter: '',
      extralistFilter: '',
      name: null,
      meal: null,
      mealIngredients: [],
      mealPrice: 0.0,
      extrasChosen: [],
      extrasPrice: 0.0,
      orderId: null,
      show: false,
      title: 'Bestellung aufgeben - DaVinci'
    }
  },
  computed: {
    isPlaceOrderDisabled: function () {
      return !this.name || !this.meal
    },
    isResetOrderDisabled: function () {
      // eslint-disable-next-line
      return !this.name && !this.meal && !this.extrasChosen[0]
    },
    filteredMenulist() {
      if (this.menulistFilter === '') {
        return this.menulist
      } else {
        const filteredMenuList = {}
        for (const category in this.menulist) {
          const meallist = this.menulist[category]

          const filteredMealList = meallist.filter((item) =>
            item.name
              .toLowerCase()
              .includes(this.menulistFilter.toLowerCase()) ||
            item.ingredients
              .join('')
              .toLowerCase()
              .includes(this.menulistFilter.toLowerCase()))
          filteredMenuList[category] = filteredMealList
        }

        return filteredMenuList
      }
    },
    filteredExtralist() {
      if (this.extralistFilter === '') {
        return this.extralist
      } else {
        const filteredExtraList = this.extralist.filter((item) =>
          item.name
            .toLowerCase()
            .includes(this.extralistFilter.toLowerCase()) ||
          item.ingredients
            .join('')
            .toLowerCase()
            .includes(this.extralistFilter.toLowerCase()))

        return filteredExtraList
      }
    },
    sumPrice() {
      return `${this.formatPrice(this.mealPrice + this.extrasPrice)}€`
    }
  },
  methods: {
    formatPrice(value) {
      // eslint-disable-next-line
      const val = (value / 1).toFixed(2).replace('.', ',')

      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
    getExtra(extraName) {
      const searchedExtra = this.extralist.filter((item) =>
        item.name.toLowerCase().includes(extraName.toLowerCase()))
      log(searchedExtra)

      // eslint-disable-next-line
      return searchedExtra.length === 1
        // eslint-disable-next-line
        ? searchedExtra[0]
        : null
    },
    choseMeal(meal) {
      this.menulistFilter = ''
      this.meal = meal.name
      this.mealPrice = meal.price
      this.mealIngredients = meal.ingredients
    },
    choseExtra(extra) {
      this.extralistFilter = ''
      extra.type = 'add'
      this.extrasChosen.push(extra)
      this.extrasPrice += extra.price
    },
    removeExtra(idx, extra) {
      // eslint-disable-next-line
      this.extrasChosen.splice(idx, 1)
      this.extrasPrice -= extra.price
    },
    manualEnterIngredient(e) {
      const KEY_CODE_ENTER = 13
      if (e.keyCode === KEY_CODE_ENTER) {
        // Enter was released
        const inputValue = e.target.value
        if (
          inputValue.toLowerCase().includes('ohne') ||
          inputValue.includes('-')
        ) {
          this.extralistFilter = ''
          log(e.target)
          this.extrasChosen.push({
            name: inputValue,
            price: '',
            type: 'remove'
          })
        } else {
          const chosenExtra = this.getExtra(inputValue)
          if (chosenExtra !== null) {
            this.choseExtra(chosenExtra)
            this.extralistFilter = ''
          }
        }
      }
    },
    menulistDropdownClicked() {
      this.$refs.menulistFilterInput.$el.focus()
    },
    extrasDropdownClicked() {
      this.$refs.extralistFilterInput.$el.focus()
    },
    placeOrder(e) {
      e.preventDefault()

      if (!this.name || !this.meal || !this.mealPrice) {
        this.$bvToast.toast(
          'Dein Name und eine Mahlzeit sind für eine Bestellung obligatorisch.',
          {
            title: 'Ungültige Bestellung!',
            variant: 'danger',
            solid: true,
            autoHideDelay: 7500
          }
        )
      } else {
        this.$socket.emit('POSTorder', {
          name: this.name,
          meal: this.meal,
          mealPrice: this.mealPrice,
          extras: this.extrasChosen,
          extrasPrice: this.extrasPrice,
          orderId: this.orderId
        })

        this.resetOrder(e)
      }
    },
    resetOrder(e) {
      if (e) {
        e.preventDefault()
      }

      this.name = null
      this.meal = null
      this.mealPrice = 0
      this.extrasChosen = []
      this.extrasPrice = 0
    }
  },
  watch: {},
  created: function () { },
  mounted: function () {
    this.$http
      .get(`${config.server.apiUrl}/davinci/getDaVinciMenu`, {
        credentials: true
      })
      .then((res) => {
        this.extralist = res.data.extras
        delete res.data.extras
        this.menulist = res.data
      })

    this.sockets.subscribe('loadSession', (session) => {
      if (session && session.order) {
        this.name = session.order.name
        this.meal = session.order.meal
        this.mealPrice = session.order.mealPrice
        this.extrasChosen = session.order.extras || []
        // eslint-disable-next-line
        this.extrasPrice = session.order.extrasPrice || 0.0
        this.orderId = session.order.orderId || null
      }
    })

    this.sockets.subscribe('reloadOrder', () => {
      this.resetOrder()
    })
  }
}
</script>

<style scoped>
.form-control-plaintext {
  display: block;
  width: 100%;
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
  margin-bottom: 0;
  line-height: 1.5;
  color: #212529;
  background-color: transparent;
  border: solid #ced4da;
  border-width: 1px 0;
}

.listFilterInput {
  margin-left: 0.5em;
  padding-right: 1em;
}

#extralistFilterContainer {
  min-width: 13em;
}
</style>
