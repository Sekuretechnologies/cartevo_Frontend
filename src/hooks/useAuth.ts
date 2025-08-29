import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentToken, logOut } from "@/redux/slices/auth";
import {
	isTokenExpired,
	isTokenExpiringSoon,
	validateAuthState,
	redirectToLogin,
} from "@/utils/auth";

export const useAuth = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const token = useSelector(selectCurrentToken);
	const [isChecking, setIsChecking] = useState(true);

	// Check authentication on mount and token changes
	useEffect(() => {
		const checkAuth = () => {
			const authState = validateAuthState(token);

			if (authState.isExpired) {
				// Token is expired, logout and redirect
				dispatch(logOut());
				redirectToLogin();
				return;
			}

			if (authState.isExpiringSoon) {
				// Token will expire soon, you could show a warning here
				console.warn("Token will expire soon. Consider refreshing.");
			}

			setIsChecking(false);
		};

		checkAuth();

		// Set up periodic check every 5 minutes
		const interval = setInterval(checkAuth, 5 * 60 * 1000);

		return () => clearInterval(interval);
	}, [token, dispatch, router]);

	// Manual token validation
	const validateToken = () => {
		return validateAuthState(token);
	};

	// Force logout
	const forceLogout = () => {
		dispatch(logOut());
		redirectToLogin();
	};

	// Check if user is authenticated
	const isAuthenticated = () => {
		return token && !isTokenExpired(token);
	};

	// Get token expiration info
	const getTokenInfo = () => {
		return {
			token,
			isExpired: isTokenExpired(token),
			isExpiringSoon: isTokenExpiringSoon(token),
			isValid: isAuthenticated(),
		};
	};

	return {
		token,
		isAuthenticated: isAuthenticated(),
		isChecking,
		validateToken,
		forceLogout,
		getTokenInfo,
	};
};
