import type { Metadata } from "next";
import Script from "next/script";
// import { I18nProvider } from "@react-aria/i18n";
export const metadata: Metadata = {
	title: "Cartevo",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="fr" className="">
			<head>
				<link
					href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
					rel="stylesheet"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Syne:wght@400..800&display=swap"
					rel="stylesheet"
				/>
				{/* Start cookieyes banner */}
				<Script
					id="cookieyes"
					src="https://cdn-cookieyes.com/client_data/40e31a15e268dd0908dc5c7a/script.js"
					strategy="beforeInteractive"
				/>
				{/* End cookieyes banner */}
			</head>
			<body className="">{children}</body>
		</html>
	);
}
