<template>
  <b-container
    id="orderContent"
    fluid
  >
    <h4>{{ $t('panf.newOrder.order') }}</h4>
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
            :placeholder="$t('panf.newOrder.name')"
          />
        </b-input-group>
      </b-col>
    </b-row>

    <b-row>
      <b-col cols="12">
        <b-input-group class="mt-3">
          <template slot="prepend">
            <div class="input-group-text">
              <font-awesome-icon icon="box" />
            </div>
          </template>
          <b-dropdown
            id="mealDropdown"
            :text="$t('panf.newOrder.meal')"
            variant="outline-secondary"
            boundary="window"
            dropright
            @shown="menulistDropdownClicked"
          >
            <template slot="button-content">
              {{ $t('panf.newOrder.meal') }}
            </template>

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
                :placeholder="$t('panf.newOrder.filterNameOrIngredient')"
              />
            </b-input-group>

            <div
              v-for="(categoryMealList, category) in filteredMenulist"
              :key="category"
            >
              <b-dropdown-divider />
              <b-dropdown-header>{{ $t(`panf.newOrder.categories.${category}`) }}</b-dropdown-header>
              <b-dropdown-item
                v-for="(meal, idx) in categoryMealList"
                :key="idx"
                @click="chooseMeal(meal)"
              >
                {{ $t(`panf.newOrder.meals.${meal.name}`) + `&nbsp;${formatPrice(meal.price)}€` }}
                <small v-if="meal.ingredients[0]">
                  {{ `(${meal.ingredients.map(x => $t(`panf.newOrder.extras.${x}`)).join(', ')})` }}
                </small>
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
          <small v-if="mealIngredients">
            ( {{ mealIngredients.map(x => $t(`panf.newOrder.extras.${x}`)).join(', ') }})
          </small>
        </b-badge>

        <span v-else>&nbsp;</span>
      </b-col>
    </b-row>

    <b-row>
      <b-col cols="12">
        <b-input-group class="mt-3">
          <template slot="prepend">
            <div class="input-group-text">
              <font-awesome-icon icon="comment" />
            </div>
          </template>

          <b-dropdown
            id="extraDropdown"
            text="Extras"
            variant="outline-secondary"
            dropright
            @shown="extrasDropdownClicked"
          >
            <template slot="button-content">
              {{ $t('panf.newOrder.extra') }}
            </template>

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
                placeholder="Extrazutat filtern..."
                @keyup="manualEnterIngredient"
              />
            </b-input-group>

            <b-dropdown-item
              v-for="(extra, extraIndex) in filteredExtralist"
              :key="extraIndex"
              @click="choseExtra(extra)"
            >
              <small>{{ $t(`panf.newOrder.extras.${extra.name}`) + `&nbsp;${formatPrice(extra.price)}€` }}</small>
            </b-dropdown-item>
          </b-dropdown>
        </b-input-group>
      </b-col>

      <b-col cols="12">
        <span
          v-for="(extra, idx) in extrasChosen"
          :key="idx"
        >
          <b-badge
            v-if="extra.name.match(/ohne|Ohne|kein|Kein|^-|^ -|^- |^ - /)"
            variant="danger"
            class="ml-1"
          >
            {{ extra.name }}
            <font-awesome-icon
              icon="times"
              @click="removeExtra(idx, extra)"
            />
          </b-badge>

          <b-badge
            v-else
            variant="success"
            class="ml-1"
          >
            +{{ extra.name }} ({{ formatPrice(extra.price) }}€)
            <font-awesome-icon
              icon="times"
              @click="removeExtra(idx, extra)"
            />
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
            v-model="sumPrice"
            disabled
          />
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
        >
          {{ $t('panf.newOrder.btnOrder') }}
        </b-button>&nbsp;&nbsp;
        <b-button
          class="mt-3"
          size="sm"
          variant="danger"
          :disabled="isResetOrderDisabled"
          @click="resetOrder"
        >
          {{ $t('panf.newOrder.btnReset') }}
        </b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import config from '../../config.js'

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
    filteredMenulist () {
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
    filteredExtralist () {
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
    sumPrice () {
      return `${this.formatPrice(this.mealPrice + this.extrasPrice)}€`
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

    this.$socket.$subscribe('loadSession', (session) => {
      if (session && session.order) {
        this.name = session.order.name
        this.meal = session.order.meal
        this.mealIngredients = session.order.ingredients || []
        this.mealPrice = session.order.mealPrice
        this.extrasChosen = session.order.extras || []
        // eslint-disable-next-line
        this.extrasPrice = session.order.extrasPrice || 0.0
        this.orderId = session.order.orderId || null
      }
    })

    this.$socket.$subscribe('reloadOrder', () => {
      this.resetOrder()
    })

    this.loadSession()
  },
  methods: {
    loadSession () {
      this.$http.get(`${config.server.apiUrl}/order/loadSession`)
        .then((res) => {
          const session = res.data

          if (session && session.order) {
            this.name = session.order.name
            this.meal = session.order.meal
            this.mealIngredients = session.order.ingredients || []
            this.mealPrice = session.order.mealPrice
            this.extrasChosen = session.order.extras || []
            // eslint-disable-next-line
            this.extrasPrice = session.order.extrasPrice || 0.0
            this.orderId = session.order.orderId || null
          }
        })
    },
    formatPrice (value) {
      // eslint-disable-next-line
      const val = (value / 1).toFixed(2).replace('.', ',')

      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
    getExtra (extraName) {
      const searchedExtra = this.extralist.filter((item) =>
        item.name.toLowerCase().includes(extraName.toLowerCase()))
      log(searchedExtra)

      // eslint-disable-next-line
      return searchedExtra.length === 1
        // eslint-disable-next-line
        ? searchedExtra[0]
        : null
    },
    chooseMeal (meal) {
      this.menulistFilter = ''
      this.meal = meal.name
      this.mealPrice = meal.price
      this.mealIngredients = meal.ingredients
    },
    choseExtra (extra) {
      this.extralistFilter = ''
      extra.type = 'add'
      this.extrasChosen.push(extra)
      this.extrasPrice += extra.price
    },
    removeExtra (idx, extra) {
      // eslint-disable-next-line
      this.extrasChosen.splice(idx, 1)
      this.extrasPrice -= extra.price
    },
    manualEnterIngredient (e) {
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
    menulistDropdownClicked () {
      this.$refs.menulistFilterInput.$el.focus()
    },
    extrasDropdownClicked () {
      this.$refs.extralistFilterInput.$el.focus()
    },
    placeOrder (e) {
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
        this.$socket.client.emit('POSTorder', {
          name: this.name,
          meal: this.meal,
          ingredients: this.mealIngredients,
          mealPrice: this.mealPrice,
          extras: this.extrasChosen,
          extrasPrice: this.extrasPrice,
          orderId: this.orderId
        })
      }
    },
    resetOrder (e) {
      if (e) {
        e.preventDefault()
      }

      this.name = null
      this.meal = null
      this.mealPrice = 0
      this.extrasChosen = []
      this.extrasPrice = 0
    }
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
