<template>
  <div>
    <br />
    <b-button
      size="lg"
      variant="info"
      v-b-toggle.collapsePizza
    >{{ captionPizza }}</b-button>
    <b-collapse
      visible
      id="collapsePizza"
      class="mt-2"
    >
      <b-table
        responsive
        striped
        hover
        :items="menu['pizza']"
        :fields="fields"
      >
        <template
          slot="ingredients"
          slot-scope="data"
        >
          {{ data.item.ingredients.join(', ') }}
        </template>

        <template
          slot="price"
          slot-scope="data"
        >
          {{ formatPrice(data.item.price) }}€
        </template>
      </b-table>
    </b-collapse>

    <br />
    <b-button
      size="lg"
      variant="info"
      v-b-toggle.collapsePizzabread
    >{{ captionPizzabread }}</b-button>
    <b-collapse
      visible
      id="collapsePizzabread"
      class="mt-2"
    >
      <b-table
        responsive
        striped
        hover
        :items="menu['pizzabread']"
        :fields="fields"
      >
        <template
          slot="ingredients"
          slot-scope="data"
        >
          {{ data.item.ingredients.join(', ') }}
        </template>

        <template
          slot="price"
          slot-scope="data"
        >
          {{ formatPrice(data.item.price) }}€
        </template>
      </b-table>
    </b-collapse>

    <br />
    <b-button
      size="lg"
      variant="info"
      v-b-toggle.collapsePasta
    >{{ captionPasta }}</b-button>
    <b-collapse
      visible
      id="collapsePasta"
      class="mt-2"
    >
      <b-table
        responsive
        striped
        hover
        :items="menu['pasta']"
        :fields="fields"
      >
        <template
          slot="ingredients"
          slot-scope="data"
        >
          {{ data.item.ingredients.join(', ') }}
        </template>

        <template
          slot="price"
          slot-scope="data"
        >
          {{ formatPrice(data.item.price) }}€
        </template>
      </b-table>
    </b-collapse>

    <br />
    <b-button
      size="lg"
      variant="info"
      v-b-toggle.collapseVariations
    >{{ captionVariations }}</b-button>
    <b-collapse
      visible
      id="collapseVariations"
      class="mt-2"
    >
      <b-table
        responsive
        striped
        hover
        :items="menu['variations']"
        :fields="fields"
      >
        <template
          slot="ingredients"
          slot-scope="data"
        >
          {{ data.item.ingredients.join(', ') }}
        </template>

        <template
          slot="price"
          slot-scope="data"
        >
          {{ formatPrice(data.item.price) }}€
        </template>
      </b-table>
    </b-collapse>

    <br />
    <b-button
      size="lg"
      variant="info"
      v-b-toggle.collapseAntipasti
    >{{ captionAntipasti }}</b-button>
    <b-collapse
      visible
      id="collapseAntipasti"
      class="mt-2"
    >
      <b-table
        responsive
        striped
        hover
        :items="menu['antipasti']"
        :fields="fields"
      >
        <template
          slot="ingredients"
          slot-scope="data"
        >
          {{ data.item.ingredients.join(', ') }}
        </template>

        <template
          slot="price"
          slot-scope="data"
        >
          {{ formatPrice(data.item.price) }}€
        </template>
      </b-table>
    </b-collapse>

    <br />
    <b-button
      size="lg"
      variant="info"
      v-b-toggle.collapseSoup
    >{{ captionSoup }}</b-button>
    <b-collapse
      visible
      id="collapseSoup"
      class="mt-2"
    >
      <b-table
        responsive
        striped
        hover
        :items="menu['soup']"
        :fields="fields"
      >
        <template
          slot="ingredients"
          slot-scope="data"
        >
          {{ data.item.ingredients.join(', ') }}
        </template>

        <template
          slot="price"
          slot-scope="data"
        >
          {{ formatPrice(data.item.price) }}€
        </template>
      </b-table>
    </b-collapse>

    <br />
    <b-button
      size="lg"
      variant="info"
      v-b-toggle.collapseSalad
    >{{ captionSalad }}</b-button>
    <b-collapse
      visible
      id="collapseSalad"
      class="mt-2"
    >
      <b-table
        responsive
        striped
        hover
        :items="menu['salad']"
        :fields="fields"
      >
        <template
          slot="ingredients"
          slot-scope="data"
        >
          {{ data.item.ingredients.join(', ') }}
        </template>

        <template
          slot="price"
          slot-scope="data"
        >
          {{ formatPrice(data.item.price) }}€
        </template>
      </b-table>
    </b-collapse>

    <br />
    <b-button
      size="lg"
      variant="info"
      v-b-toggle.collapseFish
    >{{ captionFish }}</b-button>
    <b-collapse
      visible
      id="collapseFish"
      class="mt-2"
    >
      <b-table
        responsive
        striped
        hover
        :items="menu['fish']"
        :fields="fields"
      >
        <template
          slot="ingredients"
          slot-scope="data"
        >
          {{ data.item.ingredients.join(', ') }}
        </template>

        <template
          slot="price"
          slot-scope="data"
        >
          {{ formatPrice(data.item.price) }}€
        </template>
      </b-table>
    </b-collapse>

    <br />
    <b-button
      size="lg"
      variant="info"
      v-b-toggle.collapsePork
    >{{ captionPork }}</b-button>
    <b-collapse
      visible
      id="collapsePork"
      class="mt-2"
    >
      <b-table
        responsive
        striped
        hover
        :items="menu['pork']"
        :fields="fields"
      >
        <template
          slot="ingredients"
          slot-scope="data"
        >
          {{ data.item.ingredients.join(', ') }}
        </template>

        <template
          slot="price"
          slot-scope="data"
        >
          {{ formatPrice(data.item.price) }}€
        </template>
      </b-table>
    </b-collapse>

    <br />
    <b-button
      size="lg"
      variant="info"
      v-b-toggle.collapsVeal
    >{{ captionVeal }}</b-button>
    <b-collapse
      visible
      id="collapsVeal"
      class="mt-2"
    >
      <b-table
        responsive
        striped
        hover
        :items="menu['veal']"
        :fields="fields"
      >
        <template
          slot="ingredients"
          slot-scope="data"
        >
          {{ data.item.ingredients.join(', ') }}
        </template>

        <template
          slot="price"
          slot-scope="data"
        >
          {{ formatPrice(data.item.price) }}€
        </template>
      </b-table>
    </b-collapse>

    <br />
    <b-button
      size="lg"
      variant="info"
      v-b-toggle.collapseBeef
    >{{ captionBeef }}</b-button>
    <b-collapse
      visible
      id="collapseBeef"
      class="mt-2"
    >
      <b-table
        responsive
        striped
        hover
        :items="menu['beef']"
        :fields="fields"
      >
        <template
          slot="ingredients"
          slot-scope="data"
        >
          {{ data.item.ingredients.join(', ') }}
        </template>

        <template
          slot="price"
          slot-scope="data"
        >
          {{ formatPrice(data.item.price) }}€
        </template>
      </b-table>
    </b-collapse>

    <br />
    <b-button
      size="lg"
      variant="info"
      v-b-toggle.collapseExtras
    >{{ captionExtras }}</b-button>
    <b-collapse
      visible
      id="collapseExtras"
      class="mt-2"
    >
      <b-table
        responsive
        striped
        hover
        :items="menu['extras']"
        :fields="fields"
      >
        <template
          slot="ingredients"
          slot-scope="data"
        >
          {{ data.item.ingredients.join(', ') }}
        </template>

        <template
          slot="price"
          slot-scope="data"
        >
          {{ formatPrice(data.item.price) }}€
        </template>
      </b-table>
    </b-collapse>

  </div>
</template>

<script>
import config from '../config.js'

export default {
  name: 'DaVinciMenuTable',
  data: function () {
    return {
      fields: {
        'number': {
          label: 'Nummer',
          sortable: true
        },
        'name': {
          label: 'Name',
          sortable: true
        },
        'ingredients': {
          label: 'Zutaten'
        },
        'price': {
          label: 'Preis',
          sortable: true
        }
      },
      menu: [],
      captionPizza: 'Pizza',
      isVisible: true,
      captionPizzabread: 'Pizzabrote',
      captionPasta: 'Pasta',
      captionVariations: 'Variationen',
      captionAntipasti: 'Antipasti',
      captionSoup: 'Suppen',
      captionSalad: 'Salate',
      captionFish: 'Fisch',
      captionPork: 'Schweinefleisch',
      captionVeal: 'Kalbfleisch',
      captionBeef: 'Rindfleisch',
      captionExtras: 'Extras'
    }
  },
  props: {
  },
  computed: {
  },
  methods: {
    formatPrice(value) {
      // eslint-disable-next-line
      const val = (value / 1).toFixed(2).replace('.', ',')

      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    }
  },
  watch: {
  },
  created: function () {
  },
  mounted: function () {
    this.$http
      .get(`${config.server.apiUrl}/davinci/getDaVinciMenu`)
      .then((res) => {
        this.menu = res.data
      })
  }
}
</script>

<style scoped>
.btn.btn-info.btn-lg.collapsed {
  margin-bottom: 2em;
  background-color: #dc3545;
  border-color: #bd2130;
}
</style>
