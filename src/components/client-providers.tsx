"use client";

import {ReactNode} from "react";
import {WagmiAdapter} from "@reown/appkit-adapter-wagmi";
import {WagmiProvider} from "wagmi";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {hederaTestnet} from "@reown/appkit/networks";
import {createAppKit} from "@reown/appkit/react";

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID ?? "";

console.log(projectId)

const metadata = {
    name: 'AgentKit Next.js Demo',
    description: 'AgentKit Next.js Demo',
    url: 'https://example.com',
    icons: ['https://avatars.githubusercontent.com/u/179229932']
}

const networks = [hederaTestnet];

const wagmiAdapter = new WagmiAdapter({
    networks,
    projectId,
    ssr: true,
})

const queryClient = new QueryClient()

createAppKit({
    adapters: [wagmiAdapter],
    networks: [hederaTestnet],
    projectId,
    metadata,
    defaultNetwork: hederaTestnet
})

type ClientProvidersProps = {
    children: ReactNode
}

export function ClientProviders({children}: ClientProvidersProps) {
    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    )
}