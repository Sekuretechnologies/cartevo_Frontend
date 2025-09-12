/** @type {import('next').NextConfig} */
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const nextConfig = {
	webpack: (config, { dev, isServer }) => {
		config.resolve.alias = {
			...config.resolve.alias,
			"@": path.resolve(__dirname, "./"),
		};

		// Completely disable CSS minification for production builds
		if (!dev && !isServer) {
			config.optimization = {
				...config.optimization,
				minimize: false,
			};
		}

		return config;
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
			},
		],
		formats: ["image/webp", "image/avif"],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
	},
	reactStrictMode: false,
	sassOptions: {
		includePaths: [path.join(__dirname, "styles")],
	},
	// async redirects() {
	// 	return [
	// 		{
	// 			source: "/",
	// 			destination: "/login",
	// 			permanent: false,
	// 		},
	// 	];
	// },
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
