import BaseMethods from "@/api/baseMethods";
import { adminUrls, walletUrls } from "@/api/urls";
import { string } from "zod";
// Admin base for admin-scoped wallet endpoints
import { ADMIN_BASE_URL } from "@/api/urls";

export class AdminService {
	static get_Companies = ({
		token,
		status,
	}: {
		token: string;
		status?: "pending" | "approved" | "none" | "rejected";
	}) => {
		const queryParams = status ? `?status=${status}` : "";
		const url = `${adminUrls.GET_COMPANIES}${queryParams}`;
		return BaseMethods.getRequest(url, true, {}, token);
	};

	static handle_kyb = ({
		token,
		companyId,
		value,
		message,
	}: {
		token: string;
		companyId: string;
		value: "APPROVED" | "REJECTED";
		message?: string;
	}) => {
		return BaseMethods.putRequest(
			adminUrls.HANDLE_KYB,
			{
				companyId,
				value,
				message,
			},
			false,
			{},
			token
		);
	};

	static handle_kyc = ({
		token,
		userId,
		value,
		message,
	}: {
		token: string;
		userId: string;
		value: "APPROVED" | "REJECTED";
		message: string;
	}) => {
		return BaseMethods.putRequest(
			adminUrls.HANDLE_KYC,
			{
				userId,
				value,
				message,
			},
			false,
			{},
			token
		);
	};

	static get_users = ({
		token,
		companyId,
		page = 1,
		perPage = 10,
	}: {
		token: string;
		companyId?: string;
		page?: number;
		perPage?: number;
	}) => {
		const params = new URLSearchParams();

		if (companyId) params.append("companyId", companyId);
		params.append("page", page.toString());
		params.append("perPage", perPage.toString());

		return BaseMethods.getRequest(
			`${adminUrls.GET_USERS}?${params.toString()}`,
			true,
			{},
			token
		);
	};

	static toggleUserStatus = ({
		token,
		userId,
		status,
	}: {
		token: string;
		userId: string;
		status: string;
	}) => {
		return BaseMethods.putRequest(
			`${adminUrls.TOGGLE_USERS_STATUS}/${userId}`,
			{ status },
			true,
			{},
			token
		);
	};

  // Wallets (admin scope)
  static get_Wallets = ({
    token,
    companyId,
    currency,
    country,
    countryIsoCode,
    page = 1,
    limit = 10,
    sortBy,
    order,
    q,
  }: {
    token: string;
    companyId?: string;
    currency?: string | string[];
    country?: string;
    countryIsoCode?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: "asc" | "desc";
    q?: string;
  }) => {
    const params = new URLSearchParams();
    if (companyId) params.append("company_id", companyId);
    if (countryIsoCode) params.append("country_iso_code", countryIsoCode);
    if (country) params.append("country", country);
    if (currency) {
      const value = Array.isArray(currency) ? currency.join(",") : currency;
      params.append("currency", value);
    }
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (sortBy) params.append("sort_by", sortBy);
    if (order) params.append("order", order);
    if (q) params.append("q", q);

    return BaseMethods.getRequest(
      `${walletUrls.GET_WALLETS}?${params.toString()}`,
      true,
      {},
      token
    );
  };

  static update_Wallet = ({
    token,
    walletId,
    payload,
  }: {
    token: string;
    walletId: string;
    payload: { is_active?: boolean; country_phone_code?: string; balance?: number; payin_balance?: number; payout_balance?: number };
  }) => {
    return BaseMethods.patchRequest(
      walletUrls.UPDATE_WALLET(walletId),
      payload,
      true,
      {},
      token
    );
  };

  // Admin-scoped wallet update (PATCH /admin/wallets/:id)
  static update_Wallet_Admin = ({
    token,
    walletId,
    payload,
  }: {
    token: string;
    walletId: string;
    payload: { is_active?: boolean; country_phone_code?: string; balance?: number; payin_balance?: number; payout_balance?: number };
  }) => {
    return BaseMethods.patchRequest(
      `${ADMIN_BASE_URL}/wallets/${walletId}`,
      payload,
      true,
      {},
      token
    );
  };

  static disable_Wallet = ({
    token,
    walletId,
    reason,
  }: {
    token: string;
    walletId: string;
    reason?: string;
  }) => {
    return BaseMethods.postRequest(
      walletUrls.DISABLE_WALLET(walletId),
      reason ? { reason } : {},
      true,
      {},
      token
    );
  };
}
