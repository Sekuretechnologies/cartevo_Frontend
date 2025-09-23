// export const BASE_URL = `${process.senv.NEXT_PUBLIC_API_URI}/api/v1`;
export const BASE_URL = `https://api.cartevo.co/api/v1`;
// export const BASE_URL = `http://127.0.0.1:3001/api/v1`;

/** AUTH ============================================================ */
export const BASE_URL_AUTH = `${BASE_URL}/auth`;
export const authUrls = {
	LOGIN: `${BASE_URL_AUTH}/login`,
	LOGOUT: `${BASE_URL_AUTH}/logout`,
	// RESEND_OTP: `${BASE_URL_AUTH}/resend-otp`,
	VERIFY_OTP: `${BASE_URL_AUTH}/verify-otp`,
	CREATE_ACCOUNT: `${BASE_URL}/company/register`,
	REGISTER_STEP1: `${BASE_URL}/company/register/step1`,
	REGISTER_STEP2: `${BASE_URL}/company/register/step2`,
	LOGIN_WITH_COMPANY: `${BASE_URL_AUTH}/select-company`,
	ACCEPT_INVITATION: `${BASE_URL_AUTH}/invitations/accept`,
};

/** COMPANY ============================================================ */
export const BASE_URL_COMPANY = `${BASE_URL}/company`;
export const companyUrls = {
	GET_TRANSACTIONS: `${BASE_URL_COMPANY}/transactions`,
	GET_ONBOARDING_STEPS: `${BASE_URL_COMPANY}/onboarding-steps`,
	COMPLETE_KYB: `${BASE_URL_COMPANY}/onboarding/kyb`,
	COMPLETE_KYC: `${BASE_URL_COMPANY}/onboarding/kyc`,
	GET_VERIFICATION_STATUS: `${BASE_URL_COMPANY}/get-status`,
	// GET_VERIFICATION_STATUS: `http://127.0.0.1:3001/api/v1/company/get-status`,
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
	// UPDATE_CARD: `${BASE_URL_CARD}`,
	GET_ONE_CARD: (id: any) => `${BASE_URL_CARD}/${id}`,
	GET_CARD_BALANCE: (id: any) => `${BASE_URL_CARD}/${id}/balance`,
	GET_CARD_TRANSACTIONS: (id: any) => `${BASE_URL_CARD}/${id}/transactions`,
	FUND_CARD: (id: any) => `${BASE_URL_CARD}/${id}/fund`,
	WITHDRAW_CARD: (id: any) => `${BASE_URL_CARD}/${id}/withdraw`,
	FREEZE_CARD: (id: any) => `${BASE_URL_CARD}/${id}/freeze`,
	UNFREEZE_CARD: (id: any) => `${BASE_URL_CARD}/${id}/unfreeze`,
	TERMINATE_CARD: (id: any) => `${BASE_URL_CARD}/${id}`,
};

/** SETTINGS ============================================================ */
export const BASE_URL_SETTINGS = `${BASE_URL}/company`;
export const settingsUrls = {
	// Exchange Rates
	GET_EXCHANGE_RATES: `${BASE_URL_SETTINGS}/exchange-rates`,
	CREATE_EXCHANGE_RATE: `${BASE_URL_SETTINGS}/exchange-rates`,
	UPDATE_EXCHANGE_RATE: (id: any) =>
		`${BASE_URL_SETTINGS}/exchange-rates/${id}`,
	DELETE_EXCHANGE_RATE: (id: any) =>
		`${BASE_URL_SETTINGS}/exchange-rates/${id}`,

	// Transaction Fees
	GET_TRANSACTION_FEES: `${BASE_URL_SETTINGS}/transaction-fees`,
	CREATE_TRANSACTION_FEE: `${BASE_URL_SETTINGS}/transaction-fees`,
	UPDATE_TRANSACTION_FEE: (id: any) =>
		`${BASE_URL_SETTINGS}/transaction-fees/${id}`,
	DELETE_TRANSACTION_FEE: (id: any) =>
		`${BASE_URL_SETTINGS}/transaction-fees/${id}`,
	CREATE_TEAM_MEMBER: `${BASE_URL_SETTINGS}/`,
	GET_TEAM_MEMBERS: `${BASE_URL_SETTINGS}`,
};

/** DEVELOPERS ============================================================ */
export const BASE_URL_DEVELOPERS = `${BASE_URL}/company`;
export const developersUrls = {
	GET_DEVELOPER_SETTINGS: `${BASE_URL_DEVELOPERS}/credentials`,
	UPDATE_WEBHOOK: `${BASE_URL_DEVELOPERS}/webhook`,
	REGENERATE_CREDENTIALS: `${BASE_URL_DEVELOPERS}/regenerate-client-key`,
};

/** WALLETS ============================================================ */
export const BASE_URL_WALLET = `${BASE_URL}/wallets`;
export const BASE_URL_WALLET_TRANSACTIONS = `${BASE_URL}/wallet/transactions`;
export const walletUrls = {
	GET_WALLETS: `${BASE_URL_WALLET}`,
	GET_WALLET: (id: any) => `${BASE_URL_WALLET}/${id}`,
	CREATE_WALLET: `${BASE_URL_WALLET}`,
	FUND_WALLET: `${BASE_URL_WALLET}/fund`,
	DEPOSIT_TO_WALLET: `${BASE_URL_WALLET}/deposit`,
	WITHDRAW_WALLET: `${BASE_URL_WALLET}/withdraw`,
	TRANSFER_INTERNAL: (id: any) =>
		`${BASE_URL_WALLET}/${id}/transfer-internal`,
	TRANSFER_INTERNAL_ADVANCED: (id: any) =>
		`${BASE_URL_WALLET}/${id}/transfer-internal-advanced`,
	TRANSFER_BETWEEN: `${BASE_URL_WALLET}/transfer-between`,
	CALCULATE_TRANSFER_FEES: `${BASE_URL_WALLET}/calculate-transfer-fees`,
	GET_AVAILABLE_FOR_TRANSFER: (id: any) =>
		`${BASE_URL_WALLET}/${id}/available-for-transfer`,
	CREDIT_TEST_WALLET: `${BASE_URL_WALLET}/credit-test-wallet`,
	GET_TRANSACTIONS: `${BASE_URL_WALLET_TRANSACTIONS}`,
	// Wallet phone numbers
	WALLET_PHONE_NUMBERS: `${BASE_URL}/wallet-phone-numbers`,
	WALLET_PHONE_NUMBER: (id: any) => `${BASE_URL}/wallet-phone-numbers/${id}`,
};
