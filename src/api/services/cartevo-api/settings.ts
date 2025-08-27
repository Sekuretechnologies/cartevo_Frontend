import BaseMethods from "../../baseMethods";
import { settingsUrls } from "../urls";
import {
	CreateExchangeRateRequest,
	UpdateExchangeRateRequest,
	CreateTransactionFeeRequest,
	UpdateTransactionFeeRequest,
} from "@/types/settings";

export class SettingsService {
	// Exchange Rates
	static get_exchange_rates = ({ token }: { token: string }) => {
		let query_params: any = {};
		return BaseMethods.getRequest(
			settingsUrls.GET_EXCHANGE_RATES,
			true,
			query_params,
			token
		);
	};

	static create_exchange_rate = ({
		token,
		data,
	}: {
		token: string;
		data: CreateExchangeRateRequest;
	}) => {
		return BaseMethods.postRequest(
			settingsUrls.CREATE_EXCHANGE_RATE,
			data,
			true,
			{},
			token
		);
	};

	static update_exchange_rate = ({
		token,
		data,
	}: {
		token: string;
		data: UpdateExchangeRateRequest;
	}) => {
		return BaseMethods.putRequest(
			settingsUrls.UPDATE_EXCHANGE_RATE(data.id),
			data,
			true,
			{}
		);
	};

	static delete_exchange_rate = ({
		token,
		id,
	}: {
		token: string;
		id: string;
	}) => {
		return BaseMethods.deleteRequest(
			settingsUrls.DELETE_EXCHANGE_RATE(id),
			{},
			true
		);
	};

	// Transaction Fees
	static get_transaction_fees = ({ token }: { token: string }) => {
		let query_params: any = {};
		return BaseMethods.getRequest(
			settingsUrls.GET_TRANSACTION_FEES,
			true,
			query_params,
			token
		);
	};

	static create_transaction_fee = ({
		token,
		data,
	}: {
		token: string;
		data: CreateTransactionFeeRequest;
	}) => {
		return BaseMethods.postRequest(
			settingsUrls.CREATE_TRANSACTION_FEE,
			data,
			true,
			{},
			token
		);
	};

	static update_transaction_fee = ({
		token,
		data,
	}: {
		token: string;
		data: UpdateTransactionFeeRequest;
	}) => {
		return BaseMethods.putRequest(
			settingsUrls.UPDATE_TRANSACTION_FEE(data.id),
			data,
			true,
			{}
		);
	};

	static delete_transaction_fee = ({
		token,
		id,
	}: {
		token: string;
		id: string;
	}) => {
		return BaseMethods.deleteRequest(
			settingsUrls.DELETE_TRANSACTION_FEE(id),
			{},
			true
		);
	};
}
