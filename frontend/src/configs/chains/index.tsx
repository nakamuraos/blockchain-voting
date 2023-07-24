import { Chain } from 'wagmi'

export const baobab = {
  id: 1_001,
  name: 'Baobab',
  network: 'baobab',
  nativeCurrency: {
    decimals: 18,
    name: 'Baobab',
    symbol: 'KLAY',
  },
  rpcUrls: {
    public: { http: ['https://public-en-baobab.klaytn.net'] },
    default: { http: ['https://public-en-baobab.klaytn.net'] },
  },
  blockExplorers: {
    etherscan: { name: 'SnowTrace', url: 'https://baobab.scope.klaytn.com' },
    default: { name: 'SnowTrace', url: 'https://baobab.scope.klaytn.com' },
  },
  contracts: {
    multicall3: {
      // TODO: change
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 11_907_934,
    },
  },
} as const satisfies Chain
