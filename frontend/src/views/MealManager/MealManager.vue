<template>
  <b-container fluid>
    <h1>Meal Manager</h1>
    <b-row>
      <b-col cols="6">
        <h3>Mahlzeiten</h3>
        <ul>
          <li v-for="meal in meals" :key="meal.id">
            <div @click.prevent="readMeal(meal.id)">
              {{ meal.name }}, {{ meal.price }}€ <br />
              <b-button variant="danger" @click.prevent="deleteMeal(meal.id)">Löschen</b-button>
            </div>
          </li>
        </ul>
      </b-col>

      <b-col cols="6">
        <b-card bg-variant="light">
          <b-form-group
            label-cols-lg="3"
            label="Mahlzeit hinzufügen"
            label-size="lg"
            label-class="font-weight-bold pt-0"
            class="mb-0"
          >
            <b-form-group
              label-cols-sm="3"
              label="Name:"
              label-align-sm="right"
              label-for="meal-name"
            >
              <b-form-input id="meal-name" v-model="meal.name"></b-form-input>
            </b-form-group>

            <b-form-group
              label-cols-sm="3"
              label="Preis:"
              label-align-sm="right"
              label-for="meal-price"
            >
              <b-form-input id="meal-price" v-model="meal.price"></b-form-input>
            </b-form-group>

            <div v-if="!meal.id">
              <b-button @click.prevent="addMeal" variant="success">Speichern</b-button>
            </div>
            <div v-else>
              <b-button @click.prevent="updateMeal(meal.id)" variant="info">Aktualisieren</b-button>
              <b-button @click.prevent="resetMeal" class="ml-2" variant="primary">Neu</b-button>
            </div>
          </b-form-group>
        </b-card>
      </b-col>
    </b-row>

    <hr />

    <b-row>
      <b-col cols="6">
        <h3>Zutatenliste</h3>
        <ul>
          <li v-for="ingredient in ingredients" :key="ingredient.id">
            <div @click.prevent="readIngredient(ingredient.id)">
              {{ ingredient.name }}, {{ ingredient.price }}€ <br />
              <b-button variant="danger" @click.prevent="deleteIngridient(ingredient.id)">Löschen</b-button>
            </div>
          </li>
        </ul>
      </b-col>

      <b-col cols="6">
        <b-card bg-variant="light">
          <b-form-group
            label-cols-lg="3"
            label="Zutat hinzufügen"
            label-size="lg"
            label-class="font-weight-bold pt-0"
            class="mb-0"
          >
            <b-form-group
              label-cols-sm="3"
              label="Name:"
              label-align-sm="right"
              label-for="ingredient-name"
            >
              <b-form-input id="ingredient-name" v-model="ingredient.name"></b-form-input>
            </b-form-group>

            <b-form-group
              label-cols-sm="3"
              label="Preis:"
              label-align-sm="right"
              label-for="ingredient-price"
            >
              <b-form-input id="ingredient-price" v-model="ingredient.price"></b-form-input>
            </b-form-group>

            <div v-if="!ingredient.id">
              <b-button @click.prevent="addIngridient" variant="success">Speichern</b-button>
            </div>
            <div v-else>
              <b-button @click.prevent="updateIngridient(ingredient.id)" variant="info">Aktualisieren</b-button>
              <b-button @click.prevent="resetIngredient" class="ml-2" variant="primary">Neu</b-button>
            </div>
          </b-form-group>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
// @ is an alias to /src
import config from '../../config'

export default {
  name: 'MealManager',
  components: {
  },
  props: {},
  data: function () {
    return {
      meals: [],
      meal: {
        name: '',
        price: null
      },
      ingredients: [],
      ingredient: {
        id: null,
        name: '',
        price: null
      }
    }
  },
  computed: {},
  watch: {},
  created: function () {
    this.readMeals()
    this.readIngredients()
  },
  mounted () {
  },
  methods: {
    readMeal (id) {
      fetch(`${config.server.apiUrl}/meals/${id}`)
        .then((res) => res.json())
        .then((jsonResponse) => {
          this.meal.id = jsonResponse.id
          this.meal.name = jsonResponse.name
          this.meal.price = jsonResponse.price
        })
    },
    readMeals () {
      fetch(`${config.server.apiUrl}/meals`)
        .then((res) => res.json())
        .then((jsonResponse) => {
          this.meals = jsonResponse
        })
    },
    addMeal () {
      fetch(`${config.server.apiUrl}/meals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'same-origin',
        body: JSON.stringify(this.meal)
      })
        .then((res) => res.json())
        .then((jsonResponse) => {
          this.readMeals()
        })
    },
    updateMeal (id) {
      fetch(`${config.server.apiUrl}/meals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        mode: 'same-origin',
        body: JSON.stringify(this.meal)
      })
        .then((res) => res.json())
        .then((jsonResponse) => {
          this.readMeals()
        })
    },
    resetMeal () {
      this.meal = {
        id: null,
        name: '',
        price: null
      }
    },
    deleteMeal (id) {
      this.resetMeal()
      fetch(`${config.server.apiUrl}/meals/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        mode: 'same-origin'
      })
        .then((res) => res.json())
        .then((jsonResponse) => {
          this.readMeals()
        })
    },

    readIngredient (id) {
      fetch(`${config.server.apiUrl}/ingredients/${id}`)
        .then((res) => res.json())
        .then((jsonResponse) => {
          this.ingredient.id = jsonResponse.id
          this.ingredient.name = jsonResponse.name
          this.ingredient.price = jsonResponse.price
        })
    },
    readIngredients () {
      fetch(`${config.server.apiUrl}/ingredients`)
        .then((res) => res.json())
        .then((jsonResponse) => {
          this.ingredients = jsonResponse
        })
    },
    addIngridient () {
      fetch(`${config.server.apiUrl}/ingredients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'same-origin',
        body: JSON.stringify(this.ingredient)
      })
        .then((res) => res.json())
        .then((jsonResponse) => {
          this.readIngredients()
        })
    },
    updateIngridient (id) {
      fetch(`${config.server.apiUrl}/ingredients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        mode: 'same-origin',
        body: JSON.stringify(this.ingredient)
      })
        .then((res) => res.json())
        .then((jsonResponse) => {
          this.readIngredients()
        })
    },
    resetIngredient () {
      this.ingredient = {
        id: null,
        name: '',
        price: null
      }
    },
    deleteIngridient (id) {
      this.readIngredient()
      fetch(`${config.server.apiUrl}/ingredients/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        mode: 'same-origin'
      })
        .then((res) => res.json())
        .then((jsonResponse) => {
          this.readIngredients()
        })
    }
  }
}
</script>
