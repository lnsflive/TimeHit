export default ({ app, store }, inject) => {
  inject('alerter', {
    showMessage ({ content = '', value = '' }) {
      store.commit('alert/showMessage', { content, value })
    }
  })
}
