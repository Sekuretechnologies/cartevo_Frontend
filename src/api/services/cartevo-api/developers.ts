import BaseMethods from "../../baseMethods";
import { developersUrls } from "../urls";

export class DevelopersService {
	static get_developer_settings = ({ token }: { token: string }) => {
		let query_params: any = {};
		return BaseMethods.getRequest(
			developersUrls.GET_DEVELOPER_SETTINGS,
			true,
			query_params,
			token
		);
	};

	static update_webhook = ({ token, data }: { token: string; data: any }) => {
		return BaseMethods.putRequest(
			developersUrls.UPDATE_WEBHOOK,
			data,
			true,
			{},
			token
		);
	};

	static regenerate_credentials = ({ token }: { token: string }) => {
		return BaseMethods.postRequest(
			developersUrls.REGENERATE_CREDENTIALS,
			{},
			true,
			{},
			token
		);
	};
}
