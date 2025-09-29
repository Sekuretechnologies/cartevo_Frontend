import BaseMethods from "@/api/baseMethods";
import { adminUrls, companyAdminUrl } from "@/api/urls";
import { string } from "zod";

export class AdminService {
	static get_Companies = ({
		token,
		status,
		filters,
	}: {
		token: string;
		status?: "pending" | "approved" | "none" | "rejected";
		filters?: any;
	}) => {
		const params = new URLSearchParams();

		if (status) params.append("status", status);

		// Ajouter les filtres
		if (filters) {
			if (filters.country) params.append("country", filters.country);
			if (filters.business_type)
				params.append("business_type", filters.business_type);
			if (filters.is_active !== undefined)
				params.append("is_active", filters.is_active.toString());
		}

		const url = `${adminUrls.GET_COMPANIES}?${params.toString()}`;

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

	static getUsersByCompany = ({
		token,
		companyId,
	}: {
		token: string;
		companyId: string;
	}) => {
		return BaseMethods.getRequest(
			companyAdminUrl.GET_ADMIN_USERS_BY_COMPANY(companyId),
			true,
			{},
			token
		);
	};

	static getTransactionsByCompany = ({
		token,
		companyId,
	}: {
		token: string;
		companyId: string;
	}) => {
		return BaseMethods.getRequest(
			companyAdminUrl.GET_ADMIN_TRANSACTION_BY_COMPANY(companyId),
			true,
			{},
			token
		);
	};

	static getCustomersByCompany = ({
		token,
		companyId,
	}: {
		token: string;
		companyId: string;
	}) => {
		return BaseMethods.getRequest(
			companyAdminUrl.GET_ADMIN_CUSTOMERS_BY_COMPANY(companyId),
			true,
			{},
			token
		);
	};

	static getCardByCompany = ({
		token,
		companyId,
	}: {
		token: string;
		companyId: string;
	}) => {
		return BaseMethods.getRequest(
			companyAdminUrl.GET_ADMIN_CARDS_BY_COMPANY(companyId),
			true,
			{},
			token
		);
	};

	static toggleCompanyStatus = ({
		token,
		companyId,
		isActive,
	}: {
		token: string;
		companyId: string;
		isActive: boolean;
	}) => {
		return BaseMethods.putRequest(
			adminUrls.TOGGLE_COMPANY_STATUS(companyId),
			{ isActive },
			true,
			{},
			token
		);
	};

	static getCountries = ({ token }: { token: string }) => {
		return BaseMethods.getRequest(
			companyAdminUrl.GET_COUNTRIES,
			true,
			{},
			token
		);
	};
}
