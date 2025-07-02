"use client";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";

const ClientProviders = dynamic(
    () => import("./client-providers").then((mod) => mod.ClientProviders),
    { ssr: false }
);

export default function ClientProvidersWrapper({ children }: { children: ReactNode }) {
    return <ClientProviders>{children}</ClientProviders>;
} 