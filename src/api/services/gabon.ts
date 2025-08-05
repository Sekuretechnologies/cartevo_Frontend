import BaseMethods from "../baseMethods";
import { gabonUrls } from "../urls";

export class GabonService {
	static get_gabon_balance_intouch = ({ token }: { token?: string }) => {
		let query_params: any = {};
		return BaseMethods.getRequest(
			gabonUrls.GET_GABON_BALANCE_INTOUCH,
			true,
			query_params,
			token
		);
	};
	static gabon_payout_intouch = ({
		amount,
		phone,
		token,
		userId,
	}: {
		amount: string;
		phone?: string;
		token?: string;
		userId: string;
	}) => {
		let query_params: any = {};
		if (amount) query_params.amount = amount;
		if (phone) query_params.phone = phone;
		if (userId) query_params.userId = userId;

		const body = { amount, phone, userId };

		return BaseMethods.postRequest(
			gabonUrls.GABON_PAYOUT_INTOUCH,
			body,
			true,
			query_params,
			token
		);
	};

	static get_gabon_balance_afribapay = ({ token }: { token?: string }) => {
		let query_params: any = {};
		return BaseMethods.getRequest(
			gabonUrls.GET_GABON_BALANCE_AFRIBAPAY,
			true,
			query_params,
			token
		);
	};
	static gabon_payout_afribapay = ({
		amount,
		phone,
		token,
		userId,
	}: {
		amount: string;
		phone?: string;
		token?: string;
		userId: string;
	}) => {
		let query_params: any = {};
		if (amount) query_params.amount = amount;
		if (phone) query_params.phone = phone;
		if (userId) query_params.userId = userId;

		const body = { amount, phone, userId };

		return BaseMethods.postRequest(
			gabonUrls.GABON_PAYOUT_AFRIBAPAY,
			body,
			true,
			query_params,
			token
		);
	};
}
