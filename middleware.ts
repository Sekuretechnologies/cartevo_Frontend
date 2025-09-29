// middleware.ts
import { createI18nMiddleware } from "next-international/middleware";
import { NextRequest } from "next/server";

const I18nMiddleware = createI18nMiddleware({
	locales: ["en", "fr"],
	defaultLocale: "fr",
});

export function middleware(request: NextRequest) {
	return I18nMiddleware(request);
}

export const config = {
	matcher: [
		// Match all pathnames except for
		// - API routes
		// - _next (Next.js internals)
		// - _static (inside /public)
		// - all root files inside /public (e.g. favicon.ico)
		"/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
	],
};
