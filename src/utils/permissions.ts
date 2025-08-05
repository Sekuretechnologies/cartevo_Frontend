// export type Role = keyof typeof ROLES
// type Permission = (typeof ROLES)[Role][number];
interface IUser {
	id: string;
	role: string;
	admin_role: string;
}

export function hasPermission(
	user: IUser,
	element: string,
	permission: string
) {
	let newarr: string[] = element.split(":");
	let hasPermision: boolean;

	if (user?.role !== "admin" || !user?.admin_role) {
		return false;
	}

	switch (newarr.length) {
		case 1:
			hasPermision =
				permissions?.[user?.admin_role]?.[newarr[0]]?.root?.includes(
					permission
				);
			break;
		case 2:
			hasPermision =
				permissions?.[user?.admin_role]?.[newarr[0]]?.[
					newarr[1]
				]?.root?.includes(permission);
			break;
		case 3:
			hasPermision =
				permissions?.[user?.admin_role]?.[newarr[0]]?.[newarr[1]]?.[
					newarr[2]
				]?.root?.includes(permission);
			break;
		default:
			hasPermision = false;
	}

	return hasPermision;
}

export const permissions: any = {
	owner: {
		home: { root: ["view"] },
		retrait_gb: { root: ["view", "withdraw"] },
		user_accounts: { root: ["view", "details"] },
		user_account_details: {
			root: ["view"],
			details: {
				root: [
					"view",
					"topup",
					"withdraw",
					"edit",
					"edit_kyc",
					"edit_infos",
				],
			},
			cards: { root: ["view", "details", "topup", "withdraw", "edit"] },
			transactions: { root: ["view", "details"] },
			transfers: { root: ["view", "details"] },
		},
		kyc: { root: ["view", "details"] },
		transactions: { root: ["view", "details"] },
		cards: { root: ["view", "details"] },
		card_details: { root: ["view", "topup", "withdraw", "edit"] },
		wallet_transactions: { root: ["view", "details"] },
		transfers: { root: ["view", "details"] },
		profit: { root: ["view", "details"] },
		administration: { root: ["view", "details"] },
		notifications: { root: ["view", "details"] },
		earnings: { root: ["view", "details"] },
		general_settings: { root: ["view", "details"] },
		kyc_v2: { root: ["view", "details"] },
		payment_services: { root: ["view", "details"] },
	},
	manager: {
		home: { root: ["view"] },
		user_accounts: { root: ["view", "details"] },
		user_account_details: {
			root: ["view"],
			details: {
				root: [
					"view",
					"topup",
					"withdraw",
					"edit",
					"edit_kyc",
					"edit_infos",
				],
			},
			cards: { root: ["view", "details", "topup", "withdraw", "edit"] },
			transactions: { root: ["view", "details"] },
			transfers: { root: ["view", "details"] },
		},
		kyc: { root: ["view", "details"] },
		transactions: { root: ["view", "details"] },
		cards: { root: ["view", "details"] },
		card_details: { root: ["view", "topup", "withdraw", "edit"] },
		wallet_transactions: { root: ["view", "details"] },
		transfers: { root: ["view", "details"] },
		profit: { root: ["view", "details"] },
		administration: { root: ["view", "details"] },
		notifications: { root: ["view", "details"] },
		earnings: { root: ["view", "details"] },
		general_settings: { root: ["view", "details"] },
		kyc_v2: { root: ["view", "details"] },
		payment_services: { root: ["view", "details"] },
	},
	"manager-guest": {
		home: { root: ["view"] },
		user_accounts: { root: ["view", "details"] },
		user_account_details: {
			root: ["view"],
			details: {
				root: ["view"],
			},
			cards: { root: ["view", "details"] },
			transactions: { root: ["view", "details"] },
			transfers: { root: ["view", "details"] },
		},
		kyc: { root: ["view", "details"] },
		transactions: { root: ["view", "details"] },
		cards: { root: ["view", "details"] },
		card_details: { root: ["view"] },
		wallet_transactions: { root: ["view", "details"] },
		transfers: { root: ["view", "details"] },
		profit: { root: ["view", "details"] },
		administration: { root: ["view", "details"] },
		notifications: { root: ["view", "details"] },
		earnings: { root: ["view", "details"] },
		general_settings: { root: ["view", "details"] },
		kyc_v2: { root: ["view", "details"] },
		payment_services: { root: ["view", "details"] },
	},
	"customer-support-chief": {
		user_accounts: { root: ["view", "details"] },
		user_account_details: {
			root: ["view"],
			details: {
				root: ["view", "edit", "edit_kyc", "edit_infos"],
			},
			cards: { root: ["view", "details"] },
			transactions: { root: ["view", "details"] },
			transfers: { root: ["view", "details"] },
		},
		kyc_v2: { root: ["view", "details"] },
		notifications: { root: ["view", "details"] },
	},
	"customer-support": {
		user_accounts: { root: ["view", "details"] },
		user_account_details: {
			root: ["view"],
			details: {
				root: ["view", "edit_kyc", "edit_infos"],
			},
			cards: { root: ["view", "details"] },
			transactions: { root: ["view", "details"] },
			transfers: { root: ["view", "details"] },
		},
		kyc_v2: { root: ["view", "details"] },
		notifications: { root: ["view", "details"] },
	},
	guest: {
		homev1v2: { root: ["view"] },
	},
};
