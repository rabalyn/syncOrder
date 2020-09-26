<template>
  <div>
    <br>
    <b-button
      v-b-toggle.collapsePizza
      size="lg"
      variant="info"
    >
      {{ captionPizza }}
    </b-button>
    <b-collapse
      id="collapsePizza"
      visible
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

    <br>
    <b-button
      v-b-toggle.collapsePizzabread
      size="lg"
      variant="info"
    >
      {{ captionPizzabread }}
    </b-button>
    <b-collapse
      id="collapsePizzabread"
      visible
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

    <br>
    <b-button
      v-b-toggle.collapsePasta
      size="lg"
      variant="info"
    >
      {{ captionPasta }}
    </b-button>
    <b-collapse
      id="collapsePasta"
      visible
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

    <br>
    <b-button
      v-b-toggle.collapseVariations
      size="lg"
      variant="info"
    >
      {{ captionVariations }}
    </b-button>
    <b-collapse
      id="collapseVariations"
      visible
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

    <br>
    <b-button
      v-b-toggle.collapseAntipasti
      size="lg"
      variant="info"
    >
      {{ captionAntipasti }}
    </b-button>
    <b-collapse
      id="collapseAntipasti"
      visible
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

    <br>
    <b-button
      v-b-toggle.collapseSoup
      size="lg"
      variant="info"
    >
      {{ captionSoup }}
    </b-button>
    <b-collapse
      id="collapseSoup"
      visible
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

    <br>
    <b-button
      v-b-toggle.collapseSalad
      size="lg"
      variant="info"
    >
      {{ captionSalad }}
    </b-button>
    <b-collapse
      id="collapseSalad"
      visible
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

    <br>
    <b-button
      v-b-toggle.collapseFish
      size="lg"
      variant="info"
    >
      {{ captionFish }}
    </b-button>
    <b-collapse
      id="collapseFish"
      visible
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

    <br>
    <b-button
      v-b-toggle.collapsePork
      size="lg"
      variant="info"
    >
      {{ captionPork }}
    </b-button>
    <b-collapse
      id="collapsePork"
      visible
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

    <br>
    <b-button
      v-b-toggle.collapsVeal
      size="lg"
      variant="info"
    >
      {{ captionVeal }}
    </b-button>
    <b-collapse
      id="collapsVeal"
      visible
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

    <br>
    <b-button
      v-b-toggle.collapseBeef
      size="lg"
      variant="info"
    >
      {{ captionBeef }}
    </b-button>
    <b-collapse
      id="collapseBeef"
      visible
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

    <br>
    <b-button
      v-b-toggle.collapseExtras
      size="lg"
      variant="info"
    >
      {{ captionExtras }}
    </b-button>
    <b-collapse
      id="collapseExtras"
      visible
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
import config from '../../config.js'

export default {
  name: 'DaVinciMenuTable',
  props: {
  },
  data: function () {
    return {
      fields: {
        number: {
          label: 'Nummer',
          sortable: true
        },
        name: {
          label: 'Name',
          sortable: true
        },
        ingredients: {
          label: 'Zutaten'
        },
        price: {
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
  computed: {
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
  },
  methods: {
    formatPrice (value) {
      // eslint-disable-next-line
      const val = (value / 1).toFixed(2).replace('.', ',')

      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    }
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
