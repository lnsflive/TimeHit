<template>
  <v-container>
    <v-app-bar
      fixed
      app
      height="66px"
      color="primary"
      class="pl-4 pr-4 rounded-b-xl"
    >
      <v-app-bar-nav-icon>
        <v-icon
          x-large
          @click.stop="drawer = !drawer"
        >
          mdi-menu
        </v-icon>
      </v-app-bar-nav-icon>
      <v-spacer />
      <v-toolbar-title>
        <v-img
          contain
          height="36px"
          src="img/logo_white.svg"
        />
      </v-toolbar-title>
      <v-spacer />
      <v-app-bar-nav-icon>
        <v-icon
          x-large
          @click="reloadPage"
        >
          mdi-cached
        </v-icon>
      </v-app-bar-nav-icon>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      absolute
      bottom
      color="primary"
      class="rounded-t-xl"
      temporary
    >
      <v-list
        nav
      >
        <v-list-item-group
          v-model="group"
          class="text-center"
          active-class="black--text font-weight-bold"
        >
          <v-list-item to="/">
            <v-list-item-title>
              Home
            </v-list-item-title>
          </v-list-item>
          <v-list-item to="/dashboard">
            <v-list-item-title>
              Dashboard
            </v-list-item-title>
          </v-list-item>
          <v-list-item to="/settings">
            <v-list-item-title>
              Settings
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="logout">
            <v-list-item-title>
              Logout
            </v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </v-container>
</template>

<script>

export default {
  middleware: 'auth',
  data: () => ({
    drawer: false,
    group: null
  }),
  computed: {
    user () {
      return this.$strapi.user
    }
  },
  watch: {
    group () {
      this.drawer = false
    }
  },
  methods: {
    logout () {
      this.$auth.logout()
      this.$router.push('/login')
      this.$alerter.showMessage({ content: 'You have been logged out', value: 'success' })
    },
    reloadPage () {
      window.location.reload()
    }
  }
}
</script>
