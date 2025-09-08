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
			<head>
				<link
					href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
					rel="stylesheet"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Syne:wght@400..800&display=swap"
					rel="stylesheet"
				/>
			</head>
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
