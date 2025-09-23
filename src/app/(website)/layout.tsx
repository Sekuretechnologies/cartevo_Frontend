import WebsiteFooter from "@/components/websiteComponents/WebsiteFooter";
import WebsiteHeader from "@/components/websiteComponents/WebsiteHeader";

// app/site/layout.tsx
export default function SiteLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="fr">
			<body className="text-[#222222]">
				<WebsiteHeader />

				<main>{children}</main>

				<WebsiteFooter />
				<script
					src="https://cartevo.bolddesk.com/chatwidget-api/widget/v1/005a8bac-b5a3-4990-a9ea-d9a749dde2c4"
					defer
					async
				></script>
			</body>
		</html>
	);
}
