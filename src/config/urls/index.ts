export type URLType = { [key: string]: string };

// ALL APP ROUTES
export const rootUrl = "/";
export const dashboardRootUrlV1 = "/dashboard/v1";

const URLConfig = {
	root: rootUrl,
	notFound: `/not-found`,
	dashboard: dashboardRootUrlV1,

	//   Comptes utilisateurs
	home: {
		...home(),
	},

	onboarding: {
		...onboarding(),
	},

	//   Comptes utilisateurs
	users: {
		...users(),
	},
	customers: {
		...customers(),
	},
	//  wallets
	wallets: {
		...wallets(),
	},
	//   Cartes
	cards: {
		...cards(),
	},
	//   Paramètres
	transactions: {
		...transactions(),
	},
	//   Paramètres
	developers: {
		...developers(),
	},
	//   Paramètres
	settings: {
		...settings(),
	},
	//   Login
	login: "/login",

	Approvals: {
		...Approvals(),
	},
	company: {
		...Company(),
	},
	user: {
		...User(),
	},
	cardsAdmin: {
		...card(),
	},
	adminTransaction: {
		...transactionsAdmin(),
	},
	adminSettings: {
		...adminSettings(),
	},

	adminWallets: {
		...adminWallets(),
	},

	// Admin Module
	// ADMIN: {
	// ...APPURLS.admin(URL_PREFIX.ADMIN),
	// },
};

export default URLConfig;

function home(prefix: string = "") {
	const PATH = `${rootUrl}home`;
	return {
		root: PATH,
	};
}

function onboarding(prefix: string = "") {
	const PATH = `${rootUrl}onboarding`;
	return {
		root: PATH,
	};
}

function users(prefix: string = "") {
	const PATH = `${rootUrl}users`;
	return {
		root: PATH,
		manage: `${PATH}manage`,
	};
}

function customers(prefix: string = "") {
	const PATH = `${rootUrl}customers`;
	return {
		root: PATH,
		manage: `${PATH}manage`,
	};
}

function wallets(prefix: string = "") {
	const PATH = `${rootUrl}wallets`;
	return {
		root: PATH,
	};
}

function transactions(prefix: string = "") {
	const PATH = `${rootUrl}transactions`;
	return {
		root: PATH,
	};
}

function developers(prefix: string = "") {
	const PATH = `${rootUrl}developers`;
	return {
		root: PATH,
	};
}

function cards(prefix: string = "") {
	const PATH = `${rootUrl}cards`;
	return {
		root: PATH,
		// manage: `${PATH}manage`,
	};
}

function settings(prefix: string = "") {
	const PATH = `${rootUrl}settings`;
	return {
		root: PATH,
	};
}

function Approvals(prefix: string = "") {
	const PATH = `${rootUrl}approvals`;
	return {
		root: PATH,
	};
}

function Company(prefix: string = "") {
	const PATH = `${rootUrl}companies`;
	return {
		root: PATH,
	};
}

function User() {
	const PATH = `${rootUrl}users-admin`;
	return {
		root: PATH,
	};
}

function card() {
	const PATH = `${rootUrl}cards-admin`;
	return {
		root: PATH,
	};
}
function transactionsAdmin() {
	const PATH = `${rootUrl}transactions-admin`;
	return {
		root: PATH,
	};
}

function adminSettings() {
	const PATH = `${rootUrl}admin-settings`;
	return {
		root: PATH,
	};
}
function adminWallets() {
	const PATH = `${rootUrl}wallets-admin`;
	return {
		root: PATH,
	};
}
