import BaseMethods from "../baseMethods";
import { operationUrls } from "../urls";

export class OperationService {
	static get_balance_operations = ({
		provider,
		country,
		category,
		type,
	}: {
		provider: string;
		country: string;
		category: string;
		type: string;
	}) => {
		let query_params: any = {};
		if (provider) query_params.provider = provider;
		if (country) query_params.country = country;
		if (category) query_params.category = category;
		if (type) query_params.type = type;

		return BaseMethods.getRequest(
			operationUrls.BALANCE_OPERATIONS,
			true,
			query_params
		);
	};
	static add_balance_operations = ({
		date,
		time,
		action,
		amount,
		remaining_balance,
		provider,
		country,
	}: {
		date: string;
		time: string;
		action: string;
		amount: string;
		remaining_balance: string;
		provider: string;
		country: string;
	}) => {
		let query_params: any = {};

		const body = {
			date,
			time,
			action,
			amount,
			remaining_balance,
			provider,
			country,
		};

		return BaseMethods.postRequest(
			operationUrls.BALANCE_OPERATIONS,
			body,
			true,
			query_params
		);
	};
}
