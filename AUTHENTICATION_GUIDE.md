# Authentication System Guide

## Overview

This document provides a comprehensive guide to the authentication system implemented in the Cartevo frontend application. The system handles user login, logout, signup, token management, and automatic token expiration detection with seamless redirects.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Token Management](#token-management)
3. [Login Flow](#login-flow)
4. [Signup Flow](#signup-flow)
5. [Logout Flow](#logout-flow)
6. [Token Expiration Handling](#token-expiration-handling)
7. [Protected Routes](#protected-routes)
8. [API Integration](#api-integration)
9. [Error Handling](#error-handling)
10. [Best Practices](#best-practices)

## Architecture Overview

The authentication system is built with the following components:

```
├── Redux Store (auth slice)
├── Authentication Utilities (src/utils/auth.ts)
├── Authentication Hook (src/hooks/useAuth.ts)
├── Protected Route Component (src/components/auth/ProtectedRoute.tsx)
├── API Base Methods (src/api/baseMethods.ts)
├── Authentication Services (src/api/services/cartevo-api/auth.ts)
└── Layout Component (src/components/shared/Layout.tsx)
```

### Key Technologies

-   **Redux Toolkit**: State management for authentication data
-   **JWT Tokens**: For secure authentication
-   **Next.js**: Routing and navigation
-   **TypeScript**: Type safety
-   **Local Storage**: Token persistence
-   **Session Storage**: Temporary data storage

## Token Management

### Token Storage Strategy

```typescript
// Primary storage: localStorage
localStorage.setItem("sktoken", token);

// Temporary storage: sessionStorage
sessionStorage.setItem("previousUrl", currentPath);
```

### Token Structure

The system expects JWT tokens with the following payload structure:

```json
{
	"sub": "user_id",
	"iat": 1640995200,
	"exp": 1641081600,
	"role": "user",
	"email": "user@example.com"
}
```

### Token Validation

The system validates tokens using the following utilities:

```typescript
// src/utils/auth.ts
export const isTokenExpired = (token: string | null): boolean => {
	if (!token) return true;

	try {
		const payload = JSON.parse(atob(token.split(".")[1]));
		const currentTime = Date.now() / 1000;
		return payload.exp ? payload.exp < currentTime : false;
	} catch (error) {
		return true; // Invalid token format
	}
};
```

## Login Flow

### Step-by-Step Login Process

#### 1. User Initiates Login

```typescript
// User enters credentials in login form
const credentials = {
	email: "user@example.com",
	password: "password123",
};
```

#### 2. API Call to Authentication Service

```typescript
// src/api/services/cartevo-api/auth.ts
export class AuthService {
	static login = (info: any) =>
		BaseMethods.postRequest(authUrls.LOGIN, info, false);
}
```

#### 3. BaseMethods Handles the Request

```typescript
// src/api/baseMethods.ts
static postRequest = async (
  url: string,
  body: any,
  required_auth: boolean,
  queryParams?: Record<string, string>,
  inputToken?: string
): Promise<Response>
```

#### 4. Successful Response Processing

```typescript
// Login component handles successful response
const response = await AuthService.login(credentials);
const data = await response.json();

if (response.ok) {
	// Store token and user data
	dispatch(
		setCredentials({
			token: data.token,
			company: data.company,
			user: data.user,
		})
	);

	// Persist token
	localStorage.setItem("sktoken", data.token);

	// Redirect to intended page or dashboard
	const previousUrl = sessionStorage.getItem("previousUrl");
	router.push(previousUrl || "/wallets");
}
```

#### 5. Redux State Update

```typescript
// src/redux/slices/auth.ts
const authSlice = createSlice({
	name: "auth",
	initialState: {
		token: null,
		company: null,
		user: null,
		user_email: null,
	},
	reducers: {
		setCredentials: (state, action) => {
			const { token, company, user } = action.payload;
			state.token = token;
			state.company = company;
			state.user = user;
		},
	},
});
```

### Login Flow Diagram

```
1. User Form → 2. AuthService.login() → 3. BaseMethods.postRequest()
     ↓                     ↓                        ↓
4. API Response → 5. Redux Dispatch → 6. localStorage.setItem()
     ↓                     ↓                        ↓
7. Router Redirect → 8. Clear previousUrl → 9. Dashboard Load
```

## Signup Flow

### Step-by-Step Signup Process

#### 1. Multi-Step Registration

The signup process involves multiple steps:

```typescript
// Step 1: Basic Information
static registerStep1 = (info: any) =>
  BaseMethods.postFileRequest(authUrls.REGISTER_STEP1, info, false);

// Step 2: Additional Details
static registerStep2 = (info: any) =>
  BaseMethods.postFileRequest(authUrls.REGISTER_STEP2, info, false);

// Final: Account Creation
static createAccount = (info: any) =>
  BaseMethods.postRequest(authUrls.CREATE_ACCOUNT, info, false);
```

#### 2. OTP Verification

```typescript
// After signup, verify OTP
static verifyOtp = (info: any) =>
  BaseMethods.postRequest(authUrls.VERIFY_OTP, info, false);
```

#### 3. Post-Signup Flow

```typescript
// After successful verification
dispatch(
	setCredentials({
		token: response.token,
		company: response.company,
		user: response.user,
	})
);

// Redirect to onboarding or dashboard
if (company?.onboarding_is_completed) {
	router.push("/wallets");
} else {
	router.push("/onboarding");
}
```

## Logout Flow

### Step-by-Step Logout Process

#### 1. User Initiates Logout

```typescript
// User clicks logout button
const handleLogout = () => {
	dispatch(logOut());
	router.push("/login");
};
```

#### 2. Redux State Cleanup

```typescript
// src/redux/slices/auth.ts
logOut: (state) => {
	state.token = null;
	state.company = null;
	state.user = null;
	// Note: localStorage cleanup happens elsewhere
};
```

#### 3. Storage Cleanup

```typescript
// Clear all authentication data
localStorage.removeItem("sktoken");
sessionStorage.removeItem("previousUrl");

// Optional: Clear other session data
sessionStorage.clear();
```

#### 4. API Call (Optional)

```typescript
// Notify server about logout
static logout = (token: string) =>
  BaseMethods.postRequest(authUrls.LOGOUT, {}, true, undefined, token);
```

#### 5. Redirect to Login

```typescript
// Clear any sensitive data from memory
window.location.href = "/login";
```

## Token Expiration Handling

### Automatic Detection

#### 1. API Request Interception

```typescript
// src/api/baseMethods.ts - getHeadersAuth method
static getHeadersAuth(isFile: boolean = false, inputToken?: string): Headers {
  const headers = BaseMethods.getHeaders(isFile);
  const token = inputToken || localStorage.getItem("sktoken") || "";

  // Check if token is expired
  if (token === '') {
    redirectToLogin();
    return headers;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;

    if (payload.exp && payload.exp < currentTime) {
      // Token is expired
      localStorage.removeItem('sktoken');
      redirectToLogin();
      return headers;
    }
  } catch (error) {
    // Invalid token format
    localStorage.removeItem('sktoken');
    redirectToLogin();
    return headers;
  }

  headers.append("Authorization", `Bearer ${token}`);
  return headers;
}
```

#### 2. React Hook Monitoring

```typescript
// src/hooks/useAuth.ts
export const useAuth = () => {
	const token = useSelector(selectCurrentToken);

	useEffect(() => {
		const checkAuth = () => {
			const authState = validateAuthState();

			if (authState.isExpired) {
				dispatch(logOut());
				redirectToLogin();
				return;
			}

			if (authState.isExpiringSoon) {
				console.warn("Token will expire soon. Consider refreshing.");
			}
		};

		checkAuth();

		// Check every 5 minutes
		const interval = setInterval(checkAuth, 5 * 60 * 1000);

		return () => clearInterval(interval);
	}, [token, dispatch]);

	return {
		isAuthenticated: token && !isTokenExpired(token),
		// ... other methods
	};
};
```

#### 3. Layout Component Protection

```typescript
// src/components/shared/Layout.tsx
const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { isAuthenticated, isChecking } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isChecking) return;

    if (!isAuthenticated) {
      sessionStorage.setItem("previousUrl", pathname);
      router.push("/login");
      return;
    }

    // Additional fallback check
    const storedToken = localStorage.getItem('sktoken');
    if (storedToken && isTokenExpired(storedToken)) {
      dispatch(logOut());
      sessionStorage.setItem("previousUrl", pathname);
      router.push("/login");
    }
  }, [isAuthenticated, isChecking, router, pathname, dispatch]);

  return (
    // Layout content
  );
};
```

### Expiration Warning System

```typescript
// Check if token expires within specified minutes
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
```

## Protected Routes

### Higher-Order Component

```typescript
// src/components/auth/ProtectedRoute.tsx
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
	children,
	redirectTo = "/login",
	requireAuth = true,
}) => {
	const router = useRouter();
	const { isAuthenticated, isChecking } = useAuth();

	useEffect(() => {
		if (isChecking) return;

		if (requireAuth && !isAuthenticated) {
			sessionStorage.setItem("previousUrl", window.location.pathname);
			router.push(redirectTo);
			return;
		}
	}, [isAuthenticated, isChecking, requireAuth, redirectTo, router]);

	if (isChecking) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	if (requireAuth && !isAuthenticated) {
		return null;
	}

	return <>{children}</>;
};
```

### Usage Examples

```typescript
// Protected dashboard page
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Dashboard() {
	return (
		<ProtectedRoute>
			<Layout title="Dashboard">
				<DashboardContent />
			</Layout>
		</ProtectedRoute>
	);
}

// Public page (no auth required)
export default function PublicPage() {
	return (
		<ProtectedRoute requireAuth={false}>
			<PublicContent />
		</ProtectedRoute>
	);
}
```

## API Integration

### Request Interception

```typescript
// All API calls automatically include authentication
const response = await BaseMethods.getRequest(
	"/api/user/profile",
	true, // requires auth
	{}, // query params
	undefined // use stored token
);

// BaseMethods automatically:
// 1. Retrieves token from localStorage
// 2. Checks if token is expired
// 3. Redirects to login if expired
// 4. Adds Authorization header if valid
```

### Response Handling

```typescript
// Handle 401 responses in components
const fetchUserData = async () => {
	try {
		const response = await fetch("/api/user/data");

		if (response.status === 401) {
			// Token expired on server side
			localStorage.removeItem("sktoken");
			redirectToLogin();
			return;
		}

		const data = await response.json();
		// Process data
	} catch (error) {
		console.error("API Error:", error);
	}
};
```

## Error Handling

### Network Errors

```typescript
// Handle network failures gracefully
const makeAuthenticatedRequest = async () => {
	try {
		const response = await BaseMethods.postRequest(url, data, true);

		if (!response.ok) {
			if (response.status === 401) {
				// Token expired
				handleTokenExpiration();
			} else if (response.status === 403) {
				// Insufficient permissions
				handleForbiddenError();
			} else {
				// Other errors
				handleGenericError();
			}
		}

		return await response.json();
	} catch (error) {
		// Network error
		console.error("Network error:", error);
		// Could implement retry logic here
	}
};
```

### Token Validation Errors

```typescript
// Handle malformed tokens
const validateAndRefreshToken = async () => {
	const token = getStoredToken();

	if (!token) {
		redirectToLogin();
		return;
	}

	if (isTokenExpired(token)) {
		// Try to refresh token
		try {
			const refreshResponse = await AuthService.refreshToken();
			if (refreshResponse.ok) {
				const newToken = await refreshResponse.json();
				localStorage.setItem("sktoken", newToken.token);
				dispatch(setCredentials(newToken));
			} else {
				redirectToLogin();
			}
		} catch (error) {
			redirectToLogin();
		}
	}
};
```

## Best Practices

### 1. Security Considerations

```typescript
// Always validate tokens on both client and server
// Use HTTPS for all authentication requests
// Implement proper CORS policies
// Store tokens securely (localStorage with httpOnly cookies for sensitive apps)
// Implement token refresh mechanisms
```

### 2. User Experience

```typescript
// Provide clear feedback during authentication processes
// Show loading states during token validation
// Preserve user context after re-authentication
// Implement smooth transitions between auth states
```

### 3. Error Recovery

```typescript
// Implement retry mechanisms for network failures
// Provide fallback authentication methods
// Handle offline scenarios gracefully
// Log authentication events for debugging
```

### 4. Performance Optimization

```typescript
// Cache authentication state when possible
// Minimize token validation frequency
// Use efficient token parsing methods
// Implement lazy loading for auth components
```

### 5. Testing Strategy

```typescript
// Test token expiration scenarios
// Mock authentication states
// Test network failure scenarios
// Validate redirect behaviors
// Test protected route access
```

## Configuration

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://api.cartevo.co/api/v1
NEXT_PUBLIC_APP_URL=https://app.cartevo.co
```

### Constants

```typescript
// src/config/urls.ts
export const BASE_URL = `https://api.cartevo.co/api/v1`;
export const authUrls = {
	LOGIN: `${BASE_URL}/auth/login`,
	LOGOUT: `${BASE_URL}/auth/logout`,
	VERIFY_OTP: `${BASE_URL}/auth/verify-otp`,
	CREATE_ACCOUNT: `${BASE_URL}/company/register`,
	// ... other endpoints
};
```

## Troubleshooting

### Common Issues

1. **Token not persisting after refresh**

    - Check localStorage availability
    - Verify token format
    - Check for storage quota issues

2. **Infinite redirect loops**

    - Verify redirect conditions
    - Check for circular dependencies
    - Ensure proper cleanup of session storage

3. **Authentication state not updating**

    - Verify Redux store configuration
    - Check for proper dispatch calls
    - Ensure component re-rendering

4. **API calls failing with 401**
    - Verify token expiration logic
    - Check server-side token validation
    - Ensure proper header formatting

### Debug Tools

```typescript
// Debug authentication state
const debugAuthState = () => {
	const token = localStorage.getItem("sktoken");
	const authState = validateAuthState();

	console.log("Auth Debug:", {
		token: token ? "present" : "missing",
		isExpired: authState.isExpired,
		isExpiringSoon: authState.isExpiringSoon,
		isValid: authState.isValid,
		expiration: getTokenExpiration(token),
	});
};
```

## Conclusion

This authentication system provides a robust, scalable solution for managing user authentication in the Cartevo application. The multi-layered approach ensures security, user experience, and maintainability while handling edge cases and error scenarios gracefully.

Key strengths of this implementation:

-   **Comprehensive Coverage**: Handles all authentication scenarios
-   **Automatic Protection**: Works seamlessly across the application
-   **User-Friendly**: Preserves context and provides smooth transitions
-   **Secure**: Implements proper token validation and cleanup
-   **Maintainable**: Well-structured, typed, and documented code
-   **Extensible**: Easy to add new authentication features

The system is production-ready and follows industry best practices for web application authentication.
