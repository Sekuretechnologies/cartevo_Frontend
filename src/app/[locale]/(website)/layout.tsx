"use client";
import WebsiteFooter from "@/components/websiteComponents/WebsiteFooter";
import WebsiteHeader from "@/components/websiteComponents/WebsiteHeader";
import { useTranslation } from "@/hooks/useTranslation";

export default function SiteLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { t, locale } = useTranslation();
	const scriptSrc =
		locale === "fr"
			? "https://cartevo.bolddesk.com/chatwidget-api/widget/v1/005a8bac-b5a3-4990-a9ea-d9a749dde2c4"
			: "https://support.cartevo.co/chatwidget-api/widget/v1/c9691f6f-818a-4e8f-996b-0cab3dc476ae";
	return (
		<>
			<WebsiteHeader />
			<main>{children}</main>
			<WebsiteFooter />
			<script src={scriptSrc} defer async></script>
		</>
	);
}