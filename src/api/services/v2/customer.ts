import { isObject } from "@/utils/utils";
import BaseMethods from "../../baseMethods";
import { customerUrlsV2 } from "../../urls";

export class CustomerService {
	static get_all_customers = (params: any) => {
		let query_params: any = {};
		if (isObject(params)) {
			Object.entries(params).map(([key, value]: any[]) => {
				if (value) query_params[key] = value;
			});
		}
		return BaseMethods.getRequest(
			customerUrlsV2.GET_CUSTOMERS,
			true,
			query_params
		);
	};
	static get_customers_stats = (params: any) => {
		let query_params: any = {};
		if (isObject(params)) {
			Object.entries(params).map(([key, value]: any[]) => {
				if (value) query_params[key] = value;
			});
		}
		return BaseMethods.getRequest(
			customerUrlsV2.GET_CUSTOMERS_STATS,
			true,
			query_params
		);
	};
	static generate_customers_excel = (params: any) => {
		let query_params: any = {};
		if (isObject(params)) {
			Object.entries(params).map(([key, value]: any[]) => {
				if (value) query_params[key] = value;
			});
		}
		return BaseMethods.postRequest(
			customerUrlsV2.GENERATE_CUSTOMERS_EXCEL,
			{},
			true,
			query_params
		);
	};
	// static get_customers_excel = () => {
	//     return BaseMethods.getRequest(customerUrlsV2.GENERATE_CUSTOMERS_EXCEL, true);
	// }
	static get_kyc_customers = (params: any) => {
		// {kyc_result, kyc_status, searchTerm}: {kyc_result?:string, kyc_status?:string, searchTerm?:string}
		let query_params: any = {};
		// if(kyc_result) query_params.kyc_result =kyc_result;
		// if(kyc_status) query_params.kyc_status =kyc_status;
		// if(searchTerm) query_params.searchTerm =searchTerm;
		if (isObject(params)) {
			Object.entries(params).map(([key, value]: any[]) => {
				if (value) query_params[key] = value;
			});
		}
		return BaseMethods.getRequest(
			customerUrlsV2.GET_KYC_CUSTOMERS,
			true,
			query_params
		);
	};
	static get_kyc_stats = () => {
		return BaseMethods.getRequest(customerUrlsV2.GET_KYC_STATS, true);
	};
	static get_regularisations = (params: any) => {
		let query_params: any = {};
		if (isObject(params)) {
			Object.entries(params).map(([key, value]: any[]) => {
				if (value) query_params[key] = value;
			});
		}
		return BaseMethods.getRequest(
			customerUrlsV2.GET_REGULARISATIONS,
			true,
			query_params
		);
	};
	static get_regularisation_stats = () => {
		return BaseMethods.getRequest(
			customerUrlsV2.GET_REGULARISATION_STATS,
			true
		);
	};
	static get_one_customer = (id: string) => {
		return BaseMethods.getRequest(
			customerUrlsV2.GET_ONE_CUSTOMER(id),
			true
		);
	};
	static update_one_customer = ({
		userId,
		customerId,
		body,
	}: {
		userId: string;
		customerId: string;
		body: any;
	}) => {
		let query_params: any = {};
		if (userId) query_params.adminUserId = userId;
		return BaseMethods.putRequest(
			customerUrlsV2.UPDATE_ONE_CUSTOMER(customerId),
			body,
			true,
			query_params
		);
	};
	static update_one_customer_infos = ({
		userId,
		customerId,
		body,
	}: {
		userId: string;
		customerId: string;
		body: any;
	}) => {
		let query_params: any = {};
		if (userId) query_params.adminUserId = userId;
		return BaseMethods.putRequest(
			customerUrlsV2.UPDATE_ONE_CUSTOMER_INFOS(customerId),
			body,
			true,
			query_params
		);
	};
	static update_one_customer_reg_status = ({
		userId,
		customerId,
		body,
	}: {
		userId: string;
		customerId: string;
		body: any;
	}) => {
		let query_params: any = {};
		if (userId) query_params.adminUserId = userId;
		return BaseMethods.putRequest(
			customerUrlsV2.UPDATE_ONE_CUSTOMER_REG_STATUS(customerId),
			body,
			true,
			query_params
		);
	};
	static update_one_customer_password = ({
		userId,
		customerId,
		body,
	}: {
		userId: string;
		customerId: string;
		body: any;
	}) => {
		let query_params: any = {};
		if (userId) query_params.adminUserId = userId;
		return BaseMethods.putRequest(
			customerUrlsV2.UPDATE_ONE_CUSTOMER_PASSWORD(customerId),
			body,
			true,
			query_params
		);
	};
	static get_one_customer_transactions = (id: string) => {
		return BaseMethods.getRequest(
			customerUrlsV2.GET_ONE_CUSTOMER_TRANSACTIONS(id),
			true
		);
	};
	static get_one_customer_transfers = (id: string) => {
		return BaseMethods.getRequest(
			customerUrlsV2.GET_ONE_CUSTOMER_TRANSFERS(id),
			true
		);
	};
	static get_stats_countries = ({
		startDate,
		limitDate,
	}: {
		startDate?: string;
		limitDate?: string;
	}) => {
		let query_params: any = {};
		if (startDate) query_params.startDate = startDate;
		if (limitDate) query_params.limitDate = limitDate;
		return BaseMethods.getRequest(
			customerUrlsV2.STATS_PER_COUNTRY,
			true,
			query_params
		);
	};
	// static get_stats_countries = () =>
	//     BaseMethods.getRequest(customerUrlsV2.STATS_PER_COUNTRY, true);

	static handle_release_standby_balance = ({
		adminUserId,
		body,
	}: {
		adminUserId?: string;
		body: any;
	}) => {
		let query_params: any = {};
		if (adminUserId) query_params.adminUserId = adminUserId;
		return BaseMethods.patchRequest(
			customerUrlsV2.RELEASE_ONE_USER_BALANCE,
			body,
			true,
			query_params
		);
	};
}
