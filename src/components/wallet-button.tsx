"use client";

import {useAppKit} from "@reown/appkit/react";
import {useWallet} from "@/hooks/use-wallet";

export function WalletButton() {
    const { open } = useAppKit();
    const {address, isDisconnected} = useWallet()

    return (
        <button
            className="w-60 truncate"
            onClick={() => open()}>
            {isDisconnected ? "Log in" : address}
        </button>
    )
}