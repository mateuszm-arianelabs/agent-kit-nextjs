"use client"

import {ChatMessage} from "@/shared/types";
import {useEffect, useState} from "react";
import {useHandleChat} from "@/api/handle-chat";
import {useSignMessage} from "wagmi";
import { Transaction } from '@hashgraph/sdk';
import {ChatInput} from "@/components/chat-input";
import {EmptyChat} from "@/components/empty-chat";
import {Header} from "@/components/header";
import { useAppKitProvider } from "@reown/appkit/react";
import type { Provider } from "@reown/appkit/react";

export default function Home() {
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
    const [prompt, setPrompt] = useState("");
    const {mutateAsync, isPending} = useHandleChat();
    const { signMessageAsync } = useSignMessage()

    const { walletProvider } = useAppKitProvider<Provider>("eip155");

    async function test() {
        console.log(walletProvider)
        const result = await walletProvider.request({
            method: "hedera_signAndExecuteTransaction",
            params: {
                signerAccountId: "hedera:testnet:0.0.4515756",
                transactionList: "ChsaACIXIgIIeDIAwgEOCgVzaWVtYTIFCIDO2gM="
            }
        });
        console.log(result);
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
            const sign = await signMessageAsync({
                message: transaction.toBytes().toString()
            });
            setChatHistory(v => [...v, {
                type: "ai",
                content: sign
            }])
        }

        console.log(prompt)
    }

  return (
    <div className="h-screen w-full bg-zinc-900 flex items-center justify-center flex-col">
        <main className="w-4xl h-full flex flex-col">
            <Header />
            <button onClick={test}>
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
