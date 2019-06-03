<template>
  <b-container id="orderContent" fluid>
    <h4>Bestellung</h4>
    <b-input-group class="mt-3">
      <b-input-group-text slot="prepend"><font-awesome-icon icon="user" /></b-input-group-text>
      <b-form-input v-model="name" :required="true" placeholder="Name"></b-form-input>
    </b-input-group>

    <b-input-group class="mt-3">
      <template slot="prepend">
        <div class="input-group-text">
          <font-awesome-icon icon="box"></font-awesome-icon>
        </div>
      </template>
      <b-form-input
        v-model="showOrder"
        plaintext
        required
        placeholder="Mahlzeit"
        class="form-control"
      ></b-form-input>
      <b-dropdown
        id="mealDropdown"
        text="Mahlzeiten"
        variant="outline-secondary"
        boundary="window"
        dropright
        @shown="menulistDropdownClicked"
      >
        <template slot="button-content">
          Mahlzeiten
        </template>

        <b-input-group id="menulistFilterContainer" class="listFilterInput">
          <b-input-group-text slot="prepend"><font-awesome-icon icon="search" /></b-input-group-text>
          <b-form-input
            ref="menulistFilterInput"
            v-model="menulistFilter"
            placeholder="Name oder Zutat filtern..."
          ></b-form-input>
        </b-input-group>

        <div v-bind:key="category" v-for="(categoryMealList, category) in filteredMenulist">
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-header> {{ category }} </b-dropdown-header>
          <b-dropdown-item @click="choseMeal(meal)" v-bind:key="idx" v-for="(meal, idx) in categoryMealList">
            {{ `${meal.name} ${formatPrice(meal.price)}€` }}
            <small>{{ `(${meal.ingredients.join(', ')})` }}</small>
          </b-dropdown-item>
        </div>
      </b-dropdown>
    </b-input-group>

    <b-input-group class="mt-3">
      <template slot="prepend">
        <div  class="input-group-text">
          <font-awesome-icon icon="comment"></font-awesome-icon>
        </div>
      </template>

      <b-form-input
        v-model="showExtras"
        v-html="showExtras"
        plaintext
        placeholder="Extras, Abbestellungen"
        class="form-control"
      ></b-form-input>
      <b-dropdown
        id="extraDropdown"
        text="Extras"
        variant="outline-secondary"
        dropright
        @shown="extrasDropdownClicked"
      >
        <template slot="button-content">
          Extras
        </template>

        <b-input-group id="extralistFilterContainer" class="listFilterInput">
          <b-input-group-text slot="prepend"><font-awesome-icon icon="search" /></b-input-group-text>
          <b-form-input
            ref="extralistFilterInput"
            v-model="extralistFilter"
            @keyup="manualEnterIngredient"
            placeholder="Extrazutat filtern..."
          ></b-form-input>
        </b-input-group>

        <b-dropdown-item @click="choseExtra(extra)" v-bind:key="extraIndex" v-for="(extra, extraIndex) in filteredExtralist">
          <small>{{ `${extra.name} ${formatPrice(extra.price)}€` }}</small>
        </b-dropdown-item>
      </b-dropdown>
    </b-input-group>

    <b-input-group class="mt-3">
      <b-input-group-text slot="prepend"><font-awesome-icon icon="money-bill-alt" /></b-input-group-text>
      <b-form-input v-model="sumPrice"></b-form-input>
    </b-input-group>

    <b-button class="mt-3" size="sm" variant="success" @click="placeOrder">
      Bestellen
    </b-button>

    &nbsp;&nbsp;

    <b-button class="mt-3" size="sm" variant="danger" @click="resetOrder">
      Auswahl zurücksetzen
    </b-button>
  </b-container>
</template>

<script>
import config from '../config.js'

import debug from 'debug'
const log = debug('panf:newOrder:info')
localStorage.debug += ' panf:newOrder:* '

export default {
  name: 'PanfNewOrder',
  props: {
  },
  data: function () {
    return {
      menulist: {},
      extralist: [],
      menulistFilter: '',
      extralistFilter: '',
      name: null,
      meal: null,
      mealIngredients: [],
      mealPrice: 0.00,
      extrasChosen: [],
      extrasPrice: 0.00,
      show: false,
      title: 'Bestellung aufgeben - DaVinci'
    }
  },
  computed: {
    filteredMenulist () {
      if (this.menulistFilter === '') {
        return this.menulist
      } else {
        let filteredMenuList = {}
        for (let category in this.menulist) {
          const meallist = this.menulist[category]

          const filteredMealList = meallist.filter(
            item => (
              item.name.toLowerCase().includes(this.menulistFilter.toLowerCase()) ||
              item.ingredients.join('').toLowerCase().includes(this.menulistFilter.toLowerCase())
            )
          )
          filteredMenuList[category] = filteredMealList
        }

        return filteredMenuList
      }
    },
    filteredExtralist () {
      if (this.extralistFilter === '') {
        return this.extralist
      } else {
        const filteredExtraList = this.extralist.filter(
          item => (
            item.name.toLowerCase().includes(this.extralistFilter.toLowerCase()) ||
            item.ingredients.join('').toLowerCase().includes(this.extralistFilter.toLowerCase())
          )
        )

        return filteredExtraList
      }
    },
    showOrder () {
      if (this.meal) {
        return `${this.meal} ${this.formatPrice(this.mealPrice)}€ (${this.mealIngredients.join(', ')})`
      } else {
        return ``
      }
    },
    showExtras () {
      if (this.extrasChosen.length > 0) {
        // return `<b-badge variant="success">Success</b-badge>`
        return `${this.extrasChosen.map(extra => `${extra.name} (${this.formatPrice(extra.price)}€)`).join(', ')}`
      } else {
        return ``
      }
    },
    sumPrice () {
      return `${this.formatPrice(this.mealPrice + this.extrasPrice)}€`
    }
  },
  methods: {
    formatPrice (value) {
      let val = (value / 1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
    getExtra (extraName) {
      const searchedExtra = this.extralist.filter(item => item.name.toLowerCase().includes(extraName.toLowerCase()))
      console.log(searchedExtra)

      return searchedExtra.length === 1 ? searchedExtra[0] : null
    },
    choseMeal (meal) {
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
    manualEnterIngredient (e) {
      if (e.keyCode === 13) { // Enter was released
        const inputValue = e.target.value
        if (inputValue.includes('ohne') || inputValue.includes('-')) {
          e.target.value = ''
          this.extrasChosen.push({
            name: inputValue,
            price: '',
            type: 'remove'
          })
        } else {
          const chosenExtra = this.getExtra(inputValue)
          if (chosenExtra !== null) {
            this.choseExtra(chosenExtra)
            e.target.value = ''
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
        this.$bvToast.toast('Dein Name und eine Mahlzeit sind für eine Bestellung obligatorisch.', {
          title: 'Ungültige Bestellung!',
          variant: 'danger',
          solid: true,
          autoHideDelay: 7500
        })
      } else {
        this.$socket.emit('POSTorder', {
          name: this.name,
          meal: this.meal,
          mealPrice: this.mealPrice,
          extras: this.extrasChosen,
          extrasPrice: this.extrasPrice
        })

        this.resetOrder()
      }
    },
    resetOrder (e) {
      e.preventDefault()

      this.name = null
      this.meal = null
      this.mealPrice = 0
      this.extrasChosen = []
      this.extrasPrice = 0
    }
  },
  watch: {
  },
  created: function () {
  },
  mounted: function () {
    log('session id: %s', this.$session.id())
    this.$http
      .get(`${config.server.apiUrl}/davinci/getDaVinciMenu`, { credentials: true })
      .then((res) => {
        console.log(res)
        this.extralist = res.data.extras
        delete res.data.extras
        this.menulist = res.data
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
