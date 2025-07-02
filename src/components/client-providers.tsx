"use client";

import {ReactNode} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {hederaTestnet} from "@reown/appkit/networks";
import {createAppKit} from "@reown/appkit/react";
import {
    HederaAdapter, HederaChainDefinition, hederaNamespace, HederaProvider,
} from "@hashgraph/hedera-wallet-connect";
import type UniversalProvider from '@walletconnect/universal-provider'

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID ?? "";

const queryClient = new QueryClient()

if(typeof window !== "undefined") {
    const metadata = {
        name: 'AgentKit Next.js Demo',
        description: 'AgentKit Next.js Demo',
        url: 'https://example.com',
        icons: ['https://avatars.githubusercontent.com/u/179229932']
    }

    const hederaEVMAdapter = new HederaAdapter({
        projectId,
        networks: [
            HederaChainDefinition.EVM.Mainnet,
            HederaChainDefinition.EVM.Testnet,
        ],
        namespace: 'eip155',
    })

    const hederaNativeAdapter = new HederaAdapter({
        projectId,
        networks: [HederaChainDefinition.Native.Mainnet, HederaChainDefinition.Native.Testnet],
        namespace: hederaNamespace, // 'hedera'
    })

    const universalProvider = (await HederaProvider.init({
        projectId,
        metadata,
    })) as unknown as UniversalProvider // avoid type mismatch error due to missing of private properties in HederaProvider

    createAppKit({
        adapters: [hederaEVMAdapter, hederaNativeAdapter],
        //@ts-expect-error expected type error
        universalProvider,
        networks: [hederaTestnet],
        projectId,
        metadata,
        defaultNetwork: hederaTestnet
    })
}

type ClientProvidersProps = {
    children: ReactNode
}

export function ClientProviders({children}: ClientProvidersProps) {
    return (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
    )
}