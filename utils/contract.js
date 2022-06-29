import Web3 from 'web3'

const CONTRACT_ADDRESS = '0x45646403E8d218334b58B2E1ecdA6fefdD9A9262'

const address = 'http://localhost:7545'

const web3 = new Web3(new Web3.providers.HttpProvider(address))

const MESSAGE_ABI = [
  {
    inputs: [{ internalType: 'uint256', name: 'index', type: 'uint256' }],
    name: 'getOneMessage',
    outputs: [
      {
        components: [
          { internalType: 'string', name: 'from', type: 'string' },
          { internalType: 'string', name: 'to', type: 'string' },
          { internalType: 'string', name: 'message', type: 'string' },
        ],
        internalType: 'struct Chat.Message',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'string', name: '_user', type: 'string' }],
    name: 'listMessages',
    outputs: [
      {
        components: [
          { internalType: 'string', name: 'from', type: 'string' },
          { internalType: 'string', name: 'to', type: 'string' },
          { internalType: 'string', name: 'message', type: 'string' },
        ],
        internalType: 'struct Chat.Message[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'messagesList',
    outputs: [
      { internalType: 'string', name: 'from', type: 'string' },
      { internalType: 'string', name: 'to', type: 'string' },
      { internalType: 'string', name: 'message', type: 'string' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string', name: '_text', type: 'string' },
      { internalType: 'string', name: '_from', type: 'string' },
      { internalType: 'string', name: '_to', type: 'string' },
    ],
    name: 'sendMessage',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

const messageAPI = new web3.eth.Contract(MESSAGE_ABI, CONTRACT_ADDRESS)

export default messageAPI
