<template>
  <div class="container">
    <CBox
      v-bind="mainStyles[colorMode]"
      d="flex"
      w="100vw"
      h="100vh"
      flex-dir="column"
    >
      <CHeading text-align="center" my="4"> 🗯️ Bem vindo ao Chat!</CHeading>
      <CFlex justify="center" direction="column" align="center">
        <CBox mb="10">
          <!-- <CIconButton
            mr="3"
            :icon="colorMode === 'light' ? 'moon' : 'sun'"
            :aria-label="`Switch to ${
              colorMode === 'light' ? 'dark' : 'light'
            } mode`"
            @click="toggleColorMode"
          /> -->
          <CButton
            margin-left="3"
            variant-color="green"
            @click="showNewChatModal = true"
          >
            Novo Chat
          </CButton>
        </CBox>

        <CBox
          d="flex"
          w="70vw"
          flex-dir="column"
          rounded="lg"
        >
          <CFlex justify="center" direction="column" align="center">
            <CBox
              v-for="(chat, to) in messages"
              :key="to"
              h="5vh"
              style="cursor: pointer"
              @click="openChat(to)"
            >
              <CFlex justify="left" direction="row" align="center">
                <CAvatar
                  :name="to"
                  :alt="to"
                  :src="getAvatar(to)"
                />
                <CHeading size="md" ml="5">{{ to }}</CHeading>
              </CFlex>
            </CBox>
          </CFlex>
        </CBox>
      </CFlex>
    </CBox>
    <CModal :is-open="showLoginModal">
      <CModalOverlay />
      <CModalContent>
        <CModalHeader>🔑 Entrar</CModalHeader>
        <CModalBody>
          <CInput
            v-model="username"
            placeholder="Nome de usuário"
            size="lg"
          />
        </CModalBody>
        <CModalFooter>
          <CButton
            margin-left="3"
            variant-color="green"
            @click="loginUser"
          >
            Entrar
          </CButton>
        </CModalFooter>
      </CModalContent>
    </CModal>
    <CModal :is-open="showNewChatModal">
      <CModalOverlay />
      <CModalContent>
        <CModalHeader>➕ Novo Chat</CModalHeader>
        <CModalBody>
          <CInput
            v-model="newChatUser"
            placeholder="Nome do usuário"
            size="lg"
          />
        </CModalBody>
        <CModalFooter>
          <CButton
            margin-left="3"
            variant-color="green"
            @click="startChat"
          >
            Criar Chat
          </CButton>
        </CModalFooter>
      </CModalContent>
    </CModal>
    <CModal
      :is-open="showCurrentChatModal"
      :scroll-behavior="scrollBehavior"
      :close-on-overlay-click="true"
      h="100vh"
      w="1000px"
    >
      <CModalOverlay />
      <CModalContent ref="content" h="50vh" mt="15vh">
        <CModalHeader>✉️ Chat com {{ currentChat }}</CModalHeader>
        <CModalBody flex-dir="column">
          <CFlex direction="column" align="left">
            <CBox
              v-for="(message, index, key) in messages[currentChat]"
              :key="key"
              rounded="md"
              d="flex"
              mx="2"
              mb="1"
              pa="4"
              w="95%"
              :bg="getMessageColor(message)"
              
              style='text-align: right;'
            >
              <CBox my="1" mx="3" w="100%">
                <CFlex direction="column" :style='getMessageAlign(message)' w="100%">
                  {{ message.message }}
                </CFlex>
              </CBox>
            </CBox>
          </CFlex>
        </CModalBody>
        <CModalFooter>
          <CInput
            v-model="newMessage"
            placeholder="..."
            size="lg"
            @keyup.enter="sendNewMessage"
          />
        </CModalFooter>
        <CModalCloseButton @click="showCurrentChatModal = false" />
      </CModalContent>
    </CModal>
  </div>
</template>

<script lang="js">
import {
  CAvatar,
  CBox,
  CButton,
  CModal,
  CModalContent,
  CModalOverlay,
  CModalHeader,
  CModalFooter,
  CModalBody,
  // CIconButton,
  CFlex,
  CHeading,
  CInput,
  CModalCloseButton,
} from '@chakra-ui/vue'

import {
  mapGetters,
  mapActions,
} from 'vuex'

export default {
  name: 'IndexPage',
  components: {
    CAvatar,
    CBox,
    CButton,
    CModal,
    CModalContent,
    CModalOverlay,
    CModalHeader,
    CModalFooter,
    CModalBody,
    // CIconButton,
    CFlex,
    CHeading,
    CInput,
    CModalCloseButton,
  },
  inject: ['$chakraColorMode', '$toggleColorMode'],
  data () {
    return {
      newMessage: null,
      currentMessage: null,
      showCurrentChatModal: false,
      currentChat: null,
      currentChatModal: false,
      newChatUser: null,
      showNewChatModal: false,
      messages: {
        paulo: [
          {
            message: 'Oi',
          },
        ],
        hessel: [
          {
            message: 'Oi',
          },
        ],
      },
      username: null,
      showLoginModal: true,
      mainStyles: {
        dark: {
          bg: 'gray.700',
          color: 'whiteAlpha.900'
        },
        light: {
          bg: 'white',
          color: 'gray.900'
        }
      },
      scrollBehavior: 'inside',
    }
  },
  computed: {
    ...mapGetters({
      user: 'chat/getUser',
    }),
    colorMode() {
      return this.$chakraColorMode()
    },
    theme() {
      return this.$chakraTheme()
    },
    toggleColorMode() {
      return this.$toggleColorMode
    }
  },
  created() {
    this.toggleColorMode()
    // ... set time out for fetch messages
  },
  methods: {
    ...mapActions({
      login: 'chat/login',
      fetchUserMessages: 'chat/fetchUserMessages',
      sendMessage: 'chat/sendMessage',
    }),
    sendNewMessage() {
      if (this.newMessage) {
        this.sendMessage({
          message: this.newMessage,
          to: this.currentChat,
        })
        this.messages[this.currentChat].push({
          message: this.newMessage,
          from: this.username,
          to: this.currentChat,
        })
        this.newMessage = null
      }
    },
    openChat(to) {
      this.currentChat = to
      this.currentChatModal = true
      this.showCurrentChatModal = true
    },
    startChat() {
      if (!this.newChatUser) {
        this.showNewChatModal = false
        return
      }
      if (!this.messages[this.newChatUser]) {
        this.messages[this.newChatUser] = []  
        this.showToast({
          message: 'Chat criado!',
          description: `Seu chat com ${this.newChatUser} foi aberto`,
          status: 'success',
        })
      } else {
        this.showToast({
          message: 'Chat já aberto!',
          description: `Seu chat com ${this.newChatUser} já está aberto`,
          status: 'warning',
        })
      }
      this.showNewChatModal = false
      this.newChatUser = null
    },
    async loginUser() {
      this.login({
        username: this.username,
      })
      this.showToast({
        message: 'Bem vindo!',
        description: `Olá ${this.username}`,
        status: 'success',
      })
      this.messages = await this.fetchUserMessages(this.user)
      this.showLoginModal = false
    },
    showToast({ status, title, description, duration = 3000 }) {
      this.$toast({
        title,
        status,
        description,
        duration,
        isClosable: true
      })
    },
    getAvatar(name) {
      return `https://avatars.dicebear.com/api/adventurer/${name}.svg?background=%230000ff`
    },
    getMessageColor({ from }) {
      if (from === this.username) return 'blue.500'
      return 'green.500'
    },
    getMessageAlign({ from }) {
      if (from === this.username) return 'text-align: right'
      return 'text-align: left'
    },
  }
}
</script>
