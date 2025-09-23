import React from "react";
import { Toaster } from "react-hot-toast";
import type { Metadata } from "next";
import StoreProvider from "../storeProvider";
import { NextUIProvider } from "@nextui-org/react";

export const metadata: Metadata = {
	title: "Cartevo - Dashboard",
};

export default function AdminLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<NextUIProvider locale="en-GB">
				<StoreProvider>
					{children}
					<Toaster position="top-right" />
				</StoreProvider>
			</NextUIProvider>
			<script
				src="https://support.cartevo.co/chatwidget-api/widget/v1/c9691f6f-818a-4e8f-996b-0cab3dc476ae"
				defer
				async
			></script>
		</>
	);
}
