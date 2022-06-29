import { groupBy, prop } from "ramda"

export const state = () => ({
  user: null,
})

export const getters = {
  getUser(state) {
    return state.user
  },
}

export const mutations = {
  // increment(state) {
  //   state.counter++
  // },
}

export const actions = {
  login(state, payload) {
    state.user = payload.username
  },
  fetchUserMessages(state) {
    const messages = [
      {
        from: 'hessel',
        to: state.user,
        message: 'Hello world!',
      },
    ]
    return groupBy(prop('from'), messages)
  },
  sendMessage(state, payload) {
    return {
      from: state.user,
      to: payload.to,
      message: payload.message,
    }
  }
}
