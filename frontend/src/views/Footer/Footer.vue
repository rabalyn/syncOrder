<template>
  <footer class="mt-auto">
    <b-row class="justify-content-md-center footer">
      <b-button
        href="https://github.com/rabalyn/syncOrder/"
        target="_blank"
        rel="noopener noreferrer"
        variant="dark"
        class="footer-button"
      >
        <font-awesome-icon :icon="['fab', 'github']" />&nbsp;{{ $t('footer.github') }}
      </b-button>

      <b-button
        variant="dark"
        class="footer-button"
        @click="$bvModal.show('dataPrivacyPolicy')"
      >
        <font-awesome-icon icon="file-alt" />&nbsp;{{ $t('footer.privacyPolicy') }}
      </b-button>
    </b-row>

    <DataPrivacyPolicy />
  </footer>
</template>

<script>
import DataPrivacyPolicy from './DataPrivacyPolicy.vue'

export default {
  name: 'Footer',
  components: {
    DataPrivacyPolicy
  },
  props: {},
  data: function () {
    return {}
  },
  computed: {},
  watch: {},
  created: function () { },
  mounted: function () { },
  methods: {}
}
</script>

<style scoped>
.footer {
  align-content: center;
  padding: 1em;
  background-color: #343a40 !important;
}

.footer-button {
  margin-left: 0.5em;
  margin-right: 0.5em;
}
</style>
