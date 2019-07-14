<template>
  <b-nav-item-dropdown
    :text="$t(`langs.${$i18n.locale}`)"
    toggle-class="nav-link-custom"
    right
  >
    <b-dropdown-item
      v-for="(lang, i) in langs"
      :key="`Lang${i}`"
      :value="lang"
      @click="setLanguage(lang)"
    >
      {{ $t(`langs.${lang}`)}}
    </b-dropdown-item>
  </b-nav-item-dropdown>
</template>

<script>
export default {
  name: 'LanguageSelector',
  props: {
    langs: {
      default: [],
      type: Array
    }
  },
  data: function () {
    return {
    }
  },
  computed: {
  },
  methods: {
    setLanguage(lang) {
      this.$i18n.locale = lang
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
