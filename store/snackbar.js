export const mutations = {
  showMessage (state, payload) {
    state.content = payload.content
    state.color = payload.color
    state.timeout = payload.timeout
  }
}
export const state = () => ({
  content: '',
  color: '',
  timeout: ''
})
