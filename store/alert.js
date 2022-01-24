export const mutations = {
  showMessage (state, payload) {
    state.content = payload.content
    state.value = payload.value
  }
}
export const state = () => ({
  content: '',
  value: ''
})
