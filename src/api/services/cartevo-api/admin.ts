import BaseMethods from "@/api/baseMethods";
import { adminUrls } from "@/api/urls";
import { string } from "zod";

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
}
