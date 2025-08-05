import * as APPURLS from "./";

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
		manage: `${PATH}manage`,
	};
}

function settings(prefix: string = "") {
	const PATH = `${rootUrl}settings`;
	return {
		root: PATH,
	};
}
