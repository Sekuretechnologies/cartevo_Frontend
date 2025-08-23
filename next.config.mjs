/** @type {import('next').NextConfig} */
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const nextConfig = {
	webpack: (config) => {
		config.resolve.alias = {
			...config.resolve.alias,
			"@": path.resolve(__dirname, "./"),
		};

		return config;
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
			},
		],
	},
	reactStrictMode: false,
	sassOptions: {
		includePaths: [path.join(__dirname, "styles")],
	},
	async redirects() {
		return [
			{
				source: "/",
				destination: "/login",
				permanent: false,
			},
		];
	},
	async headers() {
		return [
			{
				// Match all API routes
				source: "/api/:path*",
				headers: [
					{ key: "Access-Control-Allow-Credentials", value: "true" },
					{
						key: "Access-Control-Allow-Origin",
						value: "https://cartevo.co",
					},
					{
						key: "Access-Control-Allow-Methods",
						value: "GET,OPTIONS,POST,PUT,DELETE",
					},
					{
						key: "Access-Control-Allow-Headers",
						value: "Content-Type,Authorization",
					},
				],
			},
		];
	},
};

export default nextConfig;
