<template>
  <span @click="copyToClipboard">
    <font-awesome-icon :icon="iconName" />
    &nbsp;<span ref="autoCopyElement">{{text}}</span>
  </span>
</template>

<script>
export default {
  name: 'AutoCopyNavItemText',
  props: {
    text: {
      default: null,
      type: String
    },
    iconName: {
      default: null,
      type: String
    }
  },
  data: function () {
    return {}
  },
  computed: {
  },
  methods: {
    copyToClipboard() {
      const range = document.createRange()
      range.selectNode(this.$refs.autoCopyElement)
      window.getSelection().removeAllRanges()
      window.getSelection().addRange(range)
      document.execCommand('copy')
      window.getSelection().removeAllRanges()
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
