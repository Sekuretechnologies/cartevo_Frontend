import BaseMethods from "../../baseMethods";
import { nairapaymentUrlsV2 } from "../../urls";

export class NairapayService {
	static get_all_trxs = ({
		status,
		searchTerm,
	}: {
		status?: string;
		searchTerm?: string;
	}) => {
		let query_params: any = {};
		if (status) query_params.status = status;
		if (searchTerm) query_params.searchTerm = searchTerm;
		return BaseMethods.getRequest(
			nairapaymentUrlsV2.GET_ALL_NAIRAPAYMENTS,
			true,
			query_params
		);
	};
	static get_one_trx = (id: string) => {
		return BaseMethods.getRequest(
			nairapaymentUrlsV2.GET_ONE_NAIRAPAYMENT(id),
			true
		);
	};
	static check_and_update_nairapayment = ({
		userId,
		transactionId,
		body,
	}: {
		userId: string;
		transactionId: string;
		body: any;
	}) => {
		let query_params: any = {};
		if (userId) query_params.adminUserId = userId;
		return BaseMethods.putRequest(
			nairapaymentUrlsV2.CHECK_AND_UPDATE_NAIRAPAYMENT(transactionId),
			body,
			true,
			query_params
		);
	};
	static update_nairapayment = ({
		userId,
		transactionId,
		mode,
		body,
	}: {
		userId: string;
		transactionId: string;
		mode: string;
		body: any;
	}) => {
		let query_params: any = {};
		if (userId) query_params.adminUserId = userId;
		if (mode === "UPDATE") {
			return BaseMethods.putRequest(
				nairapaymentUrlsV2.UPDATE_NAIRAPAYMENT(transactionId),
				body,
				true,
				query_params
			);
		} else {
			return BaseMethods.putRequest(
				nairapaymentUrlsV2.CHECK_AND_UPDATE_NAIRAPAYMENT(transactionId),
				body,
				true,
				query_params
			);
		}
	};
	static get_nairapay_maplerad_balance = () => {
		return BaseMethods.getRequest(
			nairapaymentUrlsV2.GET_NAIRAPAY_MAPLERAD_BALANCE,
			true
		);
	};
	static get_today_stats = ({ limitDate }: { limitDate?: string }) => {
		let query_params: any = {};
		if (limitDate) query_params.limitDate = limitDate;
		return BaseMethods.getRequest(
			nairapaymentUrlsV2.GET_TODAY_STATS,
			true,
			query_params
		);
	};
	static get_daily_stats = ({ limitDate }: { limitDate?: string }) => {
		let query_params: any = {};
		if (limitDate) query_params.limitDate = limitDate;
		return BaseMethods.getRequest(
			nairapaymentUrlsV2.GET_DAILY_STATS,
			true,
			query_params
		);
	};
}
