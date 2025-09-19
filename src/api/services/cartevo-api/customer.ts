import BaseMethods from "../../baseMethods";
import { customersUrls } from "../urls";

export class CustomerService {
	static get_customers = ({ token }: { token: string }) => {
		let query_params: any = { sync: true };
		return BaseMethods.getRequest(
			customersUrls.GET_CUSTOMERS,
			true,
			query_params,
			token
		);
	};

	static get_customer = ({
		token,
		customerId,
	}: {
		token: string;
		customerId: string;
	}) => {
		let query_params: any = {};
		return BaseMethods.getRequest(
			customersUrls.GET_CUSTOMER(customerId),
			true,
			query_params,
			token
		);
	};

	static get_customer_cards = ({
		token,
		customerId,
		page = 1,
		limit = 20,
	}: {
		token: string;
		customerId: string;
		page?: number;
		limit?: number;
	}) => {
		let query_params: any = {}; // { sync: true };
		if (page) query_params.page = page;
		if (limit) query_params.limit = limit;
		return BaseMethods.getRequest(
			customersUrls.GET_CUSTOMER_CARDS(customerId),
			true,
			query_params,
			token
		);
	};

	static get_customer_transactions = ({
		token,
		customerId,
		page = 1,
		limit = 20,
	}: {
		token: string;
		customerId: string;
		page?: number;
		limit?: number;
	}) => {
		let query_params: any = {};
		if (page) query_params.page = page;
		if (limit) query_params.limit = limit;
		return BaseMethods.getRequest(
			customersUrls.GET_CUSTOMER_TRANSACTIONS(customerId),
			true,
			query_params,
			token
		);
	};

	static create_customer = ({
		token,
		data,
	}: {
		token: string;
		data: any;
	}) => {
		let query_params: any = { enroll: true };
		return BaseMethods.postFileRequest(
			customersUrls.CREATE_CUSTOMER,
			data,
			true,
			query_params,
			token
		);
	};

	static update_customer = ({
		token,
		data,
	}: {
		token: string;
		data: any;
	}) => {
		return BaseMethods.postFileRequest(
			customersUrls.UPDATE_CUSTOMER,
			data,
			true,
			{},
			token
		);
	};
}
