<template>
  <b-modal
    id="confirmDeleteOrderList"
    title="Bestellungen wirklich löschen?"
    footer-bg-variant="dark"
    footer-text-variant="light"
    @ok="clearOrderList"
  >
    <p class="my-4">Soll die aktuelle Bestellliste wirklich gelöscht werden?</p>

    <template
      slot="modal-footer"
      footer-bg-variant="dark"
      footer-text-variant="light"
      slot-scope="{ ok, cancel }"
    >
      <b-button
        size="sm"
        variant="secondary"
        @click="cancel()"
      >
        Schließen
      </b-button>
      <b-button
        size="sm"
        variant="danger"
        @click="ok()"
      >
        Liste Löschen
      </b-button>
    </template>
  </b-modal>
</template>

<script>
export default {
  name: `ConfirmDeleteOrderListModal`,
  props: {
  },
  data: function () {
    return {
    }
  },
  computed: {
  },
  methods: {
    clearOrderList () {
      this.$socket.emit(`clearList`)
    }
  },
  watch: {
  },
  created: function () {
  },
  mounted: function () {
  }
}
</script>

<style scoped>
</style>
