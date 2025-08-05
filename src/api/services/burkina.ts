import BaseMethods from "../baseMethods";
import { burkinaUrls } from "../urls";

export class BurkinaService {
	static get_burkina_balance = ({ token }: { token?: string }) => {
		let query_params: any = {};
		return BaseMethods.getRequest(
			burkinaUrls.GET_BURKINA_BALANCE,
			true,
			query_params,
			token
		);
	};
	static handle_burkina_balance_withdrawal = ({
		userId,
		amount,
		phone,
		token,
	}: {
		userId: string;
		amount: string;
		phone?: string;
		token?: string;
	}) => {
		let query_params: any = {};
		if (userId) query_params.userId = userId;
		if (amount) query_params.amount = amount;
		if (phone) query_params.phone = phone;

		const body = { amount, phone };

		return BaseMethods.postRequest(
			burkinaUrls.BURKINA_PAYOUT,
			body,
			true,
			query_params,
			token
		);
	};
	static get_burkina_payout_status = ({ trxId }: { trxId?: string }) => {
		let query_params: any = {};
		return BaseMethods.getRequest(
			burkinaUrls.GET_BURKINA_PAYOUT_STATUS,
			true,
			query_params,
			trxId
		);
	};
}
