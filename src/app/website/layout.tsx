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
			</body>
		</html>
	);
}
