<template>
  <div>
    <ConfirmDeleteOrderListModal></ConfirmDeleteOrderListModal>

    <b-container id="app">
      <b-navbar
        id="nav"
        toggleable="lg"
        type="dark"
        variant="dark"
      >
        <b-navbar-brand
          class="enablePointer"
          @click="handlePanfNavClick"
        >
          🍕&nbsp;
          {{$t('header')}}
        </b-navbar-brand>

        <b-navbar-toggle target="nav-collapse-routes"></b-navbar-toggle>

        <b-collapse
          id="nav-collapse-routes"
          is-nav
        >
          <b-navbar-nav>
            <b-nav-item
              to="/davinci-menu"
              exact
            >
              <font-awesome-icon icon="file-alt" />&nbsp;Da-Vinci
            </b-nav-item>
          </b-navbar-nav>

          <b-navbar-nav class="ml-auto">

            <b-nav-item>
              <AutoCopyNavItemText
                iconName="phone"
                text="06151 29 28 27"
              />
            </b-nav-item>

            <b-nav-item>
              <ClearOrderListButton />
            </b-nav-item>

            <LanguageSelector :langs="['de', 'en']" />
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>

      <router-view />

      <hr />

      <Footer />

    </b-container>
  </div>
</template>

<script>
import AutoCopyNavItemText from './views/Nav/AutoCopyNavItemText.vue'
import ConfirmDeleteOrderListModal from './views/Nav/ConfirmDeleteOrderListModal.vue'
import ClearOrderListButton from './views/Nav/ClearOrderListButton.vue'
import LanguageSelector from './views/Nav/LanguageSelector.vue'
import Footer from './views/Footer/Footer.vue'

export default {
  components: {
    AutoCopyNavItemText,
    ConfirmDeleteOrderListModal,
    ClearOrderListButton,
    LanguageSelector,
    Footer
  },
  data: function () {
    return {}
  },
  computed: {
  },
  methods: {
    handlePanfNavClick() {
      if (this.$route.path === '/panf' || this.$route.path === '/panf/') {
        this.$router.go()
      } else {
        this.$router.push('/panf')
      }
    }
  }
}
</script>

<style scoped>
.enablePointer {
  cursor: pointer;
}
</style>
