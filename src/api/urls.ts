// export const BASE_URL = `${process.senv.NEXT_PUBLIC_API_URI}/api/v1`;
export const BASE_URL = `https://api.cartevo.co/api/v1`;
// export const BASE_URL = `http://127.0.0.1:3001/api/v1`;

// export const API_V2_BASE_URL = `http://localhost:3000/api/v2/admin`;
// export const API_V2_BASE_URL = `https://apigetsekure.com/api/v2/admin`;
export const API_V2_PROD_BASE_URL = `https://apigetsekure.com/api/v2/admin`;
export const API_V2_BASE_URL = `https://skr-api-v2.fly.dev/api/v2/admin`;

// export const BASE_URL_AUTH = `${BASE_URL}/admin/auth`;
// export const authUrls = {
//   LOGIN_USER: `${BASE_URL_AUTH}/login`,
//   LOGOUT_USER: `${BASE_URL_AUTH}/logout`,
//   // REGISTER_USER: `${BASE_URL}/signup`,
// };

/** AUTH ============================================================ */
export const BASE_URL_AUTH = `${BASE_URL}/auth`;
export const authUrls = {
	LOGIN: `${BASE_URL_AUTH}/login`,
	LOGOUT: `${BASE_URL_AUTH}/logout`,
	// RESEND_OTP: `${BASE_URL_AUTH}/resend-otp`,
	VERIFY_OTP: `${BASE_URL_AUTH}/verify-otp`,
	REGISTER_STEP1: `${BASE_URL}/company/register/step1`,
	REGISTER_STEP2: `${BASE_URL}/company/register/step2`,
	FORGOT_PASSWORD: `${BASE_URL_AUTH}/forgot-password`,
	RESET_PASSWORD: `${BASE_URL_AUTH}/reset-password`,
};

/** COMPANY ============================================================ */
export const BASE_URL_COMPANY = `${BASE_URL}/company`;
export const companyUrls = {
	GET_WALLETS: `${BASE_URL_COMPANY}/wallets`,
};

/** ------------------------------------ */
export const V2_BASE_URL_CUSTOMER = `${API_V2_BASE_URL}/customers`;
export const customerUrlsV2 = {
	GET_CUSTOMERS: `${V2_BASE_URL_CUSTOMER}`,
	GET_CUSTOMERS_STATS: `${V2_BASE_URL_CUSTOMER}/stats`,
	GENERATE_CUSTOMERS_EXCEL: `${V2_BASE_URL_CUSTOMER}/excel`,
	GET_REGULARISATIONS: `${V2_BASE_URL_CUSTOMER}/regularisations`,
	GET_REGULARISATION_STATS: `${V2_BASE_URL_CUSTOMER}/regularisations-stats`,
	GET_KYC_CUSTOMERS: `${V2_BASE_URL_CUSTOMER}/kyc`,
	GET_KYC_STATS: `${V2_BASE_URL_CUSTOMER}/kyc-stats`,
	GET_ONE_CUSTOMER: (id: any) => `${V2_BASE_URL_CUSTOMER}/${id}`,
	UPDATE_ONE_CUSTOMER: (id: any) => `${V2_BASE_URL_CUSTOMER}/${id}`,
	UPDATE_ONE_CUSTOMER_INFOS: (id: any) =>
		`${V2_BASE_URL_CUSTOMER}/infos/${id}`,
	UPDATE_ONE_CUSTOMER_PASSWORD: (id: any) =>
		`${V2_BASE_URL_CUSTOMER}/password/${id}`,
	UPDATE_ONE_CUSTOMER_REG_STATUS: (id: any) =>
		`${API_V2_PROD_BASE_URL}/customers/reg-status/${id}`,

	GET_ONE_CUSTOMER_TRANSACTIONS: (id: any) =>
		`${V2_BASE_URL_CUSTOMER}/${id}/transactions`,
	GET_ONE_CUSTOMER_TRANSFERS: (id: any) =>
		`${V2_BASE_URL_CUSTOMER}/${id}/transfers`,
	STATS_PER_COUNTRY: `${V2_BASE_URL_CUSTOMER}/stats/per-country`,
	RELEASE_ONE_USER_BALANCE: `${API_V2_PROD_BASE_URL}/customers/release-one-user-balance`,
};
/** ------------------------------------ */
export const V2_BASE_URL_CARD = `${API_V2_BASE_URL}/cards`;
export const cardUrlsV2 = {
	STATS_PER_COUNTRY: `${V2_BASE_URL_CARD}/stats/per-country`,
};
/** ------------------------------------ */
export const V2_BASE_URL_KYC = `${API_V2_BASE_URL}/kyc`;
export const kycUrlsV2 = {
	GET_KYC_WARNINGS_LIST: `${V2_BASE_URL_KYC}/warnings-list`,
};
/** ------------------------------------ */
export const V2_BASE_URL_TRANSACTION = `${API_V2_BASE_URL}/transactions`;
export const transactionUrlsV2 = {
	MANAGE_USER_ACCOUNT_TRANSACTIONS: `${V2_BASE_URL_TRANSACTION}/manage-user-account-balance`,
	STATS_PERIODIC: `${V2_BASE_URL_TRANSACTION}/stats/periodic`,
	STATS_PER_COUNTRY: `${V2_BASE_URL_TRANSACTION}/stats/per-country`,
	STATS_PER_CATEGORY_TYPE: `${V2_BASE_URL_TRANSACTION}/stats/per-category-type`,
	STATS_DAILY_PER_CATEGORY_TYPE: `${V2_BASE_URL_TRANSACTION}/stats/daily-per-category-type`,
	// VERIFY_TRX_STATUS: (id:any) => `${V2_BASE_URL_TRANSACTION}/verify-trx-status/${id}`,
	// CHECK_PARTNER_TRX: (id:any) => `${V2_BASE_URL_TRANSACTION}/check-partner-trx/${id}`,
	VERIFY_TRX_STATUS: (id: any) =>
		`${API_V2_PROD_BASE_URL}/transactions/verify-trx-status/${id}`,
	CHECK_PARTNER_TRX: (id: any) =>
		`${API_V2_PROD_BASE_URL}/transactions/check-partner-trx/${id}`,

	GET_ALL_TRANSACTIONS: `${V2_BASE_URL_TRANSACTION}`,
	GET_TODAY_STATS: `${V2_BASE_URL_TRANSACTION}/stats-today`,
	GET_DAILY_STATS: `${V2_BASE_URL_TRANSACTION}/stats-daily`,
	GET_ALL_FEES_DAILY_STATS: `${V2_BASE_URL_TRANSACTION}/all-fees-stats-daily`,

	// GET_PERIODIC_TRANSACTIONS: `${BASE_URL_TRANSACTION}/periodic`,
	// GET_USER_TRANSACTIONS: (id:any) => `${BASE_URL_TRANSACTION}/user/${id}`,
	// GET_USER_TRANSACTIONS_STATS: (id:any) => `${BASE_URL_TRANSACTION}/user-stats/${id}`,
	// // GET_WALLETS_TRANSACTIONS: `${BASE_URL_TRANSACTION}/wallets`,
	// GET_WALLETS_TRANSACTIONS_STATS: `${BASE_URL_TRANSACTION}/wallets-stats`,
	// GET_TRANSFERS_STATS: `${BASE_URL_TRANSACTION}/transfers-stats`,

	// GET_COUNTRIES_TRANSACTIONS: `${BASE_URL_TRANSACTION}/countries`,
	// GET_CATEGORY_TYPE_TRANSACTIONS: `${BASE_URL_TRANSACTION}/categorytype`,
	// GET_LAST_10_TRANSACTIONS: `${BASE_URL_TRANSACTION}/last10`,
};
/** ------------------------------------ */
export const V2_BASE_URL_CHNPAYMENT = `${API_V2_BASE_URL}/chnpayment`;
export const chnpaymentUrlsV2 = {
	GET_ALL_CHNPAYMENTS: `${V2_BASE_URL_CHNPAYMENT}`,
	GET_ONE_CHNPAYMENT: (id: any) =>
		`${V2_BASE_URL_CHNPAYMENT}/transaction/${id}`,
	UPDATE_CHNPAYMENT: (id: any) => `${V2_BASE_URL_CHNPAYMENT}/status/${id}`,
	UPDATE_CHNPAYMENT_PROOF: (id: any) =>
		`${V2_BASE_URL_CHNPAYMENT}/proof/${id}`,
};
/** ------------------------------------ */
export const V2_BASE_URL_NAIRAPAYMENT = `${API_V2_PROD_BASE_URL}/nairapayment`;
export const nairapaymentUrlsV2 = {
	GET_ALL_NAIRAPAYMENTS: `${V2_BASE_URL_NAIRAPAYMENT}`,
	GET_ONE_NAIRAPAYMENT: (id: any) => `${V2_BASE_URL_NAIRAPAYMENT}/${id}`,
	CHECK_AND_UPDATE_NAIRAPAYMENT: (id: any) =>
		`${V2_BASE_URL_NAIRAPAYMENT}/status/${id}`,
	UPDATE_NAIRAPAYMENT: (id: any) =>
		`${API_V2_BASE_URL}/nairapayment/update-status/${id}`,
	GET_TODAY_STATS: `${API_V2_BASE_URL}/nairapayment/stats-today`,
	GET_DAILY_STATS: `${API_V2_BASE_URL}/nairapayment/stats-daily`,
	GET_NAIRAPAY_MAPLERAD_BALANCE: `${V2_BASE_URL_NAIRAPAYMENT}/maplerad/balance`,
};
/** ------------------------------------ */
export const V2_BASE_URL_NOTIFICATION = `${API_V2_PROD_BASE_URL}/notifications`;
export const notificationUrlsV2 = {
	GET_NOTIFICATIONS: `${V2_BASE_URL_NOTIFICATION}`,
	GET_USER_NOTIFICATIONS: (id: any) =>
		`${API_V2_BASE_URL}/notifications/${id}`,
	SEND_NOTIFICATION: `${V2_BASE_URL_NOTIFICATION}`,
	// SEND_WHATSAPP_NOTIFICATION: `${V2_BASE_URL_NOTIFICATION}/whatsapp`,
	SEND_WHATSAPP_NOTIFICATION: `${API_V2_BASE_URL}/notifications/whatsapp`,
};
/** ------------------------------------ */
export const V2_BASE_URL_CUSTOMER_TICKET = `${API_V2_BASE_URL}/customertickets`;
export const customerTicketUrlsV2 = {
	GET_ALL_CUSTOMER_TICKETS: `${V2_BASE_URL_CUSTOMER_TICKET}`,
	GET_ONE_CUSTOMER_TICKET: (id: any) =>
		`${V2_BASE_URL_CUSTOMER_TICKET}/${id}`,
	CREATE_CUSTOMER_TICKET: `${V2_BASE_URL_CUSTOMER_TICKET}`,
	UPDATE_CUSTOMER_TICKET: (id: any) => `${V2_BASE_URL_CUSTOMER_TICKET}/${id}`,
	DELETE_CUSTOMER_TICKET: (id: any) => `${V2_BASE_URL_CUSTOMER_TICKET}/${id}`,
	// UPDATE_CUSTOMER_TICKET: (id:any) => `${V2_BASE_URL_CUSTOMER_TICKET}/status/${id}`,
	// UPDATE_CUSTOMER_TICKET_PROOF: (id:any) => `${V2_BASE_URL_CUSTOMER_TICKET}/proof/${id}`,
};

/** V1 SUPABASE ======================================================== */

export const V1_BASE_URL_CUSTOMER = `${API_V2_BASE_URL}/v1/users`;
export const customerUrlsV1 = {
	GET_CUSTOMERS: `${V1_BASE_URL_CUSTOMER}`,
	STATS_PER_COUNTRY: `${V1_BASE_URL_CUSTOMER}/stats/per-country`,
};
/** ------------------------------------ */
export const V1_BASE_URL_TRANSACTION = `${API_V2_BASE_URL}/v1/trx`;
export const transactionUrlsV1 = {
	STATS_PERIODIC: `${V1_BASE_URL_TRANSACTION}/stats/periodic`,
	STATS_PER_CATEGORY_TYPE: `${V1_BASE_URL_TRANSACTION}/stats/per-category-type`,
	STATS_DAILY_PER_CATEGORY_TYPE: `${V1_BASE_URL_TRANSACTION}/stats/daily-per-category-type`,
};

/** V1V2 SUPABASE ======================================================== */

export const V1V2_BASE_URL_CUSTOMER = `${API_V2_BASE_URL}/v1v2/users`;
export const customerUrlsV1V2 = {
	GET_CUSTOMERS: `${V1V2_BASE_URL_CUSTOMER}`,
	STATS_PER_COUNTRY: `${V1V2_BASE_URL_CUSTOMER}/stats/per-country`,
};
/** ------------------------------------ */
export const V1V2_BASE_URL_TRANSACTION = `${API_V2_BASE_URL}/v1v2/trx`;
export const transactionUrlsV1V2 = {
	STATS_PERIODIC: `${V1V2_BASE_URL_TRANSACTION}/stats/periodic`,
	STATS_PER_CATEGORY_TYPE: `${V1V2_BASE_URL_TRANSACTION}/stats/per-category-type`,
	STATS_DAILY_PER_CATEGORY_TYPE: `${V1V2_BASE_URL_TRANSACTION}/stats/daily-per-category-type`,
};

/** ======================================================== */
export const BASE_URL_USER = `${BASE_URL}/admin/users`;
export const userUrls = {
	GET_USERS: `${BASE_URL_USER}`,
	GET_KYC: `${BASE_URL_USER}/kyc`,
	GET_KYC_STATS: `${BASE_URL_USER}/kyc-stats`,
	GET_CUSTOMERS: `${BASE_URL_USER}/customers`,
	GET_CUSTOMERS_STATS: `${BASE_URL_USER}/customers-stats`,
	GET_ONE_CUSTOMER: (id: any) => `${BASE_URL_USER}/customer/${id}`,
	GET_ONE_CUSTOMER_TRANSACTIONS: (id: any) =>
		`${BASE_URL_USER}/customer-transactions/${id}`,
	GET_ONE_CUSTOMER_TRANSFERS: (id: any) =>
		`${BASE_URL_USER}/customer-transfers/${id}`,
	GET_ONE_USER: (id: any) => `${BASE_URL_USER}/${id}`,
	ACTIVATE_USER_ACCOUNT: (id: any) => `${BASE_URL_USER}/activate/${id}`,
	BLOCK_USER_ACCOUNT: (id: any) => `${BASE_URL_USER}/block/${id}`,
	UNBLOCK_USER_ACCOUNT: (id: any) => `${BASE_URL_USER}/unblock/${id}`,
	UPDATE_USER_INFOS: (id: any) => `${BASE_URL_USER}/update/${id}`,
	UPDATE_USER_PASSWORD: (id: any) => `${BASE_URL_USER}/updatePassword/${id}`,
	UPDATE_USER_PHOTO: (id: any) => `${BASE_URL_USER}/updatePhoto/${id}`,
	UPDATE_USER_SELFIE: (id: any) => `${BASE_URL_USER}/updateSelfie/${id}`,
	UPDATE_USER_PAPER_IMAGES: (id: any) =>
		`${BASE_URL_USER}/updatePaperImages/${id}`,
	UPDATE_USER_VERIFICATION_STATUS: (id: any) =>
		`${BASE_URL_USER}/updateVerificationStatus/${id}`,
};

export const BASE_URL_CARD = `${BASE_URL}/admin/cards`;
export const cardUrls = {
	GET_CARDS: `${BASE_URL_CARD}`,
	GET_CARDS_STATS: `${BASE_URL_CARD}/stats`,
	RECHARGE_CARD: (id: any) => `${BASE_URL_CARD}/fund/${id}`,
	WITHDRAW_CARD: (id: any) => `${BASE_URL_CARD}/withdraw/${id}`,
	FREEZE_CARD: (id: any) => `${BASE_URL_CARD}/freeze/${id}`,
	UNFREEZE_CARD: (id: any) => `${BASE_URL_CARD}/unfreeze/${id}`,
	GET_CARD_TRANSACTIONS: (id: any) => `${BASE_URL_CARD}/transactions/${id}`,
	GET_ONE_CARD: (id: any) => `${BASE_URL_CARD}/${id}`,
};

export const BASE_URL_TRANSACTION = `${BASE_URL}/admin/transactions`;
export const transactionUrls = {
	GET_ALL_TRANSACTIONS: `${BASE_URL_TRANSACTION}`,
	GET_PERIODIC_TRANSACTIONS: `${BASE_URL_TRANSACTION}/periodic`,
	GET_USER_TRANSACTIONS: (id: any) => `${BASE_URL_TRANSACTION}/user/${id}`,
	GET_USER_TRANSACTIONS_STATS: (id: any) =>
		`${BASE_URL_TRANSACTION}/user-stats/${id}`,
	// GET_WALLETS_TRANSACTIONS: `${BASE_URL_TRANSACTION}/wallets`,
	GET_WALLETS_TRANSACTIONS_STATS: `${BASE_URL_TRANSACTION}/wallets-stats`,
	GET_TRANSFERS_STATS: `${BASE_URL_TRANSACTION}/transfers-stats`,

	GET_COUNTRIES_TRANSACTIONS: `${BASE_URL_TRANSACTION}/countries`,
	GET_CATEGORY_TYPE_TRANSACTIONS: `${BASE_URL_TRANSACTION}/categorytype`,
	GET_LAST_10_TRANSACTIONS: `${BASE_URL_TRANSACTION}/last10`,

	HANDLE_USER_ACCOUNT_TRANSACTIONS: `${BASE_URL_TRANSACTION}/user-account-balance`,
};

export const BASE_URL_NOTIFICATION = `${API_V2_BASE_URL}/admin/notifications`;
export const notificationUrls = {
	GET_NOTIFICATIONS: `${BASE_URL_NOTIFICATION}`,
	GET_USER_NOTIFICATIONS: (id: any) => `${BASE_URL_NOTIFICATION}/${id}`,
	SEND_NOTIFICATION: `${BASE_URL_NOTIFICATION}/send`,
};

export const BASE_URL_GABON = `${API_V2_PROD_BASE_URL}/gabon`;
export const gabonUrls = {
	GET_GABON_BALANCE_AFRIBAPAY: `${BASE_URL_GABON}/check-balance/afribapay`,
	GABON_PAYOUT_AFRIBAPAY: `${BASE_URL_GABON}/payout/afribapay`,
	GET_GABON_BALANCE_INTOUCH: `${BASE_URL_GABON}/check-balance/intouch`,
	GABON_PAYOUT_INTOUCH: `${BASE_URL_GABON}/payout/intouch`,
};

export const BASE_URL_BENIN = `${API_V2_BASE_URL}/benin`;
export const beninUrls = {
	GET_BENIN_BALANCE: `${BASE_URL_BENIN}/check-balance`,
	BENIN_PAYOUT: `${BASE_URL_BENIN}/payout`,
	GET_BENIN_PAYOUT_STATUS: `${BASE_URL_BENIN}/check-payout-status`,
};

export const BASE_URL_BURKINA = `${API_V2_BASE_URL}/burkina`;
export const burkinaUrls = {
	GET_BURKINA_BALANCE: `${BASE_URL_BURKINA}/check-balance`,
	BURKINA_PAYOUT: `${BASE_URL_BURKINA}/payout`,
	GET_BURKINA_PAYOUT_STATUS: `${BASE_URL_BURKINA}/check-payout-status`,
};

export const BASE_URL_CAMEROON = `${API_V2_BASE_URL}/cameroon`;
export const BASE_URL_CAMEROON_PROD = `${API_V2_PROD_BASE_URL}/cameroon`;
export const cameroonUrls = {
	GET_CAMEROON_CAMPAY_BALANCE: `${BASE_URL_CAMEROON}/check-balance/campay`,
	GET_CAMEROON_PAWAPAY_BALANCE: `${BASE_URL_CAMEROON}/check-balance/pawapay`,
	CAMEROON_PAYOUT: `${BASE_URL_CAMEROON}/payout`,
	GET_CAMEROON_PAYOUT_STATUS: `${BASE_URL_CAMEROON}/check-payout-status`,

	GET_CAMEROON_BALANCE_AFRIBAPAY: `${BASE_URL_CAMEROON_PROD}/check-balance/afribapay`,
	CAMEROON_PAYOUT_AFRIBAPAY: `${BASE_URL_CAMEROON_PROD}/payout/afribapay`,
};

export const BASE_URL_RDC = `${API_V2_BASE_URL}/rdc`;
export const rdcUrls = {
	GET_RDC_BALANCE: `${BASE_URL_RDC}/check-balance`,
	RDC_PAYOUT: `${BASE_URL_RDC}/payout`,
	GET_RDC_PAYOUT_STATUS: `${BASE_URL_RDC}/check-payout-status`,
};

export const BASE_URL_MIDEN = `${API_V2_PROD_BASE_URL}/miden`;
export const midenUrls = {
	GET_MIDEN_BALANCE: `${BASE_URL_MIDEN}/balance`,
};

export const BASE_URL_OPERATIONS = `${API_V2_BASE_URL}/operations`;
export const operationUrls = {
	BALANCE_OPERATIONS: `${BASE_URL_OPERATIONS}`,
};

export const BASE_URL_USER_MANAGEMENT = `${BASE_URL}/users`;
export const userManagementUrls = {
	CREATE_USER: `${BASE_URL_USER_MANAGEMENT}`,
	GET_TEAM_MEMBERS: `${BASE_URL_USER_MANAGEMENT}`,
	DELETE_TEAM_MEMBER: (id: string) => `${BASE_URL_USER_MANAGEMENT}/${id}`,
	REGISTER_USER: `${BASE_URL_USER_MANAGEMENT}/register`,
	// EDIT_USER_ROLE: (id: string) => `${BASE_URL_USER_MANAGEMENT}/${id}`,
	EDIT_USER: (id: string) => `http://127.0.0.1:3001/api/v1/users/${id}`,
};

export const ADMIN_BASE_URL = `${BASE_URL}/admin`;
export const adminUrls = {
	GET_COMPANIES: `${ADMIN_BASE_URL}/get-all-companies`,
	HANDLE_KYC: `${ADMIN_BASE_URL}/handle-kyc`,
	HANDLE_KYB: `${ADMIN_BASE_URL}/handle-kyb`,
	GET_USERS: `${ADMIN_BASE_URL}/get-all-users`,
	TOGGLE_USERS_STATUS: (id: string) => `${ADMIN_BASE_URL}/toggle-user/${id}`,
	TOGGLE_COMPANY_STATUS: (id: string) =>
		`${ADMIN_BASE_URL}/toggle-company/${id}`,
	GET_ALL_CARDS: `${ADMIN_BASE_URL}/all`,
};

export const COMPANY_ADMIN_URL = `${BASE_URL}/companies-admin`;
export const companyAdminUrl = {
	GET_ADMIN_USERS_BY_COMPANY: (id: string) =>
		`${COMPANY_ADMIN_URL}/users-by-company/${id}`,

	GET_ADMIN_TRANSACTION_BY_COMPANY: (id: string) =>
		`${COMPANY_ADMIN_URL}/transactions-by-company/${id}`,

	GET_ADMIN_CUSTOMERS_BY_COMPANY: (id: string) =>
		`${COMPANY_ADMIN_URL}/customers-by-company/${id}`,
	GET_ADMIN_CARDS_BY_COMPANY: (id: string) =>
		`${COMPANY_ADMIN_URL}/cards-by-company/${id}`,
	GET_COUNTRIES: `${COMPANY_ADMIN_URL}/countries`,
	GET_WALLETS_BY_COMPANY: (companyId: string) =>
		`${COMPANY_ADMIN_URL}/get-wallets-by-company/${companyId}`,
};

// Wallets (admin can query global wallets via base wallets endpoint)
export const BASE_URL_WALLET = `${BASE_URL}/wallets`;
export const walletUrls = {
	GET_WALLETS: `${BASE_URL_WALLET}`,
	GET_ONE_WALLET: (id: string) => `${BASE_URL_WALLET}/${id}`,
	UPDATE_WALLET: (id: string) => `${BASE_URL_WALLET}/${id}`,
	DISABLE_WALLET: (id: string) => `${BASE_URL_WALLET}/${id}/disable`,
};

export const BASE_URL_CONTACT = `${BASE_URL}/contact`;
export const contactUrls = {
	SEND_MESSAGE: `${BASE_URL_CONTACT}/send`,
};
