"use client";

import { useDAppConnector } from "./client-providers";

export function WalletButton() {
    const dAppConnector = useDAppConnector();

    const handleLogin = () => {
        if (dAppConnector) {
            dAppConnector.openModal();
        }
    };

    return (
        <button
            className="w-60 truncate"
            onClick={handleLogin}
            disabled={!dAppConnector}
        >
            LogIn
        </button>
    );
}