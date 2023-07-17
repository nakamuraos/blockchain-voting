"use client";

import { SessionProvider } from "next-auth/react";
import { WagmiConfig, createConfig, configureChains, mainnet } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

const {
  chains: _,
  publicClient,
  webSocketPublicClient,
} = configureChains([mainnet], [publicProvider()]);

type Props = {
  children?: React.ReactNode;
};

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

export const NextAuthProvider = ({ children }: Props) => {
  return (
    <WagmiConfig config={config}>
      <SessionProvider>{children}</SessionProvider>
    </WagmiConfig>
  );
};
