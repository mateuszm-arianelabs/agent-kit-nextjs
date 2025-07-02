"use client"

import { ChatMessage } from "@/shared/types";
import { useState, useEffect } from "react";
import { useHandleChat } from "@/api/handle-chat";
import { Transaction } from '@hashgraph/sdk';
import { ChatInput } from "@/components/chat-input";
import { EmptyChat } from "@/components/empty-chat";
import { Header } from "@/components/header";
import { useDAppConnector } from "@/components/client-providers";
import { HederaProvider, transactionToBase64String } from "@hashgraph/hedera-wallet-connect";

export default function Home() {
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
    const [prompt, setPrompt] = useState("");
    const { mutateAsync, isPending } = useHandleChat();

    const dAppConnector = useDAppConnector();

    useEffect(() => {
        if (dAppConnector) {
            console.log('dAppConnector:', dAppConnector);
        }
    }, [dAppConnector]);

    async function signExampleTransaction() {
        if (!dAppConnector) throw Error('Wallet not connected');
        console.log('signExampleTransaction with dAppConnector:', dAppConnector);
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

        if (agentResponse.transactionBytes) {
            const result = await dAppConnector?.signAndExecuteTransaction({
                signerAccountId: dAppConnector.signers[0].getAccountId().toString(),
                transactionList: agentResponse.transactionBytes,
            });
            console.log('result:', result);
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

                    <EmptyChat isChatEmpty={chatHistory.length <= 0} />
                </div>
                <ChatInput handleUserMessage={handleUserMessage} prompt={prompt} setPrompt={setPrompt} isPending={isPending} />
            </main>
        </div>
    );
}
