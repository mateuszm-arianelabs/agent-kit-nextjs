"use client"

import {ChatMessage} from "@/shared/types";
import {useState} from "react";
import {useHandleChat} from "@/api/handle-chat";
import { Transaction } from '@hashgraph/sdk';
import {ChatInput} from "@/components/chat-input";
import {EmptyChat} from "@/components/empty-chat";
import {Header} from "@/components/header";
import {useAppKitProvider, useAppKitState} from "@reown/appkit/react";
import {ChainNamespace} from "@reown/appkit-common";
import {HederaProvider, transactionToBase64String} from "@hashgraph/hedera-wallet-connect";

export default function Home() {
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
    const [prompt, setPrompt] = useState("");
    const {mutateAsync, isPending} = useHandleChat();

    const { activeChain } = useAppKitState()
    const { walletProvider } = useAppKitProvider(activeChain ?? ('hedera' as ChainNamespace))

    const getWalletProvider = () => {
        if (!walletProvider) throw Error('user is disconnected')
        return walletProvider as HederaProvider;
    }

    async function signExampleTransaction() {
        const wallet = getWalletProvider();
        const transactionBytesBase64 = "CiIaACIeIgIIeDIAwgEVCgxNVEsgTXkgVG9rZW4yBQiAztoD";

        const txBytes = Buffer.from(
            transactionBytesBase64.replace(/`/g, '').trim(),
            'base64'
        );

        const transaction = Transaction.fromBytes(txBytes);
        const signTransactionResponse = await wallet.hedera_signAndExecuteTransaction({
            signerAccountId: 'hedera:testnet:' + "0.0.4515756",
            transactionList: transactionToBase64String(transaction),
        })

        console.log({signTransactionResponse})
    }

    async function handleUserMessage() {
        setChatHistory(v => [...v, {
            type: "human",
            content: prompt,
        }])

        const agentResponse = await mutateAsync({
            input: prompt,
            history: chatHistory,
        })

        setPrompt("")

        setChatHistory(v => [...v, {
            type: "ai",
            content: agentResponse.message
        }])

        if(agentResponse.transactionBytes) {
            const txBytes = Buffer.from(agentResponse.transactionBytes, 'base64');
            const transaction = Transaction.fromBytes(txBytes);
            console.log({transaction})
        }

        console.log(prompt)
    }

  return (
    <div className="h-screen w-full bg-zinc-900 flex items-center justify-center flex-col">
        <main className="w-4xl h-full flex flex-col">
            <Header />
            <button onClick={signExampleTransaction}>
                essen
            </button>
            <div className="bg-zinc-800 grow rounded-lg flex flex-col gap-2 p-4">
                {
                    chatHistory.map((message, idx) => (
                        <div key={idx} className="flex">
                            {
                                message.type === "human" ? (
                                    <div className="bg-zinc-700 inline-block px-4 py-2 rounded-md ml-auto">
                                        {message.content}
                                    </div>
                                ) : (
                                    <div className="bg-zinc-700 inline-block px-4 py-2 rounded-md break-all">
                                        {message.content}
                                    </div>
                                )
                            }
                        </div>
                    ))
                }

                <EmptyChat isChatEmpty={chatHistory.length <= 0}/>
            </div>
            <ChatInput handleUserMessage={handleUserMessage} prompt={prompt} setPrompt={setPrompt} isPending={isPending}/>
        </main>
    </div>
  );
}
