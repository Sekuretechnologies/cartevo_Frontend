"use client";

import { I18nProviderClient } from "../../locales/client";
import { NextUIProvider } from "@nextui-org/react";
import { PropsWithChildren } from "react";

export function Providers(
    props: PropsWithChildren<{ locale: string }>
) {
    const rawLocale = props.locale || "en";
    const nextUiLocale = (() => {
        if (rawLocale === "fr") return "fr-FR";
        if (rawLocale === "en") return "en-US";
        // If it's already a BCP-47 tag like en-GB, fr-FR, keep it
        if (rawLocale.includes("-")) return rawLocale;
        // Fallback
        return "en-US";
    })();
    return (
        <NextUIProvider locale={nextUiLocale}>
            <I18nProviderClient locale={props.locale}>
                {props.children}
            </I18nProviderClient>
        </NextUIProvider>
    );
}
