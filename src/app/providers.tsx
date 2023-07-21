/**
 * @since 2023/07/17
 * @author ThinhHV <thinh@thinhhv.com>
 * @description description
 * @copyright (c) 2023 Company Platform
 */

'use client'

import { SessionProvider } from 'next-auth/react'
import { baobab } from 'src/configs/chains'
import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { mainnet, goerli } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { CONFIGS } from 'src/configs'

const {
  chains: _,
  publicClient,
  webSocketPublicClient,
} = configureChains(
  [mainnet, goerli, baobab],
  [publicProvider(), publicProvider(), jsonRpcProvider({ rpc: () => ({ http: CONFIGS.RPC }) })],
)

type Props = {
  children?: React.ReactNode
}

const config = createConfig({
  autoConnect: false,
  publicClient,
  webSocketPublicClient,
})

export const NextAuthProvider = ({ children }: Props) => {
  return (
    <WagmiConfig config={config}>
      <SessionProvider>{children}</SessionProvider>
    </WagmiConfig>
  )
}
