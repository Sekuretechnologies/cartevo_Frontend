/**
 * Authentication utility functions
 */

export interface TokenPayload {
	exp?: number;
	iat?: number;
	sub?: string;
	[key: string]: any;
}

/**
 * Check if a JWT token is expired
 * @param token - JWT token string
 * @returns true if token is expired or invalid, false otherwise
 */
export const isTokenExpired = (token: string | null): boolean => {
	if (!token) return true;

	try {
		const payload = JSON.parse(atob(token.split(".")[1])) as TokenPayload;
		const currentTime = Date.now() / 1000;

		return payload.exp ? payload.exp < currentTime : false;
	} catch (error) {
		// Invalid token format
		return true;
	}
};

/**
 * Get token expiration time in milliseconds
 * @param token - JWT token string
 * @returns expiration time or null if invalid
 */
export const getTokenExpiration = (token: string | null): number | null => {
	if (!token) return null;

	try {
		const payload = JSON.parse(atob(token.split(".")[1])) as TokenPayload;
		return payload.exp ? payload.exp * 1000 : null;
	} catch (error) {
		return null;
	}
};

/**
 * Check if token will expire within a certain time frame
 * @param token - JWT token string
 * @param minutes - minutes before expiration to consider as "expiring soon"
 * @returns true if token will expire within the specified time
 */
export const isTokenExpiringSoon = (
	token: string | null,
	minutes: number = 5
): boolean => {
	if (!token) return true;

	const expiration = getTokenExpiration(token);
	if (!expiration) return true;

	const warningTime = Date.now() + minutes * 60 * 1000;
	return expiration < warningTime;
};

/**
 * Get the current token from localStorage
 * @returns token string or null
 */
export const getStoredToken = (): string | null => {
	if (typeof window === "undefined") return null;
	return localStorage.getItem("sktoken");
};

/**
 * Clear stored authentication data
 */
export const clearAuthData = (): void => {
	if (typeof window === "undefined") return;

	localStorage.removeItem("sktoken");
	// Clear Redux state by dispatching logout action
	// This would need to be imported and used where needed
};

/**
 * Redirect to login page with current URL stored
 * @param currentPath - current page path (optional, will use window.location if not provided)
 */
export const redirectToLogin = (currentPath?: string): void => {
	if (typeof window === "undefined") return;

	const path = currentPath || window.location.pathname;
	window.sessionStorage.setItem("previousUrl", path);
	window.location.href = "/login";
};

/**
 * Validate current authentication state
 * @returns object with validation results
 */
export const validateAuthState = (tkn?: string) => {
	const token = tkn || getStoredToken();
	const isExpired = isTokenExpired(token);
	const isExpiringSoon = isTokenExpiringSoon(token, 10); // 10 minutes warning

	return {
		token,
		isExpired,
		isExpiringSoon,
		isValid: token && !isExpired,
	};
};
