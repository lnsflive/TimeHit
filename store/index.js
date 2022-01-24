export const getters = {
  isAuthenticated (state) {
    return state.auth.loggedIn
  },

  loggedInUser (state) {
    return state.auth.user
  },

  avatarImage (state) {
    return 'https://strapi.jaimegonzalezjr.com' + state.auth.user.image.url
  }
}
