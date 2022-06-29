import { groupBy, filter, propEq, either } from 'ramda'

export const state = () => ({
  user: null,
  messages: [],
})

export const getters = {
  getUser(state) {
    return state.user
  },
}

export const mutations = {
  updateUser(state, payload) {
    state.user = payload
  },
  addMessage(state, payload) {
    state.messages = [...state.messages, payload]
    localStorage.setItem('messages', JSON.stringify(state.messages))
  },
  fetchMessages(state) {
    state.messages = JSON.parse(localStorage.getItem('messages')) || []
  },
}

export const actions = {
  async login({ commit }, payload) {
    await commit('updateUser', payload.username)
    // mutations state.user = payload.username
  },
  async fetchUserMessages({ state, commit }) {
    await commit('fetchMessages')
    console.log('state', state.messages)
    return groupBy((item) => {
      if (item.from === state.user) {
        return item.to
      }
      if (item.to === state.user) {
        return item.from
      }
    }, filter(
      either(propEq('to', state.user), propEq('from', state.user)),
      state.messages,
    ))
  },
  async sendMessage({ state, commit }, payload) {
    console.log('sendMessage', payload)
    await commit('addMessage', {
      from: state.user,
      to: payload.to,
      message: payload.message,
    })
    return state.messages
  }
}
