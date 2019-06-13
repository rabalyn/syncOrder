<template>
  <div>
    <ConfirmDeleteOrderListModal></ConfirmDeleteOrderListModal>

    <b-container id="app">
      <b-navbar id="nav" toggleable="lg" type="dark" variant="dark">
        <b-navbar-brand to="/panf" exact>🍕&nbsp;PANF</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse-routes"></b-navbar-toggle>

        <b-collapse id="nav-collapse-routes" is-nav>
          <b-navbar-nav>
            <b-nav-item to="/davinci-menu" exact>
              <font-awesome-icon icon="file-alt"/>&nbsp;Da-Vinci
            </b-nav-item>
          </b-navbar-nav>

          <b-navbar-nav class="ml-auto">
            <b-nav-item @click="copyToClipboard">
              <font-awesome-icon icon="phone"/>
              <span ref="phone">&nbsp;06151 29 28 27</span>
            </b-nav-item>
            <b-nav-item>
              <b-button
                v-if="noOrderTime"
                v-b-modal.confirmDeleteOrderList
                variant="danger"
                size="sm"
              >
                <font-awesome-icon icon="trash"/>&nbsp;Liste Löschen
              </b-button>
            </b-nav-item>
            <b-nav-item-dropdown text="Deutsch" right>
              <b-dropdown-item href="#">Deutsch</b-dropdown-item>
              <b-dropdown-item href="#">English</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
      <router-view/>
    </b-container>
  </div>
</template>

<script>
import ConfirmDeleteOrderListModal from "@/components/ConfirmDeleteOrderListModal.vue";

export default {
  components: {
    ConfirmDeleteOrderListModal
  },
  computed: {
    noOrderTime: function() {
      const today = new Date().getHours();
      const listClearable = !(today >= 10 && today <= 14);
      return listClearable;
    }
  },
  methods: {
    copyToClipboard() {
      const range = document.createRange();
      range.selectNode(this.$refs.phone);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      document.execCommand("copy");
      window.getSelection().removeAllRanges();
    }
  }
};
</script>

<style scoped>
</style>
