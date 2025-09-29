"use client";

import { I18nProviderClient } from "../../locales/client";
import { NextUIProvider } from "@nextui-org/react";
import { PropsWithChildren } from "react";

export function Providers(
    props: PropsWithChildren<{ locale: string }>
) {
    return (
        <NextUIProvider locale={props.locale}>
            <I18nProviderClient locale={props.locale}>
                {props.children}
            </I18nProviderClient>
        </NextUIProvider>
    );
}
