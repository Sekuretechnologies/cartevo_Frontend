import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
	title: "Cartevo - Dashboard",
};

export default function AdminLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: { locale: string };
}>) {
	const scriptSrc =
		params.locale === "fr"
			? "https://cartevo.bolddesk.com/chatwidget-api/widget/v1/005a8bac-b5a3-4990-a9ea-d9a749dde2c4"
			: "https://support.cartevo.co/chatwidget-api/widget/v1/c9691f6f-818a-4e8f-996b-0cab3dc476ae";

	return (
		<>
			{children}
			<script src={scriptSrc} defer async></script>
		</>
	);
}
