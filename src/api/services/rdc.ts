import BaseMethods from "../baseMethods";
import { rdcUrls } from "../urls";

export class RdcService {
	static get_rdc_balance = ({ token }: { token?: string }) => {
		let query_params: any = {};
		return BaseMethods.getRequest(
			rdcUrls.GET_RDC_BALANCE,
			true,
			query_params,
			token
		);
	};
	static handle_rdc_balance_withdrawal = ({
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
			rdcUrls.RDC_PAYOUT,
			body,
			true,
			query_params,
			token
		);
	};
	static get_rdc_payout_status = ({ trxId }: { trxId?: string }) => {
		let query_params: any = {};
		return BaseMethods.getRequest(
			rdcUrls.GET_RDC_PAYOUT_STATUS,
			true,
			query_params,
			trxId
		);
	};
}
