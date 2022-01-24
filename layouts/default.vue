<template>
  <v-app>
    <Navbar v-if="isAuthenticated" />
    <Alert />
    <v-main>
      <Nuxt />
    </v-main>
    <Snackbar />
    <Footer v-if="isAuthenticated" />
  </v-app>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Default',
  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser'])
  }
}
</script>

<style>
.v-application{font-family: 'Rubik', sans-serif!important;overflow-y: hidden;}
.v-main{
  background-color:#0d1323;
}
</style>
