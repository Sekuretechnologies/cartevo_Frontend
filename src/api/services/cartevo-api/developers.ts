import BaseMethods from "../../baseMethods";
import { developersUrls } from "../urls";
import { UpdateDeveloperSettingsRequest } from "@/types/settings";

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

	static update_developer_settings = ({
		token,
		data,
	}: {
		token: string;
		data: UpdateDeveloperSettingsRequest;
	}) => {
		return BaseMethods.putRequest(
			developersUrls.UPDATE_DEVELOPER_SETTINGS,
			data,
			true,
			{}
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
