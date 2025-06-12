export const getters = {
  isAuthenticated(state) {
    return state.auth.loggedIn
  },

  loggedInUser(state) {
    return state.auth.user
  },

  avatarImage(state) {
    return 'https://strapi.jaimegonzalezjr.com/uploads/nicolas_horn_MTZT_Gv_Ds_HFY_unsplash_251f94cf0b.jpg'
  }
}
