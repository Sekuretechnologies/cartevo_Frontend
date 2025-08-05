import * as APPURLS from "./";

export type URLType = { [key: string]: string };

// ALL APP ROUTES
export const rootUrl = "/";
export const dashboardRootUrlV2 = "/dashboard/v2";

const URLConfig = {
	root: rootUrl,
	notFound: `/not-found`,
	dashboard: dashboardRootUrlV2,

	//   Comptes utilisateurs
	dashboardHome: {
		...dashboardHome(),
	},

	//   Comptes utilisateurs
	usersAccounts: {
		...usersAccounts(),
	},
	//   Transactions wallet
	walletTransactions: {
		...walletTransactions(),
	},
	//   Transfert d'argent
	transferts: {
		...transferts(),
	},
	//   Cartes
	cards: {
		...cards(),
	},
	//   Verifications KYC
	kyc: {
		...kyc(),
	},
	//   Gains
	profit: {
		...profit(),
	},
	//   Administration
	administration: {
		...administration(),
	},
	//   Notifications
	notifications: {
		...notifications(),
	},
	//   Paramètres généraux
	generalSettings: {
		...generalSettings(),
	},
	//   Login
	login: "/login",

	payment_services: {
		...payment_services(),
	},
	//   Notifications
	customer_tickets: {
		...customer_tickets(),
	},
	//   Regularisations
	regularisations: {
		...regularisations(),
	},
	//   earnings
	earnings: {
		...earnings(),
	},

	// Admin Module
	// ADMIN: {
	// ...APPURLS.admin(URL_PREFIX.ADMIN),
	// },
};

export default URLConfig;

function dashboardHome(prefix: string = "") {
	const PATH = `${dashboardRootUrlV2}/home`;
	return {
		root: PATH,
	};
}

function usersAccounts(prefix: string = "") {
	const PATH = `${dashboardRootUrlV2}/users_accounts`;
	return {
		root: PATH,
		manage: `${PATH}/manage`,
	};
}

function walletTransactions(prefix: string = "") {
	const PATH = `${dashboardRootUrlV2}/wallet_transactions`;
	return {
		root: PATH,
	};
}

function transferts(prefix: string = "") {
	const PATH = `${dashboardRootUrlV2}/transferts`;
	return {
		root: PATH,
	};
}

function cards(prefix: string = "") {
	const PATH = `${dashboardRootUrlV2}/cards`;
	return {
		root: PATH,
		manage: `${PATH}/manage`,
	};
}

function kyc(prefix: string = "") {
	const PATH = `${dashboardRootUrlV2}/kyc`;
	return {
		root: PATH,
	};
}

function profit(prefix: string = "") {
	const PATH = `${dashboardRootUrlV2}/profit`;
	return {
		root: PATH,
	};
}

function administration(prefix: string = "") {
	const PATH = `${dashboardRootUrlV2}/administration`;
	return {
		root: PATH,
	};
}

function notifications(prefix: string = "") {
	const PATH = `${dashboardRootUrlV2}/notifications`;
	return {
		root: PATH,
	};
}

function generalSettings(prefix: string = "") {
	const PATH = `${dashboardRootUrlV2}/general_settings`;
	return {
		root: PATH,
	};
}

function payment_services(prefix: string = "") {
	const PATH = `${dashboardRootUrlV2}/payment_services`;
	return {
		root: PATH,
	};
}

function customer_tickets(prefix: string = "") {
	const PATH = `${dashboardRootUrlV2}/customer_tickets`;
	return {
		root: PATH,
	};
}

function regularisations(prefix: string = "") {
	const PATH = `${dashboardRootUrlV2}/regularisations`;
	return {
		root: PATH,
	};
}

function earnings(prefix: string = "") {
	const PATH = `${dashboardRootUrlV2}/earnings`;
	return {
		root: PATH,
	};
}
