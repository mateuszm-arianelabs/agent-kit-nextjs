"use client";

import { ReactNode, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { hederaTestnet } from "@reown/appkit/networks";
import { createAppKit } from "@reown/appkit/react";
import {
    HederaAdapter, HederaChainDefinition, hederaNamespace, HederaProvider,
} from "@hashgraph/hedera-wallet-connect";
import type UniversalProvider from '@walletconnect/universal-provider'

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID ?? "";

const queryClient = new QueryClient()

const metadata = {
    name: 'AgentKit Next.js Demo',
    description: 'AgentKit Next.js Demo',
    url: 'https://example.com',
    icons: ['https://avatars.githubusercontent.com/u/179229932']
}

const hederaNativeAdapter = new HederaAdapter({
    projectId,
    networks: [HederaChainDefinition.Native.Mainnet, HederaChainDefinition.Native.Testnet],
    namespace: hederaNamespace, // 'hedera'
})

export function ClientProviders({ children }: ClientProvidersProps) {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Remove any persisted chain selection
        localStorage.removeItem('appkit.activeChain');
        sessionStorage.removeItem('appkit.activeChain');
    }, []);

    useEffect(() => {
        let isMounted = true;
        async function init() {
            const universalProvider = await HederaProvider.init({
                projectId,
                metadata,
            }) as unknown as UniversalProvider;

            console.log('hederaNativeAdapter:', hederaNativeAdapter);
            console.log('universalProvider:', universalProvider);

            createAppKit({
                adapters: [hederaNativeAdapter],
                // @ts-expect-error expected type error
                universalProvider,
                networks: [hederaTestnet],
                projectId,
                metadata,
                defaultNetwork: hederaTestnet
            });
            if (isMounted) setIsReady(true);
        }
        init();
        return () => { isMounted = false; };
    }, []);

    if (!isReady) return <div style={{ color: 'white', textAlign: 'center', marginTop: '2rem' }}>Loading wallet...</div>;

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}

type ClientProvidersProps = {
    children: React.ReactNode
}