export default ({ app, store }, inject) => {
  inject('notifier', {
    showMessage ({ content = '', color = '', timeout = '' }) {
      store.commit('snackbar/showMessage', { content, color, timeout })
    }
  })
}
