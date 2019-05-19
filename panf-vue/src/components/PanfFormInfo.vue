<template>
  <b-container class="mt-4">
    <b-row>
      <b-col cols="2"></b-col>
      <b-col cols="8">
        <b-alert show dismissible variant="warning">
          <font-awesome-icon size="3x" icon="exclamation-triangle"></font-awesome-icon>
          Öffnen Sie ruhig weitere Webseiten von *.übersprung.de in einem separaten Browsertab/-fenster, während Sie das Formular ausfüllen, oder davor, oder danach, oder wann auch immer, da sich das Formular auch dann noch abschicken lässt.
        </b-alert>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'PanfFormInfo',
  props: {
  }
}
</script>

<style scoped>
</style>
