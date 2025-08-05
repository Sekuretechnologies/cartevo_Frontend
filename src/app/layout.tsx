import React from "react";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import type { Metadata } from "next";
import StoreProvider from "./storeProvider";
import { NextUIProvider } from "@nextui-org/react";
// import { I18nProvider } from "@react-aria/i18n";
export const metadata: Metadata = {
	title: "Cartevo",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="fr" className={""}>
			<body className="">
				<NextUIProvider locale="en-GB">
					<StoreProvider>
						{children}
						<Toaster position="top-right" />
					</StoreProvider>
				</NextUIProvider>
			</body>
		</html>
	);
}
