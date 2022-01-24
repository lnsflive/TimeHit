<template>
  <v-alert :type="value" :value="show">
    {{ message }}
  </v-alert>
</template>

<script>
export default {
  data () {
    return {
      show: false,
      message: '',
      value: 'success'
    }
  },
  watch: {
    show (newVal) {
      if (newVal) {
        setTimeout(() => { this.show = false }, 3000)
      }
    }
  },
  created () {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'alert/showMessage') {
        this.message = state.alert.content
        this.value = state.alert.value
        this.show = true
      }
    })
  }
}
</script>
<style scoped>
.v-alert {
  position: fixed;
  left: 50%;
  bottom: 50px;
  transform: translate(-50%, -50%);
  z-index: 15;
}
</style>
