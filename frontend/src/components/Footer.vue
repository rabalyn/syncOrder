<template>
  <b-container>
    <b-row class="justify-content-md-center footer">
      <b-button
        href="https://github.com/rabalyn/syncOrder/"
        target="_blank"
        rel="noopener noreferrer"
        variant="light"
      >
        <font-awesome-icon :icon="['fab', 'github']" />&nbsp;Github
      </b-button>

      &nbsp;&nbsp;

      <b-button
        variant="light"
        @click="$bvModal.show('dataPrivacyPolicy')"
      >
        <font-awesome-icon icon="file-alt" />&nbsp;Datenschutzerklärung
      </b-button>
    </b-row>

    <DataPrivacyPolicy />
  </b-container>
</template>

<script>
import DataPrivacyPolicy from '@/components/DataPrivacyPolicy.vue'

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
  methods: {},
  watch: {},
  created: function () { },
  mounted: function () { }
}
</script>

<style scoped>
.footer {
  align-content: center;
}
</style>
