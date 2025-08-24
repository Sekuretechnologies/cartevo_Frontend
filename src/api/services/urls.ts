// export const BASE_URL = `${process.senv.NEXT_PUBLIC_API_URI}/api/v1`;
export const BASE_URL = `https://api.cartevo.co/api/v1`;

/** AUTH ============================================================ */
export const BASE_URL_AUTH = `${BASE_URL}/auth`;
export const authUrls = {
	LOGIN: `${BASE_URL_AUTH}/login`,
	LOGOUT: `${BASE_URL_AUTH}/logout`,
	// RESEND_OTP: `${BASE_URL_AUTH}/resend-otp`,
	VERIFY_OTP: `${BASE_URL_AUTH}/verify-otp`,
	REGISTER_STEP1: `${BASE_URL}/company/register/step1`,
	REGISTER_STEP2: `${BASE_URL}/company/register/step2`,
};

/** COMPANY ============================================================ */
export const BASE_URL_COMPANY = `${BASE_URL}/company`;
export const companyUrls = {
	GET_WALLETS: `${BASE_URL_COMPANY}/wallets`,
	GET_TRANSACTIONS: `${BASE_URL_COMPANY}/transactions`,
};
