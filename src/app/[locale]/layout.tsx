import React from "react";
import { Toaster } from "react-hot-toast";
import { Providers } from "./provider";
import StoreProvider from "./storeProvider";
// @ts-ignore
import "./globals.css";

export default function LocaleLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: { locale: string };
}>) {
    return (
        <StoreProvider>
            <Providers locale={params.locale}>
                {children}
                <Toaster position="top-right" />
            </Providers>
        </StoreProvider>
    );
}
