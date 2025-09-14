import BaseMethods from "../baseMethods";
import { cardUrls } from "../urls";

export class CardService {
	static get_all_cards = ({
		filter,
		searchTerm,
	}: {
		filter?: string;
		searchTerm?: string;
	}) => {
		let query_params: any = {};
		if (filter) query_params.filter = filter;
		if (searchTerm) query_params.searchTerm = searchTerm;
		return BaseMethods.getRequest(cardUrls.GET_CARDS, true, query_params);
	};
	static get_cards_stats = () => {
		let query_params: any = {};
		return BaseMethods.getRequest(
			cardUrls.GET_CARDS_STATS,
			true,
			query_params
		);
	};

	static get_card_transactions = ({
		cardId,
		userId,
		category,
		type,
		searchTerm,
	}: {
		cardId: string;
		userId: string;
		category?: string;
		type?: string;
		searchTerm?: string;
	}) => {
		let query_params: any = {};
		if (userId) query_params.userId = userId;
		if (cardId) query_params.cardId = cardId;
		if (searchTerm) query_params.searchTerm = searchTerm;
		if (category) query_params.category = category;
		if (type) query_params.type = type;
		return BaseMethods.getRequest(
			cardUrls.GET_CARD_TRANSACTIONS(cardId),
			true,
			query_params
		);
	};

	static recharge_card = ({
		cardId,
		customerId,
		adminUserId,
		body,
	}: {
		cardId: string;
		customerId: string;
		adminUserId: string;
		body: any;
	}) => {
		let query_params: any = {};
		if (customerId) query_params.customerId = customerId;
		if (adminUserId) query_params.adminUserId = adminUserId;
		return BaseMethods.postRequest(
			cardUrls.RECHARGE_CARD(cardId),
			body,
			true,
			query_params
		);
	};

	static withdraw_card = ({
		cardId,
		customerId,
		adminUserId,
		body,
	}: {
		cardId: string;
		customerId: string;
		adminUserId: string;
		body: any;
	}) => {
		let query_params: any = {};
		// if(userId) query_params.userId =userId;
		if (customerId) query_params.customerId = customerId;
		if (adminUserId) query_params.adminUserId = adminUserId;
		return BaseMethods.postRequest(
			cardUrls.WITHDRAW_CARD(cardId),
			body,
			true,
			query_params
		);
	};

	static freeze_card = ({
		cardId,
		userId,
		body,
	}: {
		cardId: string;
		userId: string;
		body: any;
	}) => {
		let query_params: any = {};
		if (userId) query_params.userId = userId;
		return BaseMethods.patchRequest(
			cardUrls.FREEZE_CARD(cardId),
			body,
			true,
			query_params
		);
	};

	static unfreeze_card = ({
		cardId,
		userId,
		body,
	}: {
		cardId: string;
		userId: string;
		body: any;
	}) => {
		let query_params: any = {};
		if (userId) query_params.userId = userId;
		return BaseMethods.patchRequest(
			cardUrls.UNFREEZE_CARD(cardId),
			body,
			true,
			query_params
		);
	};

	static get_one_card = (id: string) => {
		return BaseMethods.getRequest(cardUrls.GET_ONE_CARD(id), true);
	};
	static get_one_card_transactions = (id: string) => {
		return BaseMethods.getRequest(cardUrls.GET_CARD_TRANSACTIONS(id), true);
	};
}
