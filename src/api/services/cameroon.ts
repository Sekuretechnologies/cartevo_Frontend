import BaseMethods from "../baseMethods";
import { cameroonUrls } from "../urls";

export class CameroonService {
	static get_cameroon_campay_balance = ({ token }: { token?: string }) => {
		let query_params: any = {};
		return BaseMethods.getRequest(
			cameroonUrls.GET_CAMEROON_CAMPAY_BALANCE,
			true,
			query_params,
			token
		);
	};

	static get_cameroon_pawapay_balance = ({ token }: { token?: string }) => {
		let query_params: any = {};
		return BaseMethods.getRequest(
			cameroonUrls.GET_CAMEROON_PAWAPAY_BALANCE,
			true,
			query_params,
			token
		);
	};

	static handle_cameroon_balance_withdrawal = ({
		userId,
		amount,
		phone,
		operator,
		token,
	}: {
		userId: string;
		amount: string;
		phone?: string;
		operator?: string;
		token?: string;
	}) => {
		let query_params: any = {};
		if (userId) query_params.userId = userId;
		if (amount) query_params.amount = amount;
		if (phone) query_params.phone = phone;
		if (operator) query_params.operator = operator;

		const body = { amount, phone, operator };

		return BaseMethods.postRequest(
			cameroonUrls.CAMEROON_PAYOUT,
			body,
			true,
			query_params,
			token
		);
	};

	static get_cameroon_payout_status = ({ trxId }: { trxId?: string }) => {
		let query_params: any = {};
		return BaseMethods.getRequest(
			cameroonUrls.GET_CAMEROON_PAYOUT_STATUS,
			true,
			query_params,
			trxId
		);
	};

	static get_cameroon_balance_afribapay = ({ token }: { token?: string }) => {
		let query_params: any = {};
		return BaseMethods.getRequest(
			cameroonUrls.GET_CAMEROON_BALANCE_AFRIBAPAY,
			true,
			query_params,
			token
		);
	};

	static cameroon_payout_afribapay = ({
		amount,
		phone,
		token,
		operator,
		userId,
	}: {
		amount: string;
		phone: string;
		token?: string;
		operator: string;
		userId: string;
	}) => {
		let query_params: any = {};
		if (amount) query_params.amount = amount;
		if (phone) query_params.phone = phone;
		if (operator) query_params.operator = operator;
		if (userId) query_params.userId = userId;

		const body = { amount, phone, operator, userId };

		return BaseMethods.postRequest(
			cameroonUrls.CAMEROON_PAYOUT_AFRIBAPAY,
			body,
			true,
			query_params,
			token
		);
	};
}
