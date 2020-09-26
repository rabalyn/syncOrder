<template>
  <b-container class="mt-2">
    <ul>
      <li>Username: {{ displayusername }}</li>
      <li>
        <b-input-group
          prepend="Anzeigename"
          class="mt-3"
        >
          <b-form-input
            v-model="displayname"
            type="text"
            placeholder="Anzeigename"
          />
          <b-input-group-append>
            <b-button
              variant="outline-success"
              @click="saveDisplayname"
            >
              Anzeigenamen speichern
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </li>

      <li>
        <b-input-group
          prepend="E-Mail"
          class="mt-3"
        >
          <b-form-input
            v-model="displayemail"
            type="text"
            placeholder="E-Mail"
          />
          <b-input-group-append>
            <b-button
              variant="outline-success"
              @click="saveEmail"
            >
              E-Mail speichern
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </li>

      <li>
        Neues Passwort:
        <b-input
          type="password"
          placeholder="Passwort"
          :v-model="passwordInput"
        />
      </li>

      <li>
        Neues Passwort bestätigen:
        <div>
          <b-input
            type="password"
            placeholder="Password bestätigen"
            :v-model="passwordReenterInput"
          />
          <b-button @click="savePassword">
            Neues Passwort speichern
          </b-button>
        </div>
      </li>
    </ul>
    <b-button
      variant="danger"
      @click="logout"
    >
      Logout
    </b-button>
  </b-container>
</template>

<script>
import config from '../../config'

import debug from 'debug'

const log = debug('Login:Userhome:info')
const logerror = debug('Login:Userhome:error')
localStorage.debug = ' Login:Userhome:* '

export default {
  componentes: {
  },
  data () {
    return {
      // eslint-disable-next-line
      emailRegEx: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
      passwordInput: null,
      passwordReenterInput: null
    }
  },
  computed: {
    displayusername: {
      get () {
        return this.$store.state.user.username
      },
      set (val) {
        this.$store.commit('updateMyUsername', val)
      }
    },
    displayname: {
      get () {
        return this.$store.state.user.displayname
      },
      set (val) {
        this.$store.commit('updateMyDisplayname', val)
      }
    },
    displayemail: {
      get () {
        return this.$store.state.user.email
      },
      set (val) {
        this.$store.commit('updateMyEmail', val)
      }
    }
  },
  methods: {
    logout () {
      this.$store.commit('updateMe', {})
      this.$http
        .post(`${config.server.apiUrl}/auth/logout`)
        .then((res) => {
          log('logout: %O', res)
          this.$store.commit('updateMe', {})
        })
        .catch((reason) => {
          logerror('logout: %O', reason)
        })
    },
    updateMe (updateObj) {
      this.$http
        .post(`${config.server.apiUrl}/user/updateme`, {
          updateObj
        })
        .then((res) => {
          log('logout: %O', res)
          const updatedUserAttrs = (res.data && res.data.user)
            ? res.data.user
            : null

          if (updatedUserAttrs) {
            this.$store.commit('updateMe', updatedUserAttrs)
          }
        })
        .catch((reason) => {
          logerror('saveEmail: %O', reason)
        })
    },
    saveDisplayname () {
      const updateObj = { displayname: this.displayname }
      this.updateMe(updateObj)
    },
    saveEmail () {
      if (!this.emailRegEx.test(this.displayemail)) {
        log('Please Enter Correct Email')
      } else {
        const updateObj = { email: this.displayemail }
        this.updateMe(updateObj)
      }
    },
    savePassword () {
      const updateObj = { password: this.passwordInput }
      this.updateMe(updateObj)
    }
  }
}
</script>

<style scoped>

</style>
