<template>
  <b-container class="mt-4">
    <b-row>

      <b-col cols="12">
        <b-alert
          show
          dismissible
          variant="warning"
        >
          <font-awesome-icon
            size="3x"
            icon="exclamation-triangle"
          ></font-awesome-icon>
          {{$t('panf.formInfo.text')}}
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
