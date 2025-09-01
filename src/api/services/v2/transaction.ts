import BaseMethods from "../../baseMethods";
import { transactionUrlsV2 } from "../../urls";

export class TransactionService {
	static manage_user_account_transactions = ({
		userId,
		customerId,
		label,
		body,
		limitDate,
	}: {
		userId: string;
		customerId: string;
		label: string;
		body: any;
		limitDate?: string;
	}) => {
		let query_params: any = {};
		if (label) query_params.label = label;
		if (userId) query_params.adminUserId = userId;
		if (customerId) query_params.customerId = customerId;
		if (limitDate) query_params.limitDate = limitDate;

		if (body.momo && body.type === "withdrawal") {
			query_params.momo = body.momo;

			console.log("manage_user_account_transactions : ", {
				userId,
				customerId,
				label,
				body,
				limitDate,
				query_params,
			});
			return BaseMethods.postRequest(
				"", // transactionUrlsV2.DO_USER_TRANSACTION,
				body,
				true,
				query_params
			);
		} else {
			return BaseMethods.postRequest(
				transactionUrlsV2.MANAGE_USER_ACCOUNT_TRANSACTIONS,
				body,
				true,
				query_params
			);
		}
	};
	static get_stats_periodic = ({
		period,
		startDate,
		limitDate,
		separateDecline,
	}: {
		period?: string;
		startDate?: string;
		limitDate?: string;
		separateDecline?: boolean;
	}) => {
		let query_params: any = {};
		if (period) query_params.period = period;
		if (startDate) query_params.startDate = startDate;
		if (limitDate) query_params.limitDate = limitDate;
		if (separateDecline) query_params.separateDecline = "true";
		return BaseMethods.getRequest(
			transactionUrlsV2.STATS_PERIODIC,
			true,
			query_params
		);
	};
	static get_stats_countries = ({ limitDate }: { limitDate?: string }) => {
		let query_params: any = {};
		if (limitDate) query_params.limitDate = limitDate;
		return BaseMethods.getRequest(
			transactionUrlsV2.STATS_PER_COUNTRY,
			true,
			query_params
		);
	};

	static get_stats_category_type = ({
		limitDate,
	}: {
		limitDate?: string;
	}) => {
		let query_params: any = {};
		if (limitDate) query_params.limitDate = limitDate;
		return BaseMethods.getRequest(
			transactionUrlsV2.STATS_PER_CATEGORY_TYPE,
			true,
			query_params
		);
	};
	static get_stats_daily_category_type = ({
		limitDate,
	}: {
		limitDate?: string;
	}) => {
		let query_params: any = {};
		if (limitDate) query_params.limitDate = limitDate;
		return BaseMethods.getRequest(
			transactionUrlsV2.STATS_DAILY_PER_CATEGORY_TYPE,
			true,
			query_params
		);
	};
	static verify_trx_status = ({ trxId }: { trxId: string }) => {
		let query_params: any = {};
		return BaseMethods.putRequest(
			transactionUrlsV2.VERIFY_TRX_STATUS(trxId),
			{},
			true,
			query_params
		);
	};
	static check_partner_trx = ({ trxId }: { trxId: string }) => {
		let query_params: any = {};
		return BaseMethods.getRequest(
			transactionUrlsV2.CHECK_PARTNER_TRX(trxId),
			true,
			query_params
		);
	};
	static get_all_trxs = ({
		category,
		type,
		status,
		searchTerm,
		includedCategories,
		includedTypes,
	}: {
		category?: string;
		type?: string;
		status?: string;
		searchTerm?: string;
		includedCategories?: string;
		includedTypes?: string;
	}) => {
		let query_params: any = {};
		if (category) query_params.category = category;
		if (type) query_params.type = type;
		if (status) query_params.status = status;
		if (searchTerm) query_params.searchTerm = searchTerm;
		if (includedCategories)
			query_params.includedCategories = includedCategories;
		if (includedTypes) query_params.includedTypes = includedTypes;
		return BaseMethods.getRequest(
			transactionUrlsV2.GET_ALL_TRANSACTIONS,
			false,
			query_params
		);
	};
	static get_today_stats = ({
		category,
		type,
		limitDate,
		includedCategories,
		includedTypes,
		columnToSum,
	}: {
		category?: string;
		type?: string;
		limitDate?: string;
		includedCategories?: string;
		includedTypes?: string;
		columnToSum?: string;
	}) => {
		let query_params: any = {};
		if (category) query_params.category = category;
		if (type) query_params.type = type;
		if (limitDate) query_params.limitDate = limitDate;
		if (includedCategories)
			query_params.includedCategories = includedCategories;
		if (includedTypes) query_params.includedTypes = includedTypes;
		if (columnToSum) query_params.columnToSum = columnToSum;
		return BaseMethods.getRequest(
			transactionUrlsV2.GET_TODAY_STATS,
			true,
			query_params
		);
	};
	static get_daily_stats = ({
		category,
		type,
		limitDate,
		includedCategories,
		includedTypes,
		columnToSum,
	}: {
		category?: string;
		type?: string;
		limitDate?: string;
		includedCategories?: string;
		includedTypes?: string;
		columnToSum?: string;
	}) => {
		let query_params: any = {};
		if (category) query_params.category = category;
		if (type) query_params.type = type;
		if (limitDate) query_params.limitDate = limitDate;
		if (includedCategories)
			query_params.includedCategories = includedCategories;
		if (includedTypes) query_params.includedTypes = includedTypes;
		if (columnToSum) query_params.columnToSum = columnToSum;
		return BaseMethods.getRequest(
			transactionUrlsV2.GET_DAILY_STATS,
			true,
			query_params
		);
	};
	static get_all_fees_daily_stats = ({
		category,
		type,
		limitDate,
		includedCategories,
		includedTypes,
		columnToSum,
	}: {
		category?: string;
		type?: string;
		limitDate?: string;
		includedCategories?: string;
		includedTypes?: string;
		columnToSum?: string;
	}) => {
		let query_params: any = {};
		if (category) query_params.category = category;
		if (type) query_params.type = type;
		if (limitDate) query_params.limitDate = limitDate;
		if (includedCategories)
			query_params.includedCategories = includedCategories;
		if (includedTypes) query_params.includedTypes = includedTypes;
		if (columnToSum) query_params.columnToSum = columnToSum;
		return BaseMethods.getRequest(
			transactionUrlsV2.GET_ALL_FEES_DAILY_STATS,
			true,
			query_params
		);
	};
}
