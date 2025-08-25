import BaseMethods from "../../baseMethods";
import { cardsUrls } from "../urls";

export class CardService {
	static get_cards = ({ token }: { token: string }) => {
		let query_params: any = {};
		return BaseMethods.getRequest(
			cardsUrls.GET_CARDS,
			true,
			query_params,
			token
		);
	};

	static create_card = ({ token, data }: { token: string; data: any }) => {
		return BaseMethods.postFileRequest(
			cardsUrls.CREATE_CARD,
			data,
			true,
			{},
			token
		);
	};

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
