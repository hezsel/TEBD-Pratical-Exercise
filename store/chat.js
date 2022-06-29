import { groupBy, filter, propEq, either, map, clone } from 'ramda'

import messagesContract from '../utils/contract'

const account = '0x51933443E33Bb61e0ed88556d70845551bf4Fad7'

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
  async addMessage(state, payload) {
    state.messages = [...state.messages, payload]
    await messagesContract.methods
      .sendMessage(payload.message, payload.from, payload.to)
      .send({ from: account, gas: 3000000 })
  },
  fetchMessages(state, payload) {
    state.messages = payload
  },
}

export const actions = {
  async login({ commit }, payload) {
    await commit('updateUser', payload.username)
  },
  async fetchUserMessages({ state, commit }) {
    const newMessages = await messagesContract.methods
      .listMessages(state.user)
      .call()
    const formatedMessages = map(
      ([from, to, message]) => ({
        from,
        to,
        message,
      }),
      newMessages
    )
    await commit('fetchMessages', formatedMessages)
    return groupBy((item) => {
      if (item.from === state.user) {
        return item.to
      }
      if (item.to === state.user) {
        return item.from
      }
    }, filter(either(propEq('to', state.user), propEq('from', state.user)), clone(state.messages)))
  },
  async sendMessage({ state, commit }, payload) {
    console.log('sendMessage', payload)
    await commit('addMessage', {
      from: state.user,
      to: payload.to,
      message: payload.message,
    })
    return state.messages
  },
}
