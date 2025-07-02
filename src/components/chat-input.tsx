"use client";

import {Dispatch, SetStateAction} from "react";

type ChatInputProps = {
    isPending: boolean;
    prompt: string;
    setPrompt: Dispatch<SetStateAction<string>>;
    handleUserMessage: () => void;

}

export function ChatInput({handleUserMessage,setPrompt,isPending, prompt}: ChatInputProps) {
    return (
        <div className="flex py-4 gap-3">
            <input disabled={isPending} className="grow bg-zinc-700 rounded-lg pl-2" value={prompt} onChange={(e) => setPrompt(e.target.value)}/>
            <button disabled={isPending} type="submit" className="bg-zinc-700 rounded-lg px-4 py-2" onClick={handleUserMessage}>Send</button>
        </div>
    )
}