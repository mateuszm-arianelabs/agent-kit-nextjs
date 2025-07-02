"use client"

import {useAppKitAccount} from "@reown/appkit/react";

export function useWallet() {
    const {status, address} = useAppKitAccount()

    const isLoading = status === "connecting" || status === "reconnecting";
    const isConnected = status === "connected";
    const isDisconnected = status === "disconnected";

    return {address, isLoading, isConnected, isDisconnected};
}