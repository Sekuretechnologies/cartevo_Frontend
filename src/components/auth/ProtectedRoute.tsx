"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
	children: React.ReactNode;
	redirectTo?: string;
	requireAuth?: boolean;
}

/**
 * Higher-order component that protects routes requiring authentication
 * Automatically redirects to login if token is expired or missing
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
	children,
	redirectTo = "/login",
	requireAuth = true,
}) => {
	const router = useRouter();
	const { isAuthenticated, isChecking } = useAuth();

	useEffect(() => {
		if (isChecking) return; // Still checking authentication

		if (requireAuth && !isAuthenticated) {
			// Store current path for redirect after login
			if (typeof window !== "undefined") {
				window.sessionStorage.setItem(
					"previousUrl",
					window.location.pathname
				);
			}
			router.push(redirectTo);
			return;
		}
	}, [isAuthenticated, isChecking, requireAuth, redirectTo, router]);

	// Show loading while checking authentication
	if (isChecking) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	// Don't render children if authentication is required but not met
	if (requireAuth && !isAuthenticated) {
		return null;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
