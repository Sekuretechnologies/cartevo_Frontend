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

/** CUSTOMER ============================================================ */
export const BASE_URL_CUSTOMER = `${BASE_URL}/customers`;
export const customersUrls = {
	GET_CUSTOMERS: `${BASE_URL_CUSTOMER}`,
	GET_CUSTOMER: (id: any) => `${BASE_URL_CUSTOMER}/${id}`,
	CREATE_CUSTOMER: `${BASE_URL_CUSTOMER}`,
	UPDATE_CUSTOMER: `${BASE_URL_CUSTOMER}`,
	GET_CUSTOMER_CARDS: (id: any) => `${BASE_URL_CUSTOMER}/${id}/cards`,
	GET_CUSTOMER_TRANSACTIONS: (id: any) =>
		`${BASE_URL_CUSTOMER}/${id}/transactions`,
};

/** CARD ============================================================ */
export const BASE_URL_CARD = `${BASE_URL}/cards`;
export const cardsUrls = {
	GET_CARDS: `${BASE_URL_CARD}`,
	CREATE_CARD: `${BASE_URL_CARD}`,
	UPDATE_CARD: `${BASE_URL_CARD}`,
};
