import BaseMethods from "../../baseMethods";
import { cardsUrls } from "../urls";

export class CardService {
	// Get all cards for the company (NestJS endpoint: GET /cards)
	static get_cards = ({
		token,
		page,
		limit,
		status,
	}: {
		token: string;
		page?: number;
		limit?: number;
		status?: string;
	}) => {
		let query_params: any = {};
		if (page) query_params.page = page;
		if (limit) query_params.limit = limit;
		if (status) query_params.status = status;
		return BaseMethods.getRequest(
			cardsUrls.GET_CARDS,
			true,
			query_params,
			token
		);
	};

	// Create a new card (NestJS endpoint: POST /cards)
	static create_card = ({ token, data }: { token: string; data: any }) => {
		return BaseMethods.postRequest(
			cardsUrls.CREATE_CARD,
			data,
			true,
			{},
			token
		);
	};

	// Get single card details (NestJS endpoint: GET /cards/:cardId)
	static get_card = ({
		token,
		cardId,
		reveal,
	}: {
		token: string;
		cardId: string;
		reveal?: boolean;
	}) => {
		let query_params: any = {};
		if (reveal) query_params.reveal = reveal;
		return BaseMethods.getRequest(
			cardsUrls.GET_ONE_CARD(cardId),
			true,
			query_params,
			token
		);
	};

	// Get card balance (NestJS endpoint: GET /cards/:cardId/balance)
	static get_card_balance = ({
		token,
		cardId,
	}: {
		token: string;
		cardId: string;
	}) => {
		return BaseMethods.getRequest(
			cardsUrls.GET_CARD_BALANCE(cardId),
			true,
			{},
			token
		);
	};

	// Get card transactions (NestJS endpoint: GET /cards/:cardId/transactions)
	static get_card_transactions = ({
		token,
		cardId,
		page,
		limit,
	}: {
		token: string;
		cardId: string;
		page?: number;
		limit?: number;
	}) => {
		let query_params: any = {};
		if (page) query_params.page = page;
		if (limit) query_params.limit = limit;
		return BaseMethods.getRequest(
			cardsUrls.GET_CARD_TRANSACTIONS(cardId),
			true,
			query_params,
			token
		);
	};

	// Fund a card (NestJS endpoint: POST /cards/:cardId/fund)
	static fund_card = ({
		token,
		cardId,
		data,
	}: {
		token: string;
		cardId: string;
		data: any;
	}) => {
		return BaseMethods.postRequest(
			cardsUrls.FUND_CARD(cardId),
			data,
			true,
			{},
			token
		);
	};

	// Withdraw from card (NestJS endpoint: POST /cards/:cardId/withdraw)
	static withdraw_card = ({
		token,
		cardId,
		data,
	}: {
		token: string;
		cardId: string;
		data: any;
	}) => {
		return BaseMethods.postRequest(
			cardsUrls.WITHDRAW_CARD(cardId),
			data,
			true,
			{},
			token
		);
	};

	// Freeze card (NestJS endpoint: PUT /cards/:cardId/freeze)
	static freeze_card = ({
		token,
		cardId,
	}: {
		token: string;
		cardId: string;
	}) => {
		return BaseMethods.putRequest(
			cardsUrls.FREEZE_CARD(cardId),
			{},
			true,
			{},
			token
		);
	};

	// Unfreeze card (NestJS endpoint: PUT /cards/:cardId/unfreeze)
	static unfreeze_card = ({
		token,
		cardId,
	}: {
		token: string;
		cardId: string;
	}) => {
		return BaseMethods.putRequest(
			cardsUrls.UNFREEZE_CARD(cardId),
			{},
			true,
			{},
			token
		);
	};

	// Terminate card (NestJS endpoint: DELETE /cards/:cardId)
	static terminate_card = ({
		token,
		cardId,
	}: {
		token: string;
		cardId: string;
	}) => {
		return BaseMethods.deleteRequest(
			cardsUrls.TERMINATE_CARD(cardId),
			{},
			true,
			token
		);
	};

	// Legacy method for backward compatibility
	static update_card = ({ token, data }: { token: string; data: any }) => {
		return BaseMethods.postFileRequest(
			cardsUrls.UPDATE_CARD,
			data,
			true,
			{},
			token
		);
	};
}
