"use client";

import { ReactNode, useEffect, useState, createContext, useContext } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
    HederaSessionEvent,
    HederaJsonRpcMethod,
    DAppConnector,
    HederaChainId,
} from '@hashgraph/hedera-wallet-connect';
import { LedgerId } from '@hashgraph/sdk';

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID ?? "";
const queryClient = new QueryClient();

const metadata = {
    name: 'AgentKit Next.js Demo',
    description: 'AgentKit Next.js Demo',
    url: 'https://example.com',
    icons: ['https://avatars.githubusercontent.com/u/179229932']
};

// Context to provide dAppConnector to children
const DAppConnectorContext = createContext<DAppConnector | null>(null);
export const useDAppConnector = () => useContext(DAppConnectorContext);

type ClientProvidersProps = {
    children: ReactNode;
};

export function ClientProviders({ children }: ClientProvidersProps) {
    const [dAppConnector, setDAppConnector] = useState<DAppConnector | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        let isMounted = true;
        async function init() {
            const connector = new DAppConnector(
                metadata,
                LedgerId.TESTNET,
                projectId,
                Object.values(HederaJsonRpcMethod),
                [HederaSessionEvent.ChainChanged, HederaSessionEvent.AccountsChanged],
                [HederaChainId.Mainnet, HederaChainId.Testnet],
            );
            await connector.init({ logger: 'error' });
            if (isMounted) {
                setDAppConnector(connector);
                setIsReady(true);
            }
        }
        init();
        return () => { isMounted = false; };
    }, []);

    if (!isReady) return <div style={{ color: 'white', textAlign: 'center', marginTop: '2rem' }}>Loading wallet...</div>;

    return (
        <DAppConnectorContext.Provider value={dAppConnector}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </DAppConnectorContext.Provider>
    );
}