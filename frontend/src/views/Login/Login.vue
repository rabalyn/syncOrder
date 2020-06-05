<template>
  <b-container class="mt-2">
    <div v-if="!displayname">
      <b-row class="mr-2">
        <b-col cols="4" style="min-width: 2em;">
          <b-form-checkbox v-model="chosenOptionLogin" name="check-button" switch>
            <span v-if="chosenOptionLogin">Login</span>
            <span v-else>Register</span>
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="4">
          <b-form-group
            id="username"
            label="Enter your name"
            label-for="inputUsername"
            :invalid-feedback="invalidUsernameFeedback"
            :valid-feedback="validUsernameFeedback"
            :state="usernameState"
          >
            <b-form-input
              id="inputUsername"
              type="text"
              v-model="username"
              :state="usernameState"
              trim
              @keyup.enter="(usernameState && passwordState) ? { keyup: submit } : null"
            ></b-form-input>
          </b-form-group>
        </b-col>

        <b-col cols="4">
          <b-form-group
            id="password"
            label="Enter your password"
            label-for="inputPassword"
            :invalid-feedback="invalidPasswordFeedback"
            :valid-feedback="validPasswordFeedback"
            :state="passwordState"
          >
            <b-form-input
              id="inputPassword"
              type="password"
              v-model="password"
              :state="passwordState"
              trim
              @keyup.enter="(usernameState && passwordState) ? { keyup: submit } : null"
            ></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <b-button
            variant="success"
            :class="{ disabled: !(usernameState && passwordState) }"
            :disabled="!(usernameState && passwordState)"
            @click="submit"
          >
            <span v-if="chosenOptionLogin">Login</span>
            <span v-else>Register</span>
          </b-button>
        </b-col>
      </b-row>
    </div>
    <div v-else>
     <Userhome></Userhome>
    </div>
  </b-container>
</template>

<script>
import config from '../../config'

import Userhome from './Userhome.vue'

import debug from 'debug'

const log = debug(`Login:info`)
const logerror = debug(`Login:error`)
localStorage.debug = ` Login:* `

const USERNAME_MIN_LENGTH = 3
const USERNAME_MAX_LENGTH = 64
const PASSWORD_MIN_LENGTH = 8

// @vue/component
export default {
  components: {
    Userhome
  },
  data () {
    return {
      chosenOptionLogin: true,
      username: ``,
      password: ``
    }
  },
  computed: {
    displayname: {
      get () {
        return this.$store.state.user.displayname
      },
      set (val) {
        this.$store.commit(`updateMyDisplayname`, val)
      }
    },
    usernameState () {
      return this.username.length >= USERNAME_MIN_LENGTH
    },
    invalidUsernameFeedback () {
      if (this.username.length > USERNAME_MIN_LENGTH && this.username.length < USERNAME_MAX_LENGTH) {
        return ``
      } else if (this.username.length < USERNAME_MIN_LENGTH) {
        return `Enter at least ${USERNAME_MIN_LENGTH} characters`
      } else if (this.username.length > USERNAME_MAX_LENGTH) {
        return `Enter less than ${USERNAME_MAX_LENGTH} characters`
      } else {
        return `Please enter something`
      }
    },
    validUsernameFeedback () {
      return this.usernameState === true
        ? `Thank you`
        : ``
    },
    passwordState () {
      return this.password.length >= PASSWORD_MIN_LENGTH
    },
    invalidPasswordFeedback () {
      if (this.password.length > PASSWORD_MIN_LENGTH) {
        return ``
      } else if (this.password.length < PASSWORD_MIN_LENGTH) {
        return `Enter at least ${PASSWORD_MIN_LENGTH} characters`
      } else {
        return `Please enter something`
      }
    },
    validPasswordFeedback () {
      return this.passwordState === true
        ? `Thank you`
        : ``
    }
  },
  methods: {
    submit (e) {
      log(e)
      if ((e.type !== `click` && e.key !== `Enter`) || !this.usernameState || !this.passwordState) {
        return
      }
      log(`submit`)

      if (this.chosenOptionLogin) {
        log(`submit - login gettin called`)
        this.login()
      } else {
        log(`submit - register gettin called`)
        this.register()
      }
    },
    register () {
      log(`register`)
      this.$http
        .post(`${config.server.apiUrl}/auth/register`, {
          username: this.username,
          password: this.password
        })
        .then((res) => {
          log(`register: %O`, res)
        })
        .catch((reason) => {
          logerror(`register: %O`, reason)
        })
    },
    login () {
      log(`login`)
      this.$http
        .post(`${config.server.apiUrl}/auth/login`, {
          username: this.username,
          password: this.password
        })
        .then((res) => {
          log(`login: %O`, res)
          const userObj = res.data
          this.$store.commit(`updateMe`, userObj)
        })
        .catch((reason) => {
          logerror(`login: %O`, reason)
        })
    }
  }
}
</script>

<style scoped>
</style>
